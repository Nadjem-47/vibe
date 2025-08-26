import { inngest } from "./client"
import { Sandbox } from "@e2b/code-interpreter"
import {
  openai,
  createAgent,
  createTool,
  createNetwork,
  type Tool,
  createState,
  Message,
} from "@inngest/agent-kit"

import { getSandbox, lastAssistantTextMessageContent } from "./utils"
import { z } from "zod";
import { FRAGMENT_TITLE_PROMPT, PROMPT, RESPONSE_PROMPT } from "@/propmt"
import { prisma } from "@/lib/db"

interface AgentState {
  summary?: string
  files?: { [path: string]: string }
}

export const agentKit = inngest.createFunction(
  { id: "ai-prompt" },
  { event: "ai/prompt" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      // Create a new sandbox
      const sbx = await Sandbox.create("vibe-nextjs-test-NDN")

      return sbx.sandboxId
    })

    const previousMessages = await step.run(
      "get-previous-messages",
      async () => {
        // Fetch previous messages from the database
        const messages = await prisma.message.findMany({
          where: {
            projectId: event.data.projectId,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        })

        return messages.map((message) => ({
          type: "text",
          role: message.role === "ASSISTANT" ? "assistant" : "user",
          content: message.content,
        }))
      }
    )

    const state = createState<AgentState>(
      {
        summary: "",
        files: {},
      },
      {
        messages: previousMessages as unknown as Message[],
      }
    )

    /*TODO: activate this after we pay to the AI agent */
    const codeAgent = createAgent<AgentState>({
      name: "code-agent",
      description: "An expert coding agent",
      system: PROMPT,
      model: openai({
        model: "gpt-4.1",
        defaultParameters: {
          temperature: 0.1,
        },
      }),
      tools: [
        createTool({
          name: "terminal",
          description: "Use the Terminal to run commands",
          parameters: z.object({
            command: z.string(),
          }),
          handler: async ({ command }, { step }: Tool.Options<AgentState>) => {
            return await step?.run("run-command", async () => {
              const buffers = { stdout: "", stderr: "" }
              try {
                const sandbox = await getSandbox(sandboxId)
                const result = await sandbox.commands.run(command, {
                  onStdout: (data) => {
                    buffers.stdout += data.toString()
                    console.log(data.toString())
                  },
                  onStderr: (data) => {
                    buffers.stderr += data.toString()
                    console.error(data.toString())
                  },
                })
                return result
              } catch (error) {
                console.error(
                  `Command failed: ${error}\nstdout: ${buffers.stdout} \nstderr: ${buffers.stderr}`
                )
                return `Command failed: ${error}\nstdout: ${buffers.stdout} \nstderr: ${buffers.stderr}`
              }
            })
          },
        }),
        createTool({
          name: "createOrUpdateFile",
          description: "Create or update file in the sandbox",
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string(),
                content: z.string(),
              })
            ),
          }),
          handler: async (
            { files },
            { step, network }: Tool.Options<AgentState>
          ) => {
            const newFiles = await step?.run(
              "create-or-update-files",
              async () => {
                try {
                  const updateFiles = network.state.data.files || {}
                  const sandbox = await getSandbox(sandboxId)
                  for (const file of files) {
                    await sandbox.files.write(file.path, file.content)
                    updateFiles[file.path] = file.content
                  }
                  return updateFiles
                } catch (error) {
                  console.error(`Failed to create or update files: ${error}`)
                  return `Failed to create or update files: ${error}`
                }
              }
            )
            if (typeof newFiles === "object") {
              network.state.data.files = newFiles
            }
          },
        }),
        createTool({
          name: "readFiles",
          description: "Read files from the sandbox",
          parameters: z.object({
            paths: z.array(z.string()),
          }),
          handler: async ({ paths }, { step }: Tool.Options<AgentState>) => {
            return await step?.run("read-files", async () => {
              try {
                const sandbox = await getSandbox(sandboxId)
                const contents = []
                for (const path of paths) {
                  contents.push({
                    path,
                    content: await sandbox.files.read(path),
                  })
                }
                return JSON.stringify(contents)
              } catch (error) {
                console.error(`Failed to read files: ${error}`)
                return `Failed to read files: ${error}`
              }
            })
          },
        }),
      ],
      lifecycle: {
        onResponse: async ({ result, network }) => {
          const lastAssistantMessage = lastAssistantTextMessageContent(result)

          if (lastAssistantMessage && network) {
            if (lastAssistantMessage?.includes("<task_summary>")) {
              network.state.data.summary = lastAssistantMessage
              console.log("Task summary found:", lastAssistantMessage)
            }
          }

          return result
        },
      },
    })

    const network = createNetwork<AgentState>({
      name: "code-agent-network",
      agents: [codeAgent],
      maxIter: 10,
      defaultState: state,
      router: async ({ network }) => {
        const summary = network.state.data.summary
        if (summary) {
          console.log("Network summary:", summary)
          return codeAgent
        }

        return codeAgent
      },
    })

    const result = await network.run(event.data.value, { state })

    const fragmentTitleGenerator = createAgent<AgentState>({
      name: "fragment-title-generator",
      description: "A fragment title generator",
      system: FRAGMENT_TITLE_PROMPT,
      model: openai({
        model: "gpt-4.0",
      }),
    })

    const responseGenerator = createAgent<AgentState>({
      name: "fragment-title-generator",
      description: "A fragment title generator",
      system: RESPONSE_PROMPT,
      model: openai({
        model: "gpt-4.0",
      }),
    })

    const { output: fragmentTitleOutput } = await fragmentTitleGenerator.run(
      result.state.data.summary || "No summary provided"
    )
    const { output: responseOutput } = await responseGenerator.run(
      result.state.data.summary || "No summary provided"
    )

    const generateFragmentTitle = () => {
      if (fragmentTitleOutput[0]?.type !== "text") return "Fragment"

      if (Array.isArray(fragmentTitleOutput[0]?.content)) {
        const title = fragmentTitleOutput[0]?.content.map((t) => t).join(" ")
        return title
      } else {
        return fragmentTitleOutput[0]?.content
      }
    }

    const generatResponse = () => {
      if (responseOutput[0]?.type !== "text") return "Here you go"

      if (Array.isArray(responseOutput[0]?.content)) {
        const title = responseOutput[0]?.content.map((t) => t).join(" ")
        return title
      } else {
        return responseOutput[0]?.content
      }
    }

    const isError =
      !result.state.data.summary ||
      Object.keys(result.state.data.files || {}).length === 0

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId)
      const host = sandbox.getHost(3000)
      return `https://${host}`
    })

    await step.run("save-result", async () => {
      if (isError) {
        console.error("Error in LLM result:", result.state.data.summary)
        return await prisma.message.create({
          data: {
            projectId: event.data.projectId,
            content: "Something went wrong please try again",
            role: "ASSISTANT",
            type: "ERROR",
          },
        })
      }

      return await prisma.message.create({
        data: {
          projectId: event.data.projectId,
          content: generatResponse(),
          role: "ASSISTANT",
          type: "RESULT",
          fragment: {
            create: {
              sandboxUrl: sandboxUrl,
              title: generateFragmentTitle(),
              files: result.state.data.files || {},
            },
          },
        },
      })
    })

    return {
      url: sandboxUrl,
      title: "Fragment",
      files: result.state.data.files,
      summary: result.state.data.summary,
    }
  }
)

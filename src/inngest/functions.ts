import { inngest } from "./client"
import { Sandbox } from "@e2b/code-interpreter"
import {
  openai,
  createAgent,
  createTool,
  createNetwork,
} from "@inngest/agent-kit"

import { getSandbox, lastAssistantTextMessageContent } from "./utils"
import z from "zod"
import { PROMPT } from "@/propmt"

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      // Create a new sandbox
      const sbx = await Sandbox.create("vibe-nextjs-test-NDN")
      return sbx.sandboxId
    })

    /*TODO: activate this after we pay to the AI agent */
    const codeAgent = createAgent({
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
          handler: async ({ command }, { step }) => {
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
          handler: async ({ files }, { step, network }) => {
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
          handler: async ({ files }, { step }) => {
            return await step?.run("read-files", async () => {
              try {
                const sandbox = await getSandbox(sandboxId)
                const contents = []
                for (const path of files) {
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
              network.state.data.taskSummary = lastAssistantMessage
              console.log("Task summary found:", lastAssistantMessage)
            }
          }

          return result
        },
      },
    })

    const network = createNetwork({
      name: "code-agent-network",
      agents: [codeAgent],
      maxIter: 10,
      router: async ({ network }) => {
        const summary = network.state.data.summary
        if (summary) {
          console.log("Network summary:", summary)
          return codeAgent
        }

        return codeAgent
      },
    })

    const result = await network.run(event.data.value)


    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId)
      const host = sandbox.getHost(3000)
      return `https://${host}`
    })

    console.log(sandboxUrl, "sandboxId")

    return { 
      url: sandboxUrl, 
      title: "Fragment", 
      files: result.state.data.files, 
      summary: result.state.data.summary,
     }
  }
)

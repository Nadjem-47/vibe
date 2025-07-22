import { inngest } from "./client"
import { Sandbox } from "@e2b/code-interpreter"
import { getSandbox } from "./utils"

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      // Create a new sandbox
      const sbx = await Sandbox.create("desktop")
      return sbx.sandboxId
    })

    console.log(sandboxId, "sandboxId")

    await step.sleep("wait-a-moment", "1s")

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      // Connect to the sandbox
      const sandbox = await getSandbox(sandboxId)
      const host = sandbox.getHost(3000)
      return  `https://${host}`
    })
    
    return { message: `Hello ${event.data.email}!` , sandboxUrl}
  }
)

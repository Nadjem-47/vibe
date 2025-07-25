import { Sandbox } from "@e2b/code-interpreter"
import { AgentResult, TextMessage } from "@inngest/agent-kit"

export async function getSandbox(sandboxID: string) {
  const sandbox = await Sandbox.connect(sandboxID)
  return sandbox
}



export function lastAssistantTextMessageContent(result: AgentResult): string | undefined {
  const index = result.output.findIndex((message) => message.role === "assistant")
  const message = result.output[index] as | TextMessage | undefined
  return message?.content ? typeof message.content === "string" ? message.content : message.content.map(c => c.text).join("") : undefined
}

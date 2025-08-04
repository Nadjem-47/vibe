import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"
import React, { useRef, useEffect } from "react"
import { MessageCard } from "./message-card"
import { Fragment, Message } from "@/generated/prisma"
import { MessageForm } from "./message-form"
import { MessageLoading } from "./message-loading"

interface Props {
  projectId: string
  activeFragment: Fragment | null
  setActiveFragment: React.Dispatch<React.SetStateAction<Fragment | null>>
}

const mockFragments: Fragment[] = [
  {
    id: "f1",
    messageId: "1",
    sandboxUrl: "https://chatgpt.com/",
    title: "Sandbox Example 1",
    files: { "index.js": "// code here" },
    createdAt: "2025-10-11T00:00:00.000Z",
    updatedAt: "2025-10-11T00:00:00.000Z",
  },
  {
    id: "f2",
    messageId: "3",
    sandboxUrl: "https://chatgpt.com/",
    title: "Sandbox Example 3",
    files: { "main.ts": "// typescript code" },
    createdAt: "2025-10-11T00:00:00.000Z",
    updatedAt: "2025-10-11T00:00:00.000Z",
  },
]

const mockMessages: (Message & { fragment: Fragment | null })[] = [
  {
    id: "1",
    content: "Hello, how can I help you?",
    role: "ASSISTANT",
    fragment: mockFragments[0],
    createdAt: "2025-10-11T00:00:00.000Z",
    updatedAt: "2025-10-11T00:00:00.000Z",
    type: "RESULT",
    projectId: "p1",
  },
  {
    id: "2",
    content: "I need help with my Next.js app.",
    role: "USER",
    fragment: null,
    createdAt: "2025-10-11T00:00:00.000Z",
    updatedAt: "2025-10-11T00:00:00.000Z",
    type: "RESULT",
    projectId: "p1",
  },
  {
    id: "3",
    content: "Sure! What issue are you facing?",
    role: "ASSISTANT",
    fragment: mockFragments[1],
    createdAt: "2025-10-11T00:00:00.000Z",
    updatedAt: "2025-10-11T00:00:00.000Z",
    type: "RESULT",
    projectId: "p1",
  },
  {
    id: "4",
    content: "This is error",
    role: "ASSISTANT",
    fragment: null,
    createdAt: "2025-10-11T00:00:00.000Z",
    updatedAt: "2025-10-11T00:00:00.000Z",
    type: "ERROR",
    projectId: "p1",
  },
];

export const MessagesContainer = ({
  projectId,
  activeFragment,
  setActiveFragment,
}: Props) => {
  const trpc = useTRPC()
  const bottomRef = useRef<HTMLDivElement>(null)

  const { data: messages } = useSuspenseQuery(
    trpc.messages.getMany.queryOptions(
      {
        projectId: projectId,
      },
      {
         // TODO Temp life message update
        refetchInterval: 500,
      }
    )
  )

  useEffect(() => {
    const lastAssistantMessageWithFragment = mockMessages.findLast(
      (m) => m.role === "ASSISTANT" && !!m.fragment
    )
    console.log(
      lastAssistantMessageWithFragment,
      "lastAssistantMessageWithFragment"
    )

    if (lastAssistantMessageWithFragment) {
      setActiveFragment(lastAssistantMessageWithFragment.fragment)
    }
  }, [setActiveFragment])

  useEffect(() => {
    bottomRef.current?.scrollIntoView()
  }, [mockMessages.length])

  const lastMessage = messages[messages.length - 1]
  const isLastMessageUser = lastMessage.role === "USER"

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="pt-2 pr-1 gap-2">
          {mockMessages.map((m) => {
            return (
              <MessageCard
                key={m.id}
                content={m.content}
                role={m.role}
                fragment={m.fragment}
                createdAt={m.createdAt}
                isActiveFragment={activeFragment?.id === m.fragment?.id}
                onFragmentClick={() => {
                  setActiveFragment(m.fragment)
                }}
                type={m.type}
              />
            )
          })}
          {isLastMessageUser && <MessageLoading />}
          <div ref={bottomRef} />
        </div>
      </div>
      <div className="relative p-3 pt-1">
        <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-background pointer-events-none"></div>
        <MessageForm projectId={projectId} />
      </div>
    </div>
  )
}

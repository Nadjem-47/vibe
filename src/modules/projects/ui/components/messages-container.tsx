import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"
import React, { useRef, useEffect } from "react"
import { MessageCard } from "./message-card"
import { Fragment } from "@/generated/prisma"
import { MessageForm } from "./message-form"
import { MessageLoading } from "./message-loading"
import { mockMessages } from "./mock-data"

interface Props {
  projectId: string
  activeFragment: Fragment | null
  setActiveFragment: React.Dispatch<React.SetStateAction<Fragment | null>>
}

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

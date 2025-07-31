import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import React, { useRef , useEffect } from 'react'
import { MessageCard } from './message-card';
import { Fragment, Message } from '@/generated/prisma';
import { MessageForm } from './message-form';

interface Props {
    projectId: string
}


    const mockFragments: Fragment[] = [
        {
            id: 'f1',
            messageId: '1',
            sandboxUrl: 'https://sandbox.example.com/1',
            title: 'Sandbox Example 1',
            files: { 'index.js': '// code here' },
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'f2',
            messageId: '3',
            sandboxUrl: 'https://sandbox.example.com/3',
            title: 'Sandbox Example 3',
            files: { 'main.ts': '// typescript code' },
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];

    const mockMessages: Message[] = [
        {
            id: '1',
            content: 'Hello, how can I help you?',
            role: 'ASSISTANT',
            fragments: mockFragments[0],
            createdAt: new Date(),
            type: 'RESULT',
        },
        {
            id: '2',
            content: 'I need help with my Next.js app.',
            role: 'USER',
            fragments: null,
            createdAt: new Date(),
            type: 'RESULT',
        },
        {
            id: '3',
            content: 'Sure! What issue are you facing?',
            role: 'ASSISTANT',
            fragments: mockFragments[1],
            createdAt: new Date(),
            type: 'RESULT',
        },
    ];

export const MessagesContainer = ({ projectId }: Props) => {
     const trpc = useTRPC()
    const bottomRef = useRef<HTMLDivElement>(null)

     const { data: messages } = useSuspenseQuery(trpc.messages.getMany.queryOptions({
         projectId: projectId
     }))

     useEffect(() => {
       const lastAssistantMessage = messages.findLast(m => m.role === "ASSISTANT")

       if (lastAssistantMessage) {
        // TODO set active fragment
       }
     }, [messages])

    useEffect(() => {
       bottomRef.current?.scrollIntoView();
     }, [messages.length])
     
     
    return (
        <div className='flex flex-col flex-1 min-h-0'>
            <div className='flex-1 min-h-0 overflow-y-auto'>
                <div className="pt-2 pr-1 gap-2">

                    {
                        messages.map((m) => {
                            return (
                                <MessageCard 
                                    key={m.id} 
                                    content={m.content} 
                                    role={m.role} 
                                    fragment={m.fragments} 
                                    createdAt={m.createdAt}
                                    onFragmentClick={() => {}}
                                    type={m.type}
                                />
                            )
                        })
                    }
                    <div ref={bottomRef}/>
                </div>
            </div>
            <div className="relative p-3 pt-1"><div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-background pointer-events-none"></div><MessageForm  projectId={projectId}/></div>

        </div>
    )
}



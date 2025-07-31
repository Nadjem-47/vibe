"use client"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import React, { Suspense } from 'react'
import { MessagesContainer } from '../components/messages-container';

interface Props {
    projectId: string
}

export const ProjectView = ({ projectId }: Props) => {
    // const trpc = useTRPC()

    // const { data: project } = useSuspenseQuery(trpc.projects.getOne.queryOptions({
    //     id: projectId
    // }))

    return (
        <div className='h-screen'>

            <ResizablePanelGroup
                direction="horizontal"
            >
                <ResizablePanel defaultSize={35} className='flex flex-col min-h-0'>
                    <Suspense fallback={<p>Loading messages ...</p>}>
                        <MessagesContainer projectId={projectId} />
                    </Suspense>

                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={65}>
                    TODO: preview
                </ResizablePanel>
            </ResizablePanelGroup>

        </div>
    )
}



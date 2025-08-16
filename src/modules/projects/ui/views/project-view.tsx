"use client"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import React, { Suspense, useState } from "react"
import { MessagesContainer } from "../components/messages-container"
import { Fragment } from "@/generated/prisma"
import { ProjectHeader } from "../components/project-header"
import { FragmentWeb } from "../components/fragment-web"
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs"
import { CodeIcon, CrownIcon, EyeIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileCollection, FileExplorer } from "@/components/file-explorer"
import { useAuth, UserButton } from "@clerk/nextjs"

interface Props {
  projectId: string
}

export const ProjectView = ({ projectId }: Props) => {
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null)
  const [tabsState, setTabState] = useState<"preview" | "code">("preview")

  const { has } = useAuth()
  const hasProAccess = has?.({ plan: "pro" })

  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={35} className="flex flex-col min-h-0">
          <Suspense fallback={<p>Loading projet ...</p>}>
            <ProjectHeader projectId={projectId} />
          </Suspense>
          <Suspense fallback={<p>Loading messages ...</p>}>
            <MessagesContainer
              projectId={projectId}
              activeFragment={activeFragment}
              setActiveFragment={setActiveFragment}
            />
          </Suspense>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={65}>
          <Tabs
            className="h-full gap-y-0"
            defaultValue="preview"
            value={tabsState}
            onValueChange={(v) => setTabState(v as "preview" | "code")}
          >
            <div className="w-full flex items-center p-2 border-b gap-x-2">
              <TabsList className="h-8 p-0 border rounded-md">
                <TabsTrigger value="preview" className="rounded-md">
                  <EyeIcon />
                  <span>Demo</span>
                </TabsTrigger>
                <TabsTrigger value="code" className="rounded-md">
                  <CodeIcon />
                  <span>Code</span>
                </TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-x-2">
                {!hasProAccess && (
                  <Button asChild size="sm" variant="default">
                    <Link href="/pricing">
                      <CrownIcon /> Upgrade
                    </Link>
                  </Button>
                )}

                <UserButton />
              </div>
            </div>

            <TabsContent value="preview">
              {!!activeFragment && <FragmentWeb data={activeFragment} />}
            </TabsContent>

            <TabsContent value="code" className="min-h-0">
              {!!activeFragment?.files && (
                <FileExplorer files={activeFragment.files as FileCollection} />
              )}
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

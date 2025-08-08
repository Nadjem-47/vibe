import React, { useState, useCallback, useMemo } from "react"

import { CopyIcon, CheckIcon } from "lucide-react"
import { Hint } from "@/modules/projects/ui/components/hint"
import { Button } from "./ui/button"
import { CodeView } from "./code-view"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb"
import { convertFilesToTreeItems } from "@/lib/utils"
import { TreeView } from "./tree-view"

export type FileCollection = { [path: string]: string }

function getLanguageFromExtension(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase()
  return extension ?? "text"
}

function generateBreadcrumbs(filePath: string) {
  const parts = filePath.split('/')
  const breadcrumbs = []
  
  // Always start with Root
  breadcrumbs.push({ name: 'Root', path: '', isLast: false })
  
  // Build up the path for each part
  let currentPath = ''
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    if (part) {
      currentPath = currentPath ? `${currentPath}/${part}` : part
      breadcrumbs.push({
        name: part,
        path: currentPath,
        isLast: i === parts.length - 1
      })
    }
  }
  
  return breadcrumbs
}

export interface FileExplorerProps {
  files: FileCollection
}

function FileExplorer({ files }: FileExplorerProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(() => {
    const fileKeys = Object.keys(files)
    return fileKeys.length > 0 ? fileKeys[0] : null
  })
  const [copied, setCopied] = useState(false)

  const treeData = useMemo(() => convertFilesToTreeItems(files), [files])

  const handleFileSelect = useCallback(
    (path: string) => {
      console.log(path, files, files[path])

      if (files[path]) {
        setSelectedFile(path)
      }
    },
    [files]
  )

  const handleCopy = useCallback(async () => {
    if (selectedFile && files[selectedFile]) {
      try {
        await navigator.clipboard.writeText(files[selectedFile])
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy file content:', err)
      }
    }
  }, [selectedFile, files])

  const breadcrumbs = useMemo(() => {
    return selectedFile ? generateBreadcrumbs(selectedFile) : []
  }, [selectedFile])

  const renderBreadcrumbs = useCallback(() => {
    if (breadcrumbs.length <= 4) {
      return breadcrumbs.map((breadcrumb, index) => (
        <React.Fragment key={index}>
          <BreadcrumbItem>
            {breadcrumb.isLast ? (
              <BreadcrumbPage>{breadcrumb.name}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink 
                onClick={() => {
                  if (breadcrumb.path && files[breadcrumb.path]) {
                    setSelectedFile(breadcrumb.path)
                  }
                }}
                className="cursor-pointer hover:text-primary"
              >
                {breadcrumb.name}
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
          {index < breadcrumbs.length - 1 && (
            <BreadcrumbSeparator>
              <span className="text-muted-foreground">&gt;</span>
            </BreadcrumbSeparator>
          )}
        </React.Fragment>
      ))
    }

    // Handle more than 4 items with ellipsis
    const firstItem = breadcrumbs[0]
    const lastItem = breadcrumbs[breadcrumbs.length - 1]

    return (
      <>
        <BreadcrumbItem>
          <BreadcrumbLink 
            onClick={() => {
              if (firstItem.path && files[firstItem.path]) {
                setSelectedFile(firstItem.path)
              }
            }}
            className="cursor-pointer hover:text-primary"
          >
            {firstItem.name}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <span className="text-muted-foreground">&gt;</span>
        </BreadcrumbSeparator>
        
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        
        <BreadcrumbSeparator>
          <span className="text-muted-foreground">&gt;</span>
        </BreadcrumbSeparator>
        
        <BreadcrumbItem>
          {lastItem.isLast ? (
            <BreadcrumbPage>{lastItem.name}</BreadcrumbPage>
          ) : (
            <BreadcrumbLink 
              onClick={() => {
                if (lastItem.path && files[lastItem.path]) {
                  setSelectedFile(lastItem.path)
                }
              }}
              className="cursor-pointer hover:text-primary"
            >
              {lastItem.name}
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>
      </>
    )
  }, [breadcrumbs, files, setSelectedFile])

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={30} minSize={30} className="bg-sidebar">
        <TreeView
          data={treeData}
          value={selectedFile}
          onSelect={handleFileSelect}
        />
      </ResizablePanel>

      <ResizableHandle className="hover:bg-primary transition-colors" />

      <ResizablePanel defaultSize={70} minSize={50} className="bg-sidebar-alt">
        {selectedFile ? (
          <div className="h-full w-full flex flex-col">
            <div className="border-b bg-sidebar px-4 py-2 flex justify-between items-center gap-x-2">
              <Breadcrumb>
                <BreadcrumbList>
                  {renderBreadcrumbs()}
                </BreadcrumbList>
              </Breadcrumb>

              <Hint text={copied ? "Copied!" : "Copy to clipboard"} side="bottom">
                <Button
                  variant="outline"
                  size="icon"
                  className="ml-auto"
                  onClick={handleCopy}
                  disabled={!files[selectedFile]}
                >
                  {copied ? (
                    <CheckIcon className="w-4 h-4 text-green-600" />
                  ) : (
                    <CopyIcon className="w-4 h-4" />
                  )}
                </Button>
              </Hint>
            </div>

            <div className="flex-1 overflow-auto">
              <CodeView
                code={files[selectedFile]}
                lang={getLanguageFromExtension(selectedFile)}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Select a file to view the code</p>
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export { FileExplorer }

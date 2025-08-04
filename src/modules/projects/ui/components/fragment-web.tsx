"use client"

import { Fragment, MessageRole, MessageType } from "@/generated/prisma"
import Image from "next/image"
import { format } from "date-fns"
import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { ExternalLinkIcon, RefreshCcwIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Hint } from "./hint"

interface Props {
  data: Fragment
}

export const FragmentWeb = ({ data }: Props) => {
  const [fragmentKey, setfragmentKey] = useState(0)
  const [copied, setCopied] = useState(false)

  const onRefrech = () => {
    setfragmentKey((prev) => prev + 1)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(data.sandboxUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="p-2 border-b bg-sidebar flex items-center gap-x-2">
        <Hint text="Refrech">
          <Button size="sm" variant={"outline"} onClick={onRefrech}>
            <RefreshCcwIcon />
          </Button>
        </Hint>
        <Hint text="Copie to Clipboard">
          <Button
            size="sm"
            variant={"outline"}
            className="flex-1 justify-start text-start font-normal"
            disabled={!data.sandboxUrl || copied}
            onClick={handleCopy}
          >
            <span className="truncate">{data.sandboxUrl}</span>
          </Button>
        </Hint>

        <Hint text="Open in a new Tab">
          <Button
            size="sm"
            disabled={!data.sandboxUrl}
            variant={"outline"}
            className="hover:cursor-auto"
            onClick={() => {
              if (!data.sandboxUrl) return
              window.open(data.sandboxUrl, "_blank")
            }}
          >
            <ExternalLinkIcon />
          </Button>
        </Hint>
      </div>
      <iframe
        key={fragmentKey}
        src={data.sandboxUrl}
        className="h-full w-full"
        loading="lazy"
        sandbox="allow-forms allow-scripts allow-same-origin"
      ></iframe>
    </div>
  )
}

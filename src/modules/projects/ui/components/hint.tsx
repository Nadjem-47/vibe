"use client"

import { Fragment, MessageRole, MessageType } from "@/generated/prisma"
import Image from "next/image"
import { format } from "date-fns"
import React from "react"
import { cn } from "@/lib/utils"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { TooltipProvider } from "@radix-ui/react-tooltip"

interface HintProps {
  children: React.ReactNode
  text: string
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
}

export const Hint = ({
  children,
  text,
  side = "top",
  align = "center",
}: HintProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} align={align}>
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

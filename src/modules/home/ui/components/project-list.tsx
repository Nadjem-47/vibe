"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import TextareaAutosize from "react-textarea-autosize"
import z from "zod"
import { toast } from "sonner"
import { ArrowUpIcon, Loader2Icon } from "lucide-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useTRPC } from "@/trpc/client"
import { Button } from "@/components/ui/button"
import { Form, FormField } from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { PROJECT_TEMPLATES } from "./constants"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import Image from "next/image"

const schema = z.object({
  value: z
    .string()
    .min(1, { message: "Message cannot be empty" })
    .max(1000, { message: "Prompt is too long" }),
})

export const ProjectsList = () => {
  const trpc = useTRPC()
  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { value: "" },
  })

  const { data: projects } = useQuery(trpc.projects.getMany.queryOptions())

  console.log(projects, "projects")

  return (
    <div className="w-full bg-white dark:bg-sidebar rounded-xl p-8 border flex flex-col gap-y-6 sm:gap-y-4">
      <h2 className="text-2xl font-semibold">Previous Projects</h2>
      <ul className="flex flex-col gap-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {projects?.length === 0 && (
            <div className="col-span-full text-center">
              <p className="text-sm text-muted-foreground">No projects found</p>
            </div>
          )}

          {projects && projects.length > 0 && (
              projects.map((project) => (
                <Button
                  variant="outline"
                  key={project.id}
                  className="font-normal h-auto justify-start w-full text-start p-4"
                  asChild
                >
                  <Link href={`/project/${project.id}`}>
                    <div className="flex items-center gap-x-4">
                      <Image
                        src="/logo.svg"
                        alt="Project Logo"
                        width={32}
                        height={32}
                        className="object-contain"
                      />

                      <div className="flex flex-col">
                        <h3 className="truncate font-medium">
                          {project.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {formatDistanceToNow(project.updatedAt, { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </Link>
                </Button>
              ))
          )}
        </div>
      </ul>
    </div>
  )
}

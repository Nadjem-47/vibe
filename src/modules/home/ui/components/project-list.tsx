"use client"

import React from "react"
import { useTRPC } from "@/trpc/client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import Image from "next/image"
import { useQuery } from "@tanstack/react-query"

export const ProjectsList = () => {
  const trpc = useTRPC()

  const { data: projects } = useQuery(trpc.projects.getMany.queryOptions())

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

          {projects &&
            projects.length > 0 &&
            projects.map((project) => (
              <Button
                variant="outline"
                key={project.id}
                className="font-normal h-auto justify-start w-full text-start p-4"
                asChild
              >
                <Link href={`/projects/${project.id}`}>
                  <div className="flex items-center gap-x-4">
                    <Image
                      src="/logo.svg"
                      alt="Project Logo"
                      width={32}
                      height={32}
                      className="object-contain"
                    />

                    <div className="flex flex-col">
                      <h3 className="truncate font-medium">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(project.updatedAt, {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                </Link>
              </Button>
            ))}
        </div>
      </ul>
    </div>
  )
}

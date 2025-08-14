"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import TextareaAutosize from "react-textarea-autosize"
import z from "zod"
import { toast } from "sonner"
import { ArrowUpIcon, Loader2Icon } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTRPC } from "@/trpc/client"
import { Button } from "@/components/ui/button"
import { Form, FormField } from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { PROJECT_TEMPLATES } from "./constants"

const schema = z.object({
  value: z
    .string()
    .min(1, { message: "Message cannot be empty" })
    .max(1000, { message: "Prompt is too long" }),
})

export const ProjectForm = () => {
  const router = useRouter()

  const [isFocused, setIsFocused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const trpc = useTRPC()

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { value: "" },
  })

  const queryClient = useQueryClient()

  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onMutate: () => setIsLoading(true),
      onSuccess: (data) => {
        queryClient.invalidateQueries(trpc.projects.getMany.queryOptions())

        router.push(`/projects/${data.id}`)
      },
      onError: (err) => toast.error(err.message),
      onSettled: () => setIsLoading(false),
    })
  )

  const isPending = createProject.isPending
  const isDisabled = isPending || !form.formState.isValid

  const onSubmit = form.handleSubmit((values) => {
    createProject.mutateAsync({ ...values })
  })

  return (
    <Form {...form} >
      <section className="py-6">
        <form
          onSubmit={onSubmit}
          className={cn(
            "relative border p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all",
            isFocused && "shadox-xs"
          )}
        >
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <TextareaAutosize
                  {...field}
                  minRows={2}
                  maxRows={8}
                  className="pt-4 resize-none border-none w-full outline-none bg-transparent"
                  placeholder="What whould like to build"
                  disabled={isPending}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                      e.preventDefault()
                      onSubmit(e)
                    }
                  }}
                />
              </div>
            )}
          />

          <div className="flex gap-x-2 items-end justify-between pt-2">
            <div className="text-[10px] text-muted-foreground font-mono">
              <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <span>&#9166;</span>Enter
              </kbd>
              &nbsp; To submit
            </div>

            <Button
              disabled={isDisabled}
              className={cn(
                "size-8 rounded-full cursor-pointer",
                isDisabled && "bg-muted-foreground border"
              )}
            >
              {isPending ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                <ArrowUpIcon />
              )}
            </Button>
          </div>
        </form>
      </section>

      <div className="flex-wrap justify-center gap-2 hidden md:flex max-w-3xl space-t-4">
        {PROJECT_TEMPLATES.map((template) => (
          <Button
            key={template.title}
            variant={"outline"}
            size={"sm"}
            className="bg-white dark:bg-sidebar cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 flex items-center gap-2"
            onClick={() => {
              // Set the form's "value" field to the template's text
              form.setValue("value", template.prompt, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
              })
              // Focus the textarea
              const textarea = document.querySelector<HTMLTextAreaElement>(
                "textarea[name='value']"
              )
              textarea?.focus()
            }}
          >
            <span className="text-2xl">{template.emoji}</span>
            <h3 className="font-bold">{template.title}</h3>
          </Button>
        ))}
      </div>
    </Form>
  )
}

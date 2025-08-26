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
import { Usage } from "./usage"
import { useRouter } from "next/navigation"

interface MessageFormProps {
  projectId: string
}

const schema = z.object({
  value: z
    .string()
    .min(1, { message: "Message cannot be empty" })
    .max(1000, { message: "Prompt is too long" }),
})

export const MessageForm = ({ projectId }: MessageFormProps) => {
  const trpc = useTRPC()
  const router = useRouter()

  const { data: usage } = useQuery(trpc.usage.status.queryOptions())

  const [isFocused, setIsFocused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  console.log(usage, "USAGE")

  const showUsage = !!usage

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { value: "" },
  })

  const queryClient = useQueryClient()

  const createMessage = useMutation(
    trpc.messages.create.mutationOptions({
      onMutate: () => setIsLoading(true),
      onSuccess: () => {
        form.reset()
        queryClient.invalidateQueries(
          trpc.messages.getMany.queryOptions({ projectId })
        )
      },
      onError: (err) => {
        toast.error(err.message)
        if (err.data?.code === "TOO_MANY_REQUESTS") {
          toast.error("You have run out of credits")
          router.push("/pricing ")
        }
      },
      onSettled: () => setIsLoading(false),
    })
  )

  const isPending = createMessage.isPending
  const isDisabled = isPending || !form.formState.isValid

  const onSubmit = form.handleSubmit((values) => {
    createMessage.mutateAsync({ ...values, projectId })
  })

  return (
    <Form {...form}>
      {showUsage && (
        <Usage
          points={usage.remainingPoints}
          msBeforeNext={usage.msBeforeNext}
        />
      )}
      <form
        onSubmit={onSubmit}
        className={cn(
          "relative border p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all",
          isFocused && "shadox-xs",
          showUsage && "rounded-t-none"
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
              "size-8 rounded-full",
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
    </Form>
  )
}

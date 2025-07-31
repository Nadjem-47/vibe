"use client"

import { useState } from "react"
import { useTRPC } from "@/trpc/client"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function Home() {
  const [input, setInput] = useState("")
  const router = useRouter()

  const trpc = useTRPC()
  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onError: (err) => toast.error(err.message),
      onSuccess: (data) => {
        router.push(`/projects/${data.id}`)
      },
    })
  )

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="font-bold text-rose-500 max-w-md w-full">
        <div className="flex items-center gap-2 justify-center">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type something..."
          />
          <Button
            onClick={() => createProject.mutate({ value: input })}
            variant="default"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  )
}

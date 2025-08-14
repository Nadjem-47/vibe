"use client"

import { useState } from "react"
import { useTRPC } from "@/trpc/client"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ProjectForm } from "@/modules/home/ui/components/project-form"
import { ProjectsList } from "@/modules/home/ui/components/project-list"

export default function Home() {


  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full">
      <section className="space-y-6 py-[16vh] 2xl:py-48">
        <div className="flex flex-col items-center">
          <Image
            src="/logo.svg"
            alt="Vibe Logo"
            width={50}
            height={50}
            className="hidden md:block"
          />
        </div>

        <h1 className="text-2xl md:text-5xl font-bold text-center">
          Build Something with Codex
        </h1>

        <p className="text-lg md:text-xl text-center text-gray-500 max-w-2xl mx-auto">
          Createb Apps and Websites By Chating With AI
        </p>


        <div className="max-w-3xl mx-auto w-full">
          <ProjectForm />
        </div>
      </section>


      <ProjectsList />
    </div>
  )
}

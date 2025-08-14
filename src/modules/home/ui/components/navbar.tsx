"use client"

import React from "react"
import { useTRPC } from "@/trpc/client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import Image from "next/image"
import { useQuery } from "@tanstack/react-query"
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import { Sun, Moon } from "lucide-react"
import { useCurrentTheme } from "@/hooks/useCurrentTheme"

export const Navbar = () => {
  const trpc = useTRPC()
  const { data: projects } = useQuery(trpc.projects.getMany.queryOptions())
  const { theme, setTheme } = useCurrentTheme()

  return (
    <nav className="w-full bg-white dark:bg-sidebar p-4 flex items-center justify-between">
      {/* Left: Logo */}
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={32}
          height={32}
          className="rounded-md"
        />
        <span className="font-bold text-lg">Codex</span>
      </Link>

      {/* Center: Links */}
      <div className="hidden sm:flex items-center gap-6">
        <Link href="/" className="hover:text-blue-500 transition-colors">
          Home
        </Link>
        <Link href="/projects" className="hover:text-blue-500 transition-colors">
          Projects
        </Link>
        {projects && projects.length > 0 && (
          <div className="relative group">
            <button className="hover:text-blue-500 transition-colors">
              Recent
            </button>
            <div className="absolute left-0 top-full mt-2 hidden group-hover:block bg-white dark:bg-sidebar border rounded-lg shadow-lg w-64 p-2 z-50">
              <ul className="space-y-2">
                {projects.slice(0, 5).map((project) => (
                  <li key={project.id}>
                    <Link
                      href={`/projects/${project.id}`}
                      className="flex items-center gap-3 hover:bg-muted rounded-md p-2 transition-colors"
                    >
                      <Image
                        src={`/logo/${project.id}.png`}
                        alt={`${project.name} logo`}
                        width={24}
                        height={24}
                        className="rounded-sm bg-gray-100 dark:bg-gray-800 p-1"
                      />
                      <div className="flex flex-col">
                        <span className="font-medium text-sm truncate">
                          {project.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(project.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Right: Theme toggle + Auth */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="transition-colors"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-700" />
          )}
        </Button>

        {/* Auth buttons */}
        <SignedOut>
          <SignInButton>
            <Button variant="outline" size="sm">Sign In</Button>
          </SignInButton>
          <SignUpButton>
            <Button size="sm">Sign Up</Button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  )
}

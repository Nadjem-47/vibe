import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useSuspenseQueries, useSuspenseQuery } from "@tanstack/react-query"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  EditIcon,
  HomeIcon,
  SunMoonIcon,
} from "lucide-react"
import { useTRPC } from "@/trpc/client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DropdownMenuRadioItem } from "@radix-ui/react-dropdown-menu"

interface Props {
  projectId: string
}

export const ProjectHeader = ({ projectId }: Props) => {
  const trpc = useTRPC()
  const { data: project } = useSuspenseQuery(
    trpc.projects.getOne.queryOptions({ id: projectId })
  )

  const { setTheme, theme } = useTheme()

  return (
    <div className="p-2 justify-between items-center border-b">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="focus-visible:ring-0 hover:bg-transparent hover:opacity-75 transition-opacity pl-2!"
          >
            <Image
              src="/logo.svg"
              alt="vibe"
              width={18}
              height={18}
              className="shrink-0"
            />
            <span className="text-sm font-medium">{project.name}</span>
            <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" side="bottom" align="start">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <HomeIcon className="size-4 text-muted-foreground" />
              <Link href="/">
                <span>Go to Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="gap-2">
                <SunMoonIcon className="size-4 text-muted-foreground" />
                <span>Appearance</span>
              </DropdownMenuSubTrigger>

                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={theme}
                    onValueChange={setTheme}
                  >
                    <DropdownMenuRadioItem  value="light">
                      Light
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark">
                      Dark
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="system">
                      System
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

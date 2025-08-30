import { inngest } from "@/inngest/client"
import { prisma } from "@/lib/db"
import { consumeCredits } from "@/lib/usage"
import { protectedProcedure, createTRPCRouter } from "@/trpc/init"
import { TRPCError } from "@trpc/server"
import { RateLimiterRes } from "rate-limiter-flexible"
import z from "zod"

export const messagesRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        projectId: z.string().min(1, { message: "Project ID is required" }),
      })
    )
    .query(async ({ input, ctx }) => {
      return await prisma.message.findMany({
        where: {
          projectId: input.projectId,
          project: { userId: ctx.auth.userId },
        },
        orderBy: { createdAt: "asc" },
        include: { fragment: true },
      })
    }),
  create: protectedProcedure
    .input(
      z.object({
        value: z
          .string()
          .min(1, { message: "Message cannot be empty" })
          .max(1000, { message: "Prompt is too long" }),
        projectId: z.string().min(1, { message: "Project ID is required" }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const project = await prisma.project.findUnique({
        where: { id: input.projectId, userId: ctx.auth.userId },
      })

      if (!project) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found" })
      }

      try {
        await consumeCredits()
      } catch (error) {


        if (error instanceof RateLimiterRes) {
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: "You have run out of credits",
          })
        } else if (error instanceof Error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error.message || "Something went wrong",
          })
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Unexpected error",
          })
        }
      }

      const newMessage = await prisma.message.create({
        data: {
          projectId: input.projectId,
          content: input.value,
          role: "USER",
          type: "RESULT",
        },
      })


      await inngest.send({
        name: "ai/prompt",
        data: {
          value: input.value,
          projectId: input.projectId,
        },
      })

      return newMessage
    }),
})

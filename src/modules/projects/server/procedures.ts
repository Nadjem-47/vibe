import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/db";
import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";


import { generateSlug } from "random-word-slugs";
import { TRPCError } from "@trpc/server";
import { consumeCredits } from "@/lib/usage";
import { RateLimiterRes } from "rate-limiter-flexible";

export const projectsRouter = createTRPCRouter({
    getOne: protectedProcedure
        .input(
            z.object({
                id: z.string().min(1, { message: "Id is required" })
            })
        )
        .query(async ({ input, ctx }) => {
            const project = await prisma.project.findUnique({ where: { id: input.id, userId: ctx.auth.userId } });


            if (!project) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Project not found" })
            }

            return project
        }),

    getMany: protectedProcedure
        .query(async ({ ctx }) => {
            return await prisma.project.findMany({ where: { userId: ctx.auth.userId }, orderBy: { createdAt: "desc" } });
        }),

    create: protectedProcedure
        .input(
            z.object({
                value: z.string()
                    .min(1, { message: "Message cannot be empty" })
                    .max(1000, { message: "Prompt is too long" }),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const createProject = await prisma.project.create({
                data: {
                    userId: ctx.auth.userId,
                    name: generateSlug(2, {
                        format: "kebab",
                    }),
                    messages: {
                        create: {
                            content: input.value,
                            role: "USER",
                            type: "RESULT",
                        },
                    },
                },
            });



            try {
                await consumeCredits();
            } catch (error) {
                if (error instanceof RateLimiterRes) {
                    // This means the user has exceeded their credits
                    throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "You have run out of credits" });
                } else if (error instanceof Error) {
                    // Generic error (auth missing, db issues, etc.)
                    throw new TRPCError({ code: "BAD_REQUEST", message: error.message || "Something went wrong" });
                } else {
                    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Unexpected error" });
                }
            }


            /*TODO: ACTIVATE AFTER ACTIVATE ai llm*/

            // await inngest.send({
            //     name: "ai/prompt",
            //     data: {
            //         value: input.value,
            //         projectId: createProject.id,
            //     },
            // })

            return createProject;
        }),

})

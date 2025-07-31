import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";



export const messagesRouter = createTRPCRouter({
    getMany: baseProcedure
        .query(async () => {
            return await prisma.message.findMany({ orderBy: { createdAt: "desc" }, include: { fragments: true } });
        }),
    create: baseProcedure
        .input(
            z.object({
                value: z.string()
                    .min(1, { message: "Message cannot be empty" })
                    .max(1000, { message: "Prompt is too long" }),
                projectId: z.string()
                    .min(1, { message: "Project ID is required" })
            })
        )
        .mutation(async ({ input }) => {
            const newMessage = await prisma.message.create({
                data: {
                    projectId: input.projectId,
                    content: input.value,
                    role: "USER",
                    type: "RESULT",
                },
            });

            /*TODO: ACTIVATE AFTER aCTIVATE ai llm*/

            // await inngest.send({
            //     name: "ai/prompt",
            //     data: {
            //         email: input.value,
            //         projectId: input.projectId,
            //     },
            // })

            return newMessage;
        }),

})

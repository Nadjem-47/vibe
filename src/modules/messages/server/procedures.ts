import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";



export const messagesRouter = createTRPCRouter({
    getMany : baseProcedure
    .query(async () => {
        return await prisma.message.findMany({orderBy: {createdAt: "desc"}, include: {fragments: true}});
    }),
    create: baseProcedure
        .input(
            z.object({
                value: z.string().min(1, { message: "Message cannot be empty" }),
            })
        )
        .mutation(async ({ input }) => {
            const newMessage = await prisma.message.create({
                data: {
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
            //     },
            // })

            return newMessage;
        }),

})

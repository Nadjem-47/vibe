import { protectedProcedure, createTRPCRouter } from "@/trpc/init";


import { TRPCError } from "@trpc/server";
import { getUsageStatus } from "@/lib/usage";


export const usageRouter = createTRPCRouter({
    status: protectedProcedure.query(async () => {
        try {
            const usage = await getUsageStatus()
            return usage
        } catch {
           return null
        }
    })
})

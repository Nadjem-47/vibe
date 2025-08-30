import { RateLimiterPrisma } from "rate-limiter-flexible"
import { prisma } from "./db"
import { auth } from "@clerk/nextjs/server"

const GENERATION_COST = 1
const PRO_POINTS = 50
const FREE_POINTS = 3

export async function getUsageTracker() {
  const { has } = await auth()
  const hasProAccess = has?.({ plan: "pro" })

  const usageTracker = new RateLimiterPrisma({
    storeClient: prisma,
    tableName: "Usage",
    keyPrefix: "rateLimiter",
    points: hasProAccess ? PRO_POINTS : FREE_POINTS,
    duration: 30 * 24 * 60 * 60,
  })

  return usageTracker
}

export async function consumeCredits() {
  const { userId } = await auth()
  if (!userId) throw new Error("User not authenticated")

  try {
    const usageTracker = await getUsageTracker()
    const result = await usageTracker.consume(userId, GENERATION_COST)

    return result
  } catch (error) {
    console.error("ERROR consumeCredits", error)
    throw error 
  }
}



export async function getUsageStatus() {
  const { userId } = await auth()
  if (!userId) throw new Error("User not authenticated")

  const usageTracker = await getUsageTracker()

  const record = await prisma.usage.findUnique({
    where: { key: `rateLimiter:${userId}` },
  })

  const consumedPoints = record?.points ?? 0
  const remainingPoints = usageTracker.points - consumedPoints

  return {
    remainingPoints,
    consumedPoints,
    msBeforeNext: 0,
    resetAt: record?.expire ? new Date(record.expire) : null,
  }
}

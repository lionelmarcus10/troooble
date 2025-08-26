import { PrismaClient } from '@prisma/client'

// let prisma = new PrismaClient()

// export default prisma


const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
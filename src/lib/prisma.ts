// src/lib/prisma.ts
import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/generated/prisma/client' // adjust to your actual output path

type GlobalForPrisma = typeof globalThis & { prisma?: PrismaClient }
const globalForPrisma = globalThis as GlobalForPrisma

const dbUrl = process.env.DATABASE_URL
if (!dbUrl) throw new Error('DATABASE_URL is not set')

const adapter = new PrismaPg({
  connectionString: dbUrl,
})

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
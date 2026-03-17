// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';
declare global { var __prisma?: PrismaClient }
export const prisma = global.__prisma ??= new PrismaClient();
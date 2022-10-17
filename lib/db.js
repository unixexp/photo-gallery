import { PrismaClient } from "@prisma/client"

export const prisma = global.prisma || new PrismaClient({log: ["query"]})
global.prisma = prisma

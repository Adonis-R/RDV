import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import prismaPackage from "@prisma/client";

const { PrismaClient } = prismaPackage;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing.");
}

const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({ adapter });

export default prisma;
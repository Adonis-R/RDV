-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CLIENT', 'COMPANY');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'CLIENT';

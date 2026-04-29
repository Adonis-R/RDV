-- CreateEnum
CREATE TYPE "CompanyRole" AS ENUM ('OWNER', 'STAFF');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "companyId" INTEGER,
ADD COLUMN     "companyRole" "CompanyRole";

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

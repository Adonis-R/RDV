/*
  Warnings:

  - A unique constraint covering the columns `[siret]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `activityName` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyType` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalCode` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `siret` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Made the column `phone` on table `Company` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "CompanyType" AS ENUM ('AUTO_ENTREPRENEUR', 'ARTISAN', 'COMMERCANT', 'PROFESSION_LIBERALE', 'SOCIETE', 'ASSOCIATION');

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "activityName" TEXT NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "companyType" "CompanyType" NOT NULL,
ADD COLUMN     "postalCode" TEXT NOT NULL,
ADD COLUMN     "siret" TEXT NOT NULL,
ADD COLUMN     "street" TEXT NOT NULL,
ALTER COLUMN "phone" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Company_siret_key" ON "Company"("siret");

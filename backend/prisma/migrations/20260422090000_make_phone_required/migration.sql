-- AlterTable: make User.phone required
ALTER TABLE "User" ALTER COLUMN "phone" SET NOT NULL;

-- CreateIndex: unique phone on User
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- AlterTable: add phone to Company (optional)
ALTER TABLE "Company" ADD COLUMN "phone" TEXT;

-- CreateIndex: unique phone on Company
CREATE UNIQUE INDEX "Company_phone_key" ON "Company"("phone");

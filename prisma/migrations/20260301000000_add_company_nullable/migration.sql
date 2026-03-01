-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OWNER', 'ADMIN', 'EMPLOYEE');

-- CreateTable: Company
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: Company.slug unique
CREATE UNIQUE INDEX "Company_slug_key" ON "Company"("slug");

-- CreateTable: UserCompany
CREATE TABLE "UserCompany" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'EMPLOYEE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserCompany_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: UserCompany unique + indexes
CREATE UNIQUE INDEX "UserCompany_userId_companyId_key" ON "UserCompany"("userId", "companyId");
CREATE INDEX "UserCompany_userId_idx" ON "UserCompany"("userId");
CREATE INDEX "UserCompany_companyId_idx" ON "UserCompany"("companyId");

-- AddForeignKey: UserCompany → User
ALTER TABLE "UserCompany" ADD CONSTRAINT "UserCompany_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: UserCompany → Company
ALTER TABLE "UserCompany" ADD CONSTRAINT "UserCompany_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable: Add companyId nullable to Ingredient
ALTER TABLE "Ingredient" ADD COLUMN "companyId" INTEGER;
CREATE INDEX "Ingredient_companyId_idx" ON "Ingredient"("companyId");
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable: Add companyId nullable to Portion
ALTER TABLE "Portion" ADD COLUMN "companyId" INTEGER;
CREATE INDEX "Portion_companyId_idx" ON "Portion"("companyId");
ALTER TABLE "Portion" ADD CONSTRAINT "Portion_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable: Add companyId nullable to Snack
ALTER TABLE "Snack" ADD COLUMN "companyId" INTEGER;
CREATE INDEX "Snack_companyId_idx" ON "Snack"("companyId");
ALTER TABLE "Snack" ADD CONSTRAINT "Snack_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

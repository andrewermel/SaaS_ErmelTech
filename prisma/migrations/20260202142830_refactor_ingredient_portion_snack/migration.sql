/*
  Warnings:

  - You are about to drop the column `pricePerKg` on the `Ingredient` table. All the data in the column will be lost.
  - You are about to drop the column `snackId` on the `Portion` table. All the data in the column will be lost.
  - Added the required column `cost` to the `Ingredient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weightG` to the `Ingredient` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Portion" DROP CONSTRAINT "Portion_snackId_fkey";

-- DropIndex
DROP INDEX "Portion_snackId_idx";

-- AlterTable
ALTER TABLE "Ingredient" DROP COLUMN "pricePerKg",
ADD COLUMN     "cost" DECIMAL(10,4) NOT NULL,
ADD COLUMN     "weightG" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Portion" DROP COLUMN "snackId";

-- CreateTable
CREATE TABLE "SnackPortion" (
    "id" SERIAL NOT NULL,
    "snackId" INTEGER NOT NULL,
    "portionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SnackPortion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SnackPortion_snackId_idx" ON "SnackPortion"("snackId");

-- CreateIndex
CREATE INDEX "SnackPortion_portionId_idx" ON "SnackPortion"("portionId");

-- CreateIndex
CREATE UNIQUE INDEX "SnackPortion_snackId_portionId_key" ON "SnackPortion"("snackId", "portionId");

-- AddForeignKey
ALTER TABLE "SnackPortion" ADD CONSTRAINT "SnackPortion_snackId_fkey" FOREIGN KEY ("snackId") REFERENCES "Snack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SnackPortion" ADD CONSTRAINT "SnackPortion_portionId_fkey" FOREIGN KEY ("portionId") REFERENCES "Portion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

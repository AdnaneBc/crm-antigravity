/*
  Warnings:

  - The values [SAMPLE] on the enum `PromoItemType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PromoItemType_new" AS ENUM ('EMG', 'GADGET');
ALTER TABLE "PromotionalItem" ALTER COLUMN "type" TYPE "PromoItemType_new" USING ("type"::text::"PromoItemType_new");
ALTER TYPE "PromoItemType" RENAME TO "PromoItemType_old";
ALTER TYPE "PromoItemType_new" RENAME TO "PromoItemType";
DROP TYPE "PromoItemType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "city" TEXT,
ADD COLUMN     "code" TEXT,
ADD COLUMN     "gamme" TEXT,
ADD COLUMN     "lap" TEXT,
ADD COLUMN     "potential" TEXT,
ADD COLUMN     "sectorIMS" TEXT,
ADD COLUMN     "sectorName" TEXT;

-- AlterTable
ALTER TABLE "OrganizationUser" ADD COLUMN     "assignedSectors" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "city" TEXT,
ADD COLUMN     "fullName" TEXT,
ADD COLUMN     "gamme" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "phone" TEXT;

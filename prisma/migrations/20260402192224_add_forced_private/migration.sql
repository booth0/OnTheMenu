-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN "forcedPrivate" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Recipe" ADD COLUMN "forcedPrivateReason" TEXT;

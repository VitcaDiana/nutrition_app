/*
  Warnings:

  - Made the column `category` on table `ingredient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `expiresAt` on table `ingredient` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `ingredient` MODIFY `category` VARCHAR(191) NOT NULL,
    MODIFY `expiresAt` DATETIME(3) NOT NULL;

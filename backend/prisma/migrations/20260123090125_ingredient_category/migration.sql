-- AlterTable
ALTER TABLE `ingredient` ADD COLUMN `category` VARCHAR(191) NULL,
    ADD COLUMN `expiresAt` DATETIME(3) NULL;

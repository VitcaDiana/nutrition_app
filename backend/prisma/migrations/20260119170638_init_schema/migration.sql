/*
  Warnings:

  - You are about to drop the `preferences` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `recipecache` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `searchhistory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `preferences` DROP FOREIGN KEY `Preferences_userId_fkey`;

-- DropForeignKey
ALTER TABLE `searchhistory` DROP FOREIGN KEY `SearchHistory_userId_fkey`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `role` ENUM('USER', 'FARMER', 'NUTRITIONIST') NOT NULL;

-- DropTable
DROP TABLE `preferences`;

-- DropTable
DROP TABLE `recipecache`;

-- DropTable
DROP TABLE `searchhistory`;

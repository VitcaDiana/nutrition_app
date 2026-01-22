/*
  Warnings:

  - You are about to drop the column `quantint` on the `ingredient` table. All the data in the column will be lost.
  - Added the required column `quantity` to the `Ingredient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ingredient` DROP COLUMN `quantint`,
    ADD COLUMN `quantity` DOUBLE NOT NULL;

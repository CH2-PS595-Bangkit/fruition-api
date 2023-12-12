/*
  Warnings:

  - You are about to drop the column `fruitImg` on the `history` table. All the data in the column will be lost.
  - Added the required column `imagePath` to the `History` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `history` DROP COLUMN `fruitImg`,
    ADD COLUMN `imagePath` VARCHAR(191) NOT NULL;

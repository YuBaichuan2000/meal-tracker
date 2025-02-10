/*
  Warnings:

  - You are about to drop the column `unit` on the `DishIngredients` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `DishIngredients` DROP COLUMN `unit`,
    ADD COLUMN `quantity` INTEGER NOT NULL DEFAULT 1;

/*
  Warnings:

  - You are about to drop the column `user_id` on the `MenuItem` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `MenuItem` DROP FOREIGN KEY `MenuItem_user_id_fkey`;

-- DropIndex
DROP INDEX `MenuItem_user_id_fkey` ON `MenuItem`;

-- AlterTable
ALTER TABLE `MenuItem` DROP COLUMN `user_id`;

-- DropTable
DROP TABLE `User`;

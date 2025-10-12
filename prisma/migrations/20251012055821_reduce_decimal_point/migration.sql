/*
  Warnings:

  - You are about to alter the column `czk_amount` on the `Chip` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `total_price` on the `Object` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE `Chip` MODIFY `czk_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `Object` MODIFY `total_price` DECIMAL(10, 2) NOT NULL DEFAULT 0;

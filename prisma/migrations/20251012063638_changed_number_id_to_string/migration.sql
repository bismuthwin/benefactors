/*
  Warnings:

  - The primary key for the `Object` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `Chip` DROP FOREIGN KEY `Chip_objectId_fkey`;

-- DropIndex
DROP INDEX `Chip_objectId_fkey` ON `Chip`;

-- AlterTable
ALTER TABLE `Chip` MODIFY `objectId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Object` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Chip` ADD CONSTRAINT `Chip_objectId_fkey` FOREIGN KEY (`objectId`) REFERENCES `Object`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

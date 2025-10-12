/*
  Warnings:

  - You are about to drop the `Tip` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Tip` DROP FOREIGN KEY `Tip_tippedByUserId_fkey`;

-- DropTable
DROP TABLE `Tip`;

-- CreateTable
CREATE TABLE `Chip` (
    `id` VARCHAR(191) NOT NULL,
    `czk_amount` INTEGER NOT NULL,
    `chippedInByUserId` VARCHAR(191) NOT NULL,
    `objectId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Chip` ADD CONSTRAINT `Chip_chippedInByUserId_fkey` FOREIGN KEY (`chippedInByUserId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chip` ADD CONSTRAINT `Chip_objectId_fkey` FOREIGN KEY (`objectId`) REFERENCES `Object`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

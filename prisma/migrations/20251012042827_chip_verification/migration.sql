-- AlterTable
ALTER TABLE `Chip` ADD COLUMN `verified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `verifiedAt` DATETIME(3) NULL,
    ADD COLUMN `verifiedByUserId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Chip` ADD CONSTRAINT `Chip_verifiedByUserId_fkey` FOREIGN KEY (`verifiedByUserId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

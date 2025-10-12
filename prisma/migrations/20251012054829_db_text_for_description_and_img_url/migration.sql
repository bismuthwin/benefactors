-- AlterTable
ALTER TABLE `Object` ADD COLUMN `finished` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `description` TEXT NOT NULL,
    MODIFY `imageUrl` TEXT NULL;

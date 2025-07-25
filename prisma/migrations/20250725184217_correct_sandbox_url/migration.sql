/*
  Warnings:

  - You are about to drop the column `sanboxUrl` on the `Fragment` table. All the data in the column will be lost.
  - Added the required column `sandboxUrl` to the `Fragment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Fragment" DROP COLUMN "sanboxUrl",
ADD COLUMN     "sandboxUrl" TEXT NOT NULL;

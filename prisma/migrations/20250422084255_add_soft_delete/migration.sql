-- AlterTable
ALTER TABLE "Day" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Proposal" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Step" ADD COLUMN     "deletedAt" TIMESTAMP(3);

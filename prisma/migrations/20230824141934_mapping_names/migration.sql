/*
  Warnings:

  - You are about to drop the `Groups` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Groups" DROP CONSTRAINT "Groups_teacher_owner_user_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_group_id_fkey";

-- DropTable
DROP TABLE "Groups";

-- CreateTable
CREATE TABLE "groups" (
    "group_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "teacher_owner_user_id" TEXT NOT NULL,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("group_id")
);

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("group_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_teacher_owner_user_id_fkey" FOREIGN KEY ("teacher_owner_user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

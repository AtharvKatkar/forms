/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Post";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Form" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT 'Untitled form',
    "description" TEXT,
    "stared" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" DATETIME,
    "requireAuth" BOOLEAN NOT NULL DEFAULT false,
    "sendResponseEmail" BOOLEAN NOT NULL DEFAULT false,
    "allowResponseEditing" BOOLEAN NOT NULL DEFAULT false,
    "limitOneResponse" BOOLEAN NOT NULL DEFAULT false,
    "allQuestionsRequired" BOOLEAN NOT NULL DEFAULT false,
    "showProgressBar" BOOLEAN NOT NULL DEFAULT false,
    "shuffleQuestionOrder" BOOLEAN NOT NULL DEFAULT false,
    "confirmationMessage" TEXT NOT NULL DEFAULT 'Your response has been recorded',
    "showLinkFormAnotherResponse" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdById" TEXT NOT NULL,
    CONSTRAINT "Form_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Form_name_idx" ON "Form"("name");

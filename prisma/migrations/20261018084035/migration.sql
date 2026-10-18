/*
  Warnings:

  - You are about to drop the column `allQuestionsRequired` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `stared` on the `Form` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT,
    "description" TEXT,
    "inlineImage" TEXT,
    "type" TEXT NOT NULL DEFAULT 'MULTIPLE_CHOICE',
    "order" INTEGER NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "shuffleOptionOrder" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "formId" TEXT NOT NULL,
    "userId" TEXT,
    CONSTRAINT "Question_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Question_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Option" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "questionId" TEXT NOT NULL,
    "userId" TEXT,
    CONSTRAINT "Option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Option_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Form" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT 'Untitled form',
    "description" TEXT,
    "starred" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" DATETIME,
    "requireAuth" BOOLEAN NOT NULL DEFAULT false,
    "sendResponseEmail" BOOLEAN NOT NULL DEFAULT false,
    "allowResponseEditing" BOOLEAN NOT NULL DEFAULT false,
    "limitOneResponse" BOOLEAN NOT NULL DEFAULT false,
    "showProgressBar" BOOLEAN NOT NULL DEFAULT false,
    "shuffleQuestionOrder" BOOLEAN NOT NULL DEFAULT false,
    "confirmationMessage" TEXT NOT NULL DEFAULT 'Your response has been recorded',
    "showLinkFormAnotherResponse" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdById" TEXT NOT NULL,
    CONSTRAINT "Form_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Form" ("allowResponseEditing", "confirmationMessage", "createdAt", "createdById", "description", "id", "limitOneResponse", "name", "published", "publishedAt", "requireAuth", "sendResponseEmail", "showLinkFormAnotherResponse", "showProgressBar", "shuffleQuestionOrder", "updatedAt") SELECT "allowResponseEditing", "confirmationMessage", "createdAt", "createdById", "description", "id", "limitOneResponse", "name", "published", "publishedAt", "requireAuth", "sendResponseEmail", "showLinkFormAnotherResponse", "showProgressBar", "shuffleQuestionOrder", "updatedAt" FROM "Form";
DROP TABLE "Form";
ALTER TABLE "new_Form" RENAME TO "Form";
CREATE INDEX "Form_name_idx" ON "Form"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Question_formId_idx" ON "Question"("formId");

-- CreateIndex
CREATE UNIQUE INDEX "Question_formId_order_key" ON "Question"("formId", "order");

-- CreateIndex
CREATE INDEX "Option_questionId_idx" ON "Option"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "Option_questionId_order_key" ON "Option"("questionId", "order");

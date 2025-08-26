-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "repoId" INTEGER NOT NULL,
    "fullName" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "description" TEXT,
    "language" TEXT,
    "topics" JSONB NOT NULL,
    "stars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "watchers" INTEGER NOT NULL,
    "openIssues" INTEGER NOT NULL,
    "hasHomepage" BOOLEAN NOT NULL DEFAULT false,
    "readmeSize" INTEGER NOT NULL DEFAULT 0,
    "lastPushedAt" DATETIME NOT NULL,
    "ownerFollowers" INTEGER NOT NULL DEFAULT 0,
    "scoreAllTime" REAL NOT NULL DEFAULT 0,
    "scoreTrending" REAL NOT NULL DEFAULT 0,
    "scoreUpdatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_repoId_key" ON "Project"("repoId");

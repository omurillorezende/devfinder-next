-- CreateTable
CREATE TABLE "public"."Project" (
    "id" TEXT NOT NULL,
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
    "lastPushedAt" TIMESTAMP(3) NOT NULL,
    "ownerFollowers" INTEGER NOT NULL DEFAULT 0,
    "scoreAllTime" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "scoreTrending" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "scoreUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_repoId_key" ON "public"."Project"("repoId");

-- CreateIndex
CREATE INDEX "Project_scoreTrending_idx" ON "public"."Project"("scoreTrending");

-- CreateIndex
CREATE INDEX "Project_scoreAllTime_idx" ON "public"."Project"("scoreAllTime");

-- CreateIndex
CREATE INDEX "Project_language_idx" ON "public"."Project"("language");

-- CreateIndex
CREATE INDEX "Project_stars_idx" ON "public"."Project"("stars");

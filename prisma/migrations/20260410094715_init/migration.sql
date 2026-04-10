-- CreateEnum
CREATE TYPE "Theme" AS ENUM ('GREEN', 'YELLOW', 'BLUE', 'PINK', 'DESK1', 'DESK2', 'TILE', 'LEAF');

-- CreateEnum
CREATE TYPE "FocusStatus" AS ENUM ('running', 'paused', 'completed');

-- CreateTable
CREATE TABLE "studies" (
    "id" SERIAL NOT NULL,
    "nickname" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "theme" "Theme" NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "studies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habits" (
    "id" SERIAL NOT NULL,
    "study_id" INTEGER NOT NULL,
    "habit_name" TEXT NOT NULL,
    "start_at" TIMESTAMP(3) NOT NULL,
    "end_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "habits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habit_logs" (
    "id" SERIAL NOT NULL,
    "habit_id" INTEGER NOT NULL,
    "log_date" DATE NOT NULL,
    "logged_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "habit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "focus_sessions" (
    "id" SERIAL NOT NULL,
    "study_id" INTEGER NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_time" TIMESTAMP(3) NOT NULL,
    "duration_min" INTEGER NOT NULL,
    "paused_at" TIMESTAMP(3),
    "status" "FocusStatus" NOT NULL,
    "earned_point" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "focus_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emojis" (
    "id" SERIAL NOT NULL,
    "study_id" INTEGER NOT NULL,
    "emoji" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "emojis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "habit_logs_habit_id_log_date_key" ON "habit_logs"("habit_id", "log_date");

-- CreateIndex
CREATE UNIQUE INDEX "emojis_study_id_emoji_key" ON "emojis"("study_id", "emoji");

-- AddForeignKey
ALTER TABLE "habits" ADD CONSTRAINT "habits_study_id_fkey" FOREIGN KEY ("study_id") REFERENCES "studies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habit_logs" ADD CONSTRAINT "habit_logs_habit_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "habits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "focus_sessions" ADD CONSTRAINT "focus_sessions_study_id_fkey" FOREIGN KEY ("study_id") REFERENCES "studies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emojis" ADD CONSTRAINT "emojis_study_id_fkey" FOREIGN KEY ("study_id") REFERENCES "studies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

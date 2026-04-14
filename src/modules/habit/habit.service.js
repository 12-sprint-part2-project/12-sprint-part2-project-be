import prisma from "../../lib/prisma.js";
import {
  BadRequestError,
  StudyNotFoundError,
} from "../../errors/CustomError.js";

export const getTodayHabits = async (studyId) => {
  // 오늘 날짜 (시간 제거)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const habits = await prisma.habit.findMany({
    where: {
      studyId: Number(studyId),
      startAt: { lte: today },
      OR: [{ endAt: null }, { endAt: { gte: today } }],
    },
    include: {
      habitLogs: {
        where: { logDate: today },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return habits.map((habit) => ({
    id: habit.id,
    habitName: habit.habitName,
    isCompleted:
      habit.habitLogs.length > 0 && habit.habitLogs[0].completedAt !== null,
  }));
};

export const createHabit = async (studyId, data) => {
  const { habitName } = data;

  // 1. studyId 검증
  if (!studyId || Number.isNaN(studyId)) {
    throw new BadRequestError("유효하지 않은 스터디 ID입니다.");
  }

  // 2. habitName 검증
  if (!habitName || !habitName.trim()) {
    throw new BadRequestError("습관 이름은 필수입니다.");
  }

  // 3. study 존재 여부 확인
  const study = await prisma.study.findUnique({
    where: { id: studyId },
  });

  if (!study) {
    throw new StudyNotFoundError();
  }

  // 4. 생성
  const newHabit = await prisma.habit.create({
    data: {
      studyId,
      habitName: habitName.trim(),
      startAt: new Date(),
    },
  });

  return newHabit;
};

export const toggleHabit = async (studyId, habitId, completed) => {};
export const updateHabit = async (studyId, habitId, data) => {};
export const deleteHabit = async (studyId, habitId) => {};
export const getWeeklyLogs = async (studyId, date) => {};

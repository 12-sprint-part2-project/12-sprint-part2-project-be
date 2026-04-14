import prisma from "../../lib/prisma.js";

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

  if (!studyId || Number.isNaN(studyId)) {
    const error = new Error("유효하지 않은 스터디 ID입니다.");
    error.status = 400;
    throw error;
  }

  if (!habitName || !habitName.trim()) {
    const error = new Error("습관 이름은 필수입니다.");
    error.status = 400;
    throw error;
  }

  try {
    await prisma.study.findUniqueOrThrow({
      where: { id: studyId },
    });
  } catch (err) {
    const error = new Error("존재하지 않는 스터디입니다.");
    error.status = 404;
    throw error;
  }

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

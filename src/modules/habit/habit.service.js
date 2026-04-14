import prisma from "../../lib/prisma.js";

export const getTodayHabits = async (studyId) => {
  // 오늘 날짜 (시간 제거)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const habits = await prisma.habit.findMany({
    where: {
      studyId: Number(studyId),
      startAt: { lte: today },
      OR: [
        { endAt: null },
        { endAt: { gte: today } },
      ],
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
    isCompleted: habit.habitLogs.length > 0 && habit.habitLogs[0].completedAt !== null,
  }));
};
export const createHabit = async (studyId, data) => {};
export const toggleHabit = async (studyId, habitId, completed) => {};
export const updateHabit = async (studyId, habitId, data) => {};
export const deleteHabit = async (studyId, habitId) => {};
export const getWeeklyLogs = async (studyId, date) => {};

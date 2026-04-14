import prisma from "../../lib/prisma.js";

export const getTodayHabits = async (studyId) => {};
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

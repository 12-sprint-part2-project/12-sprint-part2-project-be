import prisma from "../../lib/prisma.js";
import {
  BadRequestError,
  StudyNotFoundError,
} from "../../errors/CustomError.js";

// KST 기준 "오늘 날짜" 생성 (안 꼬이는 방식)
const getTodayKST = () => {
  const now = new Date();

  // 한국 시간 기준으로 YYYY-MM-DD 문자열 만들기
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const dateStr = kst.toISOString().slice(0, 10);

  // DB용 Date 객체 (날짜만 의미)
  return new Date(dateStr);
};

export const getTodayHabits = async (studyId) => {
  // 오늘 날짜 (시간 제거)
  const today = getTodayKST();
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

export const toggleHabit = async (studyId, habitId, data) => {
  const { completed } = data;

  // 1. 기본 값 검증
  if (!studyId || Number.isNaN(studyId)) {
    throw new BadRequestError("유효하지 않은 스터디 ID입니다.");
  }

  if (!habitId || Number.isNaN(habitId)) {
    throw new BadRequestError("유효하지 않은 습관 ID입니다.");
  }

  // completed는 true/false만 허용
  if (typeof completed !== "boolean") {
    throw new BadRequestError("completed 값은 boolean이어야 합니다.");
  }

  // 2. 해당 habit이 존재하는지 + 해당 study에 속한 게 맞는지 확인
  const habit = await prisma.habit.findFirst({
    where: {
      id: habitId,
      studyId: studyId,
    },
  });

  // 없으면 404 처리 (스터디 or 습관 없음)
  if (!habit) {
    throw new StudyNotFoundError();
  }

  // 3. 오늘 날짜 생성 (시간 제거해서 날짜 기준으로 비교)
  const today = getTodayKST();

  // 4. 오늘 해당 habit의 로그가 이미 있는지 조회
  const existingLog = await prisma.habitLog.findUnique({
    where: {
      habitId_logDate: {
        habitId,
        logDate: today,
      },
    },
  });
  const now = new Date();
  let result;

  // 5. 로그가 없으면 → 생성
  if (!existingLog) {
    result = await prisma.habitLog.create({
      data: {
        habitId,
        logDate: today,
        loggedAt: now,
        completedAt: completed ? now : null,
      },
    });
  } else {
    // 6. 로그가 있으면 → completedAt만 수정
    result = await prisma.habitLog.update({
      where: {
        id: existingLog.id,
      },
      data: {
        completedAt: completed ? now : null,
      },
    });
  }

  // 7. controller로 결과 반환
  return result;
};

export const updateHabit = async (studyId, habitId, data) => {
  const { habitName, startAt } = data;

  if (!studyId || Number.isNaN(studyId)) {
    throw new BadRequestError("유효하지 않은 스터디 ID입니다.");
  }

  if (!habitId || Number.isNaN(habitId)) {
    throw new BadRequestError("유효하지 않은 습관 ID입니다.");
  }

  // 수정할 값이 없으면 잘못된 요청
  const hasHabitName = habitName !== undefined;
  const hasStartAt = startAt !== undefined;

  if (!hasHabitName && !hasStartAt) {
    throw new BadRequestError("수정할 값이 없습니다.");
  }

  if (hasHabitName) {
    if (typeof habitName !== "string" || !habitName.trim()) {
      throw new BadRequestError("습관 이름은 빈 문자열일 수 없습니다.");
    }
  }

  // startAt이 들어왔으면 날짜로 변환 가능한 값인지 검사
  let parsedStartAt;

  if (hasStartAt) {
    parsedStartAt = new Date(startAt);

    if (Number.isNaN(parsedStartAt.getTime())) {
      throw new BadRequestError("유효하지 않은 시작 날짜입니다.");
    }
  }

  const habit = await prisma.habit.findFirst({
    where: {
      id: habitId,
      studyId: studyId,
    },
  });

  if (!habit) {
    throw new StudyNotFoundError();
  }

  if (habit.endAt !== null) {
    throw new BadRequestError("종료된 습관은 수정할 수 없습니다.");
  }

  // 실제로 수정할 데이터만 객체에 담기
  const updateData = {};

  if (hasHabitName) {
    updateData.habitName = habitName.trim();
  }

  if (hasStartAt) {
    updateData.startAt = parsedStartAt;
  }

  const updatedHabit = await prisma.habit.update({
    where: {
      id: habitId,
    },
    data: updateData,
  });

  return updatedHabit;
};
export const deleteHabit = async (studyId, habitId) => {};
export const getWeeklyLogs = async (studyId, date) => {};

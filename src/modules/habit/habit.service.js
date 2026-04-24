import prisma from "../../lib/prisma.js";
import {
  BadRequestError,
  HabitNotFoundError,
} from "../../errors/CustomError.js";
import { getTodayKST } from "../../common/utils/date.js"; // 오늘 날짜를 KST기준으로 가져오는 함수. 습관 조회,생성,체크/해제,삭제에서 날짜 기준으로 사용

// 오늘의 습관 조회
export const getTodayHabits = async (studyId) => {
  // 오늘 날짜 (시간 제거)
  const today = getTodayKST(); // habit_logs의 logDate와 비교, "오늘 체크 기록이 있는지"
  const now = new Date(); // 현재 시각, habits의 startAt과 비교, startAt이 현재 시각보다 이전이거나 같아야 오늘 조회 대상.

  const habits = await prisma.habit.findMany({
    where: {
      studyId,
      startAt: { lte: now },
      OR: [{ endAt: null }, { endAt: { gt: today } }],
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
      habit.habitLogs.length > 0 && habit.habitLogs[0].completedAt !== null, // 오늘 로그가 존재하고, 그 로그의 completedAt에 시간이 들어있으면 체크 완료로 판단
  }));
};

// 습관 생성
export const createHabit = async (studyId, data) => {
  const { habitName } = data;

  // 1. habitName 검증
  if (!habitName || !habitName.trim()) {
    throw new BadRequestError("습관 이름은 필수입니다.");
  }

  // 2. 생성
  const newHabit = await prisma.habit.create({
    data: {
      studyId,
      habitName: habitName.trim(),
      startAt: getTodayKST(),
    },
  });

  return newHabit;
};

// 체크/해제
export const toggleHabit = async (studyId, habitId, data) => {
  const { completed } = data;

  // 1. 기본 값 검증
  // completed는 true/false만 허용
  if (typeof completed !== "boolean") {
    throw new BadRequestError("completed 값은 boolean이어야 합니다.");
  }

  // 2. 해당 habit이 존재하는지 + 해당 study에 속한 게 맞는지 확인
  const habit = await prisma.habit.findFirst({
    where: {
      id: habitId,
      studyId,
    },
  });

  // 없으면 404 처리 (스터디 or 습관 없음)
  if (!habit) {
    throw new HabitNotFoundError();
  }

  // 3. 오늘 로그를 찾기 위한 기준 날짜
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

// 습관 수정
export const updateHabit = async (studyId, habitId, data) => {
  const { habitName, startAt } = data;

  const hasHabitName = habitName !== undefined && habitName !== null;
  const hasStartAt = startAt !== undefined && startAt !== null;

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
      studyId,
    },
  });

  if (!habit) {
    throw new HabitNotFoundError();
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

// 습관 삭제(소프트 딜리트)
export const deleteHabit = async (studyId, habitId) => {
  // 1. 해당 스터디에 속한 습관이 실제로 존재하는지 확인
  const habit = await prisma.habit.findFirst({
    where: {
      id: habitId,
      studyId,
    },
  });

  // 2. 없으면 습관 없음 에러(스터디가 없거나, 해당 스터디에 이 습관이 없거나)
  if (!habit) {
    throw new HabitNotFoundError();
  }

  // 3. 이미 종료된 습관이면 다시 삭제할 수 없도록 막기
  if (habit.endAt !== null) {
    throw new BadRequestError("이미 종료된 습관은 삭제할 수 없습니다.");
  }

  // 4. 실제 삭제 대신 endAt을 현재 시각으로 설정해서 종료 처리(soft delete)
  await prisma.habit.update({
    where: {
      id: habitId,
    },
    data: {
      endAt: getTodayKST(),
    },
  });
};

// 주간 습관 기록 조회
export const getWeeklyLogs = async (studyId, date) => {
  if (!date) {
    throw new BadRequestError("date 쿼리 파라미터는 필수입니다.");
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new BadRequestError("유효하지 않은 날짜 형식입니다. (YYYY-MM-DD)");
  }

  // 날짜 문자열만 뽑아서 다시 Date로 생성
  const dateStr = parsedDate.toISOString().slice(0, 10);
  const baseDate = new Date(dateStr);

  // 일요일=0, 월요일=1, ... 토요일=6
  const day = baseDate.getDay();

  // 월요일 시작 기준으로 맞추기
  const diffToMonday = day === 0 ? 6 : day - 1;

  // 이번주 월요일 계산
  const startDate = new Date(baseDate);
  startDate.setDate(baseDate.getDate() - diffToMonday);

  // 이번주 일요일 계산
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);

  // 이번 주와 기간이 겹치는 습관만 조회
  const habits = await prisma.habit.findMany({
    where: {
      studyId,
      startAt: { lte: endDate },
      OR: [{ endAt: null }, { endAt: { gt: endDate } }],
    },
    orderBy: { createdAt: "asc" },
  });

  const habitIds = habits.map((habit) => habit.id);

  if (habitIds.length === 0) {
    return {
      studyId,
      startDate,
      endDate,
      habits: [],
    };
  }

  const habitLogs = await prisma.habitLog.findMany({
    where: {
      habitId: { in: habitIds },
      logDate: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  // 7일 날짜 배열 생성
  const weekDates = Array.from({ length: 7 }, (_, index) => {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + index);
    return currentDate.toISOString().slice(0, 10);
  });

  const habitLogMap = new Map(
    habitLogs.map((log) => [
      `${log.habitId}-${log.logDate.toISOString().slice(0, 10)}`,
      log,
    ]),
  );

  const weeklyHabits = habits.map((habit) => {
    const habitStartDateStr = habit.startAt.toISOString().slice(0, 10);
    const habitEndDateStr = habit.endAt
      ? habit.endAt.toISOString().slice(0, 10)
      : null;

    return {
      habitId: habit.id,
      habitName: habit.habitName,
      logs: weekDates.map((dateStr) => {
        const isActive =
          habitStartDateStr <= dateStr &&
          (habitEndDateStr === null || habitEndDateStr > dateStr);

        if (!isActive) {
          return {
            date: dateStr,
            isCompleted: null,
          };
        }

        const log = habitLogMap.get(`${habit.id}-${dateStr}`);

        return {
          date: dateStr,
          isCompleted: log ? log.completedAt !== null : false,
        };
      }),
    };
  });

  return {
    studyId,
    startDate,
    endDate,
    habits: weeklyHabits,
  };
};

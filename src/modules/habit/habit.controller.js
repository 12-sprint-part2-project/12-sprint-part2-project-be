import * as habitService from "./habit.service.js";
import asyncHandler from "../../common/middlewares/asyncHandler.js";

// 오늘의 습관 조회
export const getTodayHabits = asyncHandler(async (req, res) => {
  const studyId = req.studyId;
  const habits = await habitService.getTodayHabits(studyId); // 오늘의 습관 조회 로직은 service에서. 컨트롤러는 studyId만 넘김

  res.status(200).json({
    success: true,
    data: habits,
  });
});

// 습관 생성
export const createHabit = asyncHandler(async (req, res) => {
  const studyId = req.studyId;
  const { habitName } = req.body; // 요청 바디에서 생성할 습관 이름 꺼내기
  const newHabit = await habitService.createHabit(studyId, {
    habitName,
  }); // service로 studyId와 habitName 전달

  res.status(201).json({
    success: true,
    data: newHabit,
  });
});

// 오늘의 습관 체크/해제
export const toggleHabit = asyncHandler(async (req, res) => {
  const studyId = req.studyId;
  const habitId = req.params.habitId;

  const { completed } = req.body;

  const toggleHabitLog = await habitService.toggleHabit(studyId, habitId, {
    completed,
  });

  res.status(200).json({
    success: true,
    data: toggleHabitLog,
  });
});

// 습관 수정
export const updateHabit = asyncHandler(async (req, res) => {
  const studyId = req.studyId;
  const habitId = req.params.habitId;

  const { habitName, startAt } = req.body;

  const updatedHabit = await habitService.updateHabit(studyId, habitId, {
    habitName,
    startAt,
  });

  res.status(200).json({
    success: true,
    data: updatedHabit,
  });
});

// 습관 삭제
export const deleteHabit = asyncHandler(async (req, res) => {
  const studyId = req.studyId;
  const habitId = req.params.habitId;

  await habitService.deleteHabit(studyId, habitId);

  res.status(204).send();
});

// 주간 습관 기록 조회
export const getWeeklyLogs = asyncHandler(async (req, res) => {
  const studyId = req.studyId;
  const { date } = req.query;

  const weeklyLogs = await habitService.getWeeklyLogs(studyId, date);

  res.status(200).json({
    success: true,
    data: weeklyLogs,
  });
});

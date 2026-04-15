import * as habitService from "./habit.service.js";
import asyncHandler from "../../common/middlewares/asyncHandler.js";

export const getTodayHabits = asyncHandler(async (req, res) => {
  const { studyId } = req.params;
  const habits = await habitService.getTodayHabits(studyId);
  res.status(200).json(habits);
});

export const createHabit = asyncHandler(async (req, res) => {
  const studyId = Number(req.params.studyId);
  const { habitName } = req.body;
  const newHabit = await habitService.createHabit(studyId, {
    habitName,
  });

  res.status(201).json({
    success: true,
    data: newHabit,
  });
});

export const toggleHabit = asyncHandler(async (req, res) => {
  const studyId = Number(req.params.studyId);
  const habitId = Number(req.params.habitId);
  const { completed } = req.body;
  // 체크/해제 실제 처리(조회, 생성, 수정)는 service에 맡김
  const toggleHabitLog = await habitService.toggleHabit(studyId, habitId, {
    completed,
  });

  res.status(200).json({
    success: true,
    data: toggleHabitLog,
  });
});

export const updateHabit = asyncHandler(async (req, res) => {
  const studyId = Number(req.params.studyId);
  const habitId = Number(req.params.habitId);

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

export const deleteHabit = asyncHandler(async (req, res) => {
  res.status(204).send();
});

export const getWeeklyLogs = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "TODO" });
});

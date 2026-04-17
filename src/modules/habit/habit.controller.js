import * as habitService from "./habit.service.js";
import asyncHandler from "../../common/middlewares/asyncHandler.js";

export const getTodayHabits = asyncHandler(async (req, res) => {
  const studyId = req.studyId;
  const habits = await habitService.getTodayHabits(studyId);

  res.status(200).json({
    success: true,
    data: habits,
  });
});

export const createHabit = asyncHandler(async (req, res) => {
  const studyId = req.studyId;
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

export const deleteHabit = asyncHandler(async (req, res) => {
  const studyId = req.studyId;
  const habitId = req.params.habitId;

  await habitService.deleteHabit(studyId, habitId);

  res.status(204).send();
});

export const getWeeklyLogs = asyncHandler(async (req, res) => {
  const studyId = req.studyId;
  const { date } = req.query;

  const weeklyLogs = await habitService.getWeeklyLogs(studyId, date);

  res.status(200).json({
    success: true,
    data: weeklyLogs,
  });
});

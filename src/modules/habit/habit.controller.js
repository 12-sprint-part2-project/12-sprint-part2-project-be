import * as habitService from "./habit.service.js";
import asyncHandler from "../../common/middlewares/asyncHandler.js";

export const getTodayHabits = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "TODO" });
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
  res.status(200).json({ message: "TODO" });
});

export const updateHabit = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "TODO" });
});

export const deleteHabit = asyncHandler(async (req, res) => {
  res.status(204).send();
});

export const getWeeklyLogs = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "TODO" });
});

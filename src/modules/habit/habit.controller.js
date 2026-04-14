import * as habitService from "./habit.service.js";
import asyncHandler from "../../common/middlewares/asyncHandler.js";

export const getTodayHabits = asyncHandler(async (req, res) => {
  const { studyId } = req.params;
  const habits = await habitService.getTodayHabits(studyId);
  res.status(200).json(habits);
});

export const createHabit = asyncHandler(async (req, res) => {
  res.status(201).json({ message: "TODO" });
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

import * as focusService from "./focus.service.js";
import asyncHandler from "../../common/middlewares/asyncHandler.js";

export const getSession = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "TODO" });
});

export const createSession = asyncHandler(async (req, res) => {
  res.status(201).json({ message: "TODO" });
});

export const updateSession = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "TODO" });
});

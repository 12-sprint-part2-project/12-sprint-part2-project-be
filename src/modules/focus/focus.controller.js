import { FocusNotFoundError } from "../../errors/CustomError.js";
import * as focusService from "./focus.service.js";
import asyncHandler from "../../common/middlewares/asyncHandler.js";

export const getSession = asyncHandler(async (req, res) => {
  const studyId = Number(req.params.studyId);
  const focus = await focusService.getSession(studyId);

  if (!focus)
    throw new FocusNotFoundError("해당 studyId로 등록된 데이터 미존재");

  if (focus.status === "completed") {
    return res.status(200).json({
      success: true,
      data: null,
    });
  }

  res.status(200).json({
    success: true,
    data: focus,
  });
});

export const createSession = asyncHandler(async (req, res) => {
  res.status(201).json({ message: "TODO" });
});

export const updateSession = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "TODO" });
});

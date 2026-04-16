import {
  FocusNotFoundError,
  BadRequestError,
} from "../../errors/CustomError.js";
import * as focusService from "./focus.service.js";
import asyncHandler from "../../common/middlewares/asyncHandler.js";

export const getSession = asyncHandler(async (req, res) => {
  const studyId = req.studyId;
  const focus = await focusService.getSession(studyId);

  if (!focus) {
    return res.status(200).json({
      success: true,
      data: null,
    });
  }

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
  const studyId = req.studyId;
  const durationMin = req.body.durationMin;

  if (!durationMin || durationMin <= 0)
    throw new BadRequestError("durationMin 데이터 오류");

  const newFocus = await focusService.createSession(studyId, durationMin);
  res.status(201).json({
    success: true,
    data: newFocus,
  });
});

export const updateSession = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "TODO" });
});

import {
  FocusNotFoundError,
  BadRequestError,
} from "../../errors/CustomError.js";
import * as focusService from "./focus.service.js";
import asyncHandler from "../../common/middlewares/asyncHandler.js";

// 오늘의 집중 데이터 조회
export const getSession = asyncHandler(async (req, res) => {
  const studyId = req.studyId;
  const focus = await focusService.getSession(studyId);

  if (!focus) {
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

// 오늘의 집중 신규 생성
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

// 오늘의 집중 상태 변경
export const updateSession = asyncHandler(async (req, res) => {
  const studyId = req.studyId;
  const sessionId = req.params.sessionId;
  const action = req.body.action;

  if (!studyId || !sessionId || !action)
    throw new BadRequestError("필수 데이터 누락");

  const updateFocus = await focusService.updateSession(
    studyId,
    sessionId,
    action,
  );

  res.status(200).json({
    success: true,
    data: updateFocus,
  });
});

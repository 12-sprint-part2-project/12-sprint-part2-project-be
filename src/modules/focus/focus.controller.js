import {
  FocusNotFoundError,
  BadRequestError,
} from "../../errors/CustomError.js";
import * as focusService from "./focus.service.js";
import asyncHandler from "../../common/middlewares/asyncHandler.js";

// 오늘의 집중 데이터 조회
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

// 오늘의 집중 신규 생성
export const createSession = asyncHandler(async (req, res) => {
  const studyId = Number(req.params.studyId);
  const durationMin = Number(req.body.durationMin);

  if (!studyId) throw new BadRequestError("studyId 데이터 넘어오지 않음");
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
  const studyId = Number(req.params.studyId);

  // req.params.id로 넘어올 줄 알았는데 해당 값은 sessionId로 넘어옴
  const id = Number(req.params.sessionId);
  const action = req.body.action;

  if (!studyId || !id || !action) throw new BadRequestError("필수 데이터 누락");

  const updateFocus = await focusService.updateSession(studyId, id, action);

  res.status(200).json({
    success: true,
    data: updateFocus,
  });
});

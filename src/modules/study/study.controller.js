import * as studyService from "./study.service.js";
import asyncHandler from "../../common/middlewares/asyncHandler.js";
import {
  AuthenticationError,
  BadRequestError,
} from "../../errors/CustomError.js";

export const getStudies = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "TODO" });
});

export const getStudyById = asyncHandler(async (req, res) => {
  const { studyId } = req.params;

  if (!studyId) throw new BadRequestError("존재하지 않는 스터디입니다.");

  const study = await studyService.getStudyById(studyId);

  res.status(200).json({ success: true, data: study });
});

export const createStudy = asyncHandler(async (req, res) => {
  const { nickname, title, description, theme, password } = req.body;

  //에러 핸들링 (validation)
  if (!title || !theme || !password || !nickname) {
    throw new BadRequestError(
      "스터디 생성에 실패했습니다. 닉네임, 제목, 테마, 비밀번호는 필수입니다.",
    );
  }

  const createdStudy = await studyService.createStudy({
    nickname,
    title,
    description,
    theme,
    password,
  });

  res.status(201).json({ success: true, data: createdStudy });
});

export const updateStudy = asyncHandler(async (req, res) => {
  const { studyId } = req.params;
  const { title, description, theme, password, nickname } = req.body;

  if (isNaN(studyId)) {
    throw new BadRequestError("id는 숫자여야 합니다.");
  }

  if (!title || !theme || !password || !nickname) {
    throw new BadRequestError(
      "스터디 수정에 실패했습니다. 유효하지 않은 입력값입니다.",
    );
  }

  const updatedStudy = await studyService.updateStudy(studyId, {
    title,
    description,
    theme,
    password,
    nickname,
  });
  res.status(200).json({ success: true, data: updatedStudy });
});

export const deleteStudy = asyncHandler(async (req, res) => {
  const { studyId } = req.params;
  if (isNaN(studyId)) {
    throw new BadRequestError("id는 숫자여야 합니다.");
  }
  await studyService.deleteStudy(studyId);

  res.status(204).send();
});

export const verifyPassword = asyncHandler(async (req, res) => {
  const { studyId } = req.params;
  const { password } = req.body;
  if (isNaN(studyId)) {
    throw new BadRequestError("id는 숫자여야 합니다.");
  }
  const isCorrect = await studyService.verifyPassword(studyId, password); //boolean값을 리턴 받는다. true면 일치, false면 불일치.
  if (!isCorrect) {
    throw new BadRequestError("비밀번호가 올바르지 않습니다.");
  }
  /*세션에 스터디 id를 저장하는 로직*/
  // 세션에 인증된 스터디 목록이 없으면 빈 배열 생성
  if (!req.session.authorizedStudies) {
    req.session.authorizedStudies = [];
  }
  //비밀번호가 일치할 시, 현재 스터디 id를, 세션 배열에 추가
  if (!req.session.authorizedStudies.includes(Number(studyId))) {
    req.session.authorizedStudies.push(Number(studyId));
  }
  res
    .status(200)
    .json({ success: true, data: { session: req.session.authorizedStudies } }); //현재 세션에 어떤 스터디 id가 들어있는지도 함께 응답으로 보냄.
});

//세션에 있는 스터디 id인지 점검
export const checkSession = asyncHandler(async (req, res) => {
  const { studyId } = req.params;
  const isAuthorized = req.session.authorizedStudies?.includes(Number(studyId));
  if (!isAuthorized) {
    //세션에 없는 스터디 id 일시, 에러를 리턴한다. (그런데 그냥 응답으로 주는 게 프론트가 편하다는데, 뭐가 좋을까?)
    throw new AuthenticationError();
  }
  res.status(200).json({ success: true });
});

export const addEmoji = asyncHandler(async (req, res) => {
  res.status(201).json({ message: "TODO" });
});

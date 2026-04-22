import * as studyService from "./study.service.js";
import asyncHandler from "../../common/middlewares/asyncHandler.js";
import {
  AuthenticationError,
  BadRequestError,
} from "../../errors/CustomError.js";

export const getStudies = asyncHandler(async (req, res) => {
  const { page, limit, keyword, sortBy, order } = req.query || {};

  const result = await studyService.getStudies({
    page,
    limit,
    keyword,
    sortBy,
    order,
  });

  res.status(200).json({
    success: true,
    data: result.data,
    total: result.total,
    has_more: result.has_more,
  });
});

export const getRecentStudies = asyncHandler(async (req, res) => {
  const { ids } = req.query;
  let result = [];

  if (ids) {
    const idList = ids.split(",").map((id) => Number(id));
    result = await studyService.getRecentStudies(idList);
  }

  res.status(200).json({ success: true, data: result });
});

export const getStudyById = asyncHandler(async (req, res) => {
  const studyId = req.studyId;

  const study = await studyService.getStudyById(studyId);

  res.status(200).json({ success: true, data: study });
});

export const createStudy = asyncHandler(async (req, res) => {
  const { nickname, title, description, theme, password } = req.body;

  //에러 핸들링 (validation)
  if (!title || !theme || !password || !nickname) {
    throw new BadRequestError(
      "스터디 생성에 실패했습니다. 닉네임, 제목, 테마, 비밀번호는 필수입니다.",
    ); //원래는 앞 문장만 정해뒀었는데 혹시모르니 뒤에 문장도 적어둠..
    //이게 400에러를 반환하는데, 500에러는 알아서 처리되는 거겠지?
    // asyncHandler 가 있어서 처리되는 방식인 거 같아요!
    // asyncHandler 에서 성공이면 asyncHandler( 안에 작성된 함수 실행 )
    // 실패면 next(err) 실행 < next(err) 은 express 약속
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
  const studyId = req.studyId;
  const { title, description, theme, password, nickname } = req.body;

  if (!title || !theme || !nickname) {
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
  const studyId = req.studyId;

  await studyService.deleteStudy(studyId);

  res.status(204).send();
});

export const verifyPassword = asyncHandler(async (req, res) => {
  const studyId = req.studyId;
  const { password } = req.body;

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
  if (!req.session.authorizedStudies.includes(studyId)) {
    req.session.authorizedStudies.push(studyId);
  }
  res
    .status(200)
    .json({ success: true, data: { session: req.session.authorizedStudies } }); //현재 세션에 어떤 스터디 id가 들어있는지도 함께 응답으로 보냄.
});

//세션에 있는 스터디 id인지 점검
export const checkSession = asyncHandler(async (req, res) => {
  const studyId = req.studyId;
  const isAuthorized = req.session.authorizedStudies?.includes(studyId);
  if (!isAuthorized) {
    //세션에 없는 스터디 id 일시, 에러를 리턴한다. (그런데 그냥 응답으로 주는 게 프론트가 편하다는데, 뭐가 좋을까?)
    throw new AuthenticationError();
  }
  res.status(200).json({ success: true });
});

export const getEmoji = asyncHandler(async (req, res) => {
  const studyId = req.studyId;

  const emojis = await studyService.getEmoji(studyId);

  res.status(200).json({ success: true, data: emojis });
});

export const addEmoji = asyncHandler(async (req, res) => {
  const studyId = req.studyId;
  const { emoji } = req.body;

  //에러 핸들링 (validation)
  if (!studyId) {
    throw new BadRequestError("존재하지 않는 스터디입니다.");
  }

  if (!emoji) {
    throw new BadRequestError("추가할 이모지가 없습니다.");
  }

  const addedEmoji = await studyService.addEmoji(studyId, emoji);

  res.status(201).json({ success: true, data: addedEmoji });
});

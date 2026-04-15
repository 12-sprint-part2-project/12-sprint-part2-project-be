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
  const { id } = req.params;

  if (!id) throw new BadRequestError("존재하지 않는 스터디입니다.");

  const study = await studyService.getStudyById(id);

  res.status(200).json({ success: true, data: study });
});

export const createStudy = asyncHandler(async (req, res) => {
  const { nickname, title, description, theme, password } = req.body;

  //에러 핸들링 (validation)
  if (!title || !theme || !password || !nickname) {
    //TODO:  description항목은 사용자가 작성하지 않아도 되는거라..얘 기본값 주는 걸 어디서 할지 의논이 필요할 것 같기도? 아니면 그냥 일단 null값으로넣어야 할까. 그래야겠다.
    throw new BadRequestError(
      "스터디 생성에 실패했습니다. 닉네임, 제목, 테마, 비밀번호는 필수입니다.",
    ); //원래는 앞 문장만 정해뒀었는데 혹시모르니 뒤에 문장도 적어둠..
    //이게 400에러를 반환하는데, 500에러는 알아서 처리되는 거겠지?
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
  const { id } = req.params;
  const { title, description, theme, password, nickname } = req.body;
  if (isNaN(id)) {
    //이건 api 명세서엔 작성 안되었던건데, delete엔 했으므로 얘도 일단 해줌.. TODO: api명세서 오류 파트에 id숫자 검증 작성하기
    throw new BadRequestError("id는 숫자여야 합니다.");
  }
  if (!title || !theme || !password || !nickname) {
    throw new BadRequestError(
      "스터디 수정에 실패했습니다. 유효하지 않은 입력값입니다.",
    );
  }
  //id 검증은 프리즈마에서 알아서 해준다고 함!
  const updatedStudy = await studyService.updateStudy(id, {
    title,
    description,
    theme,
    password,
    nickname,
  });
  res.status(200).json({ success: true, data: updatedStudy });
});

export const deleteStudy = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    throw new BadRequestError("id는 숫자여야 합니다.");
  }
  await studyService.deleteStudy(id);

  res.status(204).send();
});

export const verifyPassword = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  if (isNaN(id)) {
    throw new BadRequestError("id는 숫자여야 합니다.");
  }
  const isCorrect = await studyService.verifyPassword(id, password); //boolean값을 리턴 받는다. true면 일치, false면 불일치.
  if (!isCorrect) {
    throw new BadRequestError("비밀번호가 올바르지 않습니다.");
  }
  /*세션에 스터디 id를 저장하는 로직*/
  // 세션에 인증된 스터디 목록이 없으면 빈 배열 생성
  if (!req.session.authorizedStudies) {
    req.session.authorizedStudies = [];
  }
  //비밀번호가 일치할 시, 현재 스터디 id를, 세션 배열에 추가
  if (!req.session.authorizedStudies.includes(Number(id))) {
    req.session.authorizedStudies.push(Number(id));
  }
  res
    .status(200)
    .json({ success: true, data: { session: req.session.authorizedStudies } }); //현재 세션에 어떤 스터디 id가 들어있는지도 함께 응답으로 보냄.
});

//세션에 있는 스터디 id인지 점검
export const checkSession = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const isAuthorized = req.session.authorizedStudies?.includes(Number(id));
  if (!isAuthorized) {
    //세션에 없는 스터디 id 일시, 에러를 리턴한다. (그런데 그냥 응답으로 주는 게 프론트가 편하다는데, 뭐가 좋을까?)
    throw new AuthenticationError();
  }
  res.status(200).json({ success: true });
});

export const addEmoji = asyncHandler(async (req, res) => {
  res.status(201).json({ message: "TODO" });
});

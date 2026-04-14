import * as studyService from "./study.service.js";
import asyncHandler from "../../common/middlewares/asyncHandler.js";
import { BadRequestError } from "../../errors/CustomError.js";

export const getStudies = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "TODO" });
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

export const getStudyById = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "TODO" });
});

export const updateStudy = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, theme, password, nickname } = req.body;

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
  res.status(201).json({ success: true, data: updatedStudy });
});

export const deleteStudy = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await studyService.deleteStudy(id);

  res.status(204).send();
});

export const verifyPassword = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "TODO" });
});

export const addEmoji = asyncHandler(async (req, res) => {
  res.status(201).json({ message: "TODO" });
});

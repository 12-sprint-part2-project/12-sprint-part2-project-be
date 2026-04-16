import prisma from "../../lib/prisma.js";
import {
  BadRequestError,
  StudyNotFoundError,
} from "../../errors/CustomError.js";

export const checkStudyExists = async (req, res, next) => {
  const studyId = Number(req.params.studyId);

  if (!Number.isInteger(studyId) || studyId <= 0) {
    return next(new BadRequestError("스터디 ID가 올바르지 않습니다"));
  }

  const study = await prisma.study.findUnique({
    where: { id: studyId },
    select: { id: true },
  });

  if (!study) {
    return next(new StudyNotFoundError());
  }

  req.studyId = studyId;
  next();
};

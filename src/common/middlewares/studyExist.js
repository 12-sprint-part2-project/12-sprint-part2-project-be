import prisma from "../../lib/prisma.js";
import { StudyNotFoundError } from "../../errors/CustomError.js";

export const checkStudyExists = async (req, res, next) => {
  const studyId = req.params.studyId;

  const study = await prisma.study.findUnique({
    where: { id: studyId },
    select: { id: true },
  });

  if (!study) {
    return next(new StudyNotFoundError());
  }

  next();
};

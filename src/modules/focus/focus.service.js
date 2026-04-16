import prisma from "../../lib/prisma.js";
import { StudyNotFoundError, ConflictError } from "../../errors/CustomError.js";

export const getSession = async (studyId) => {
  const focus = await prisma.FocusSession.findFirst({
    where: {
      studyId: studyId,
    },
    select: {
      id: true,
      studyId: true,
      status: true,
      startTime: true,
      endTime: true,
      durationMin: true,
      pausedAt: true,
      earnedPoint: true,
    },
  });

  if (!focus) return null;

  if (focus.status === "completed") {
    return { status: "completed" };
  }

  return focus;
};
export const createSession = async (studyId, durationMin) => {
  // 해당 스터디가 존재하는지 체크
  const study = await prisma.study.findUnique({
    where: { id: studyId },
  });

  if (!study) {
    throw new StudyNotFoundError();
  }

  // 현재 진행중인 집중이 있는지 확인
  const focus = await prisma.FocusSession.findFirst({
    where: {
      studyId: studyId,
      status: {
        in: ["running", "paused"],
      },
    },
  });

  if (focus) throw new ConflictError();

  // 현재 시간에 durationMin을 더한 시간을 endTime으로 삽입
  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + durationMin * 60 * 1000);

  const newFocus = await prisma.FocusSession.create({
    data: {
      studyId: studyId,
      durationMin: durationMin,
      status: "running",
      endTime: endTime,
    },
  });

  return newFocus;
};
export const updateSession = async (id, data) => {};

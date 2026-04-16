import prisma from "../../lib/prisma.js";
import { StudyNotFoundError, ConflictError } from "../../errors/CustomError.js";

export const getSession = async (studyId) => {
  const focus = await prisma.FocusSession.findFirst({
    where: {
      studyId,
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
  // 현재 진행중인 집중이 있는지 확인
  const focus = await prisma.FocusSession.findFirst({
    where: {
      studyId,
      status: {
        in: ["running", "paused"],
      },
    },
  });

  if (focus) throw new ConflictError("이미 진행 중인 집중 세션이 있습니다");

  // 현재 시간에 durationMin을 더한 시간을 endTime으로 삽입
  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + durationMin * 60 * 1000);

  const newFocus = await prisma.FocusSession.create({
    data: {
      studyId,
      durationMin,
      status: "running",
      endTime,
    },
  });

  return newFocus;
};
export const updateSession = async (studyId, id, status) => {
  // 해당 집중 존재 및 상태 조회(completed일 경우 상태 변경이 불가능하므로)
  const focus = await prisma.FocusSession.findFirst({
    where: {
      id: id,
      studyId: studyId,
    },
    select: {
      id: true,
      studyId: true,
      status: true,
      durationMin: true,
    },
  });

  if (focus.status === "completed") {
    throw new ConflictError("종료된 집중 상태는 변경할 수 없습니다.");
  }

  /* 상태에 따라 업데이트 되어야 할 필드가 달라지기 때문에 let으로 선언
   ** running과 completed일땐 pausedAt을 null 처리
   ** completed 처리 되었을 때 포인트 제공
   */
  let data = {
    status: status,
    updatedAt: new Date(),
    pausedAt: status === "paused" ? new Date() : null,
    earnedPoint: status === "completed" ? 8 : 0,
  };

  // running 상태일 때 현재시간 기준으로 종료 시간 재계산
  if (status === "running") {
    const startTime = new Date();
    data.endTime = new Date(
      startTime.getTime() + focus.durationMin * 60 * 1000,
    );
  }

  const updateFocus = await prisma.FocusSession.update({
    where: {
      id: id,
      studyId: studyId,
    },
    data: data,
  });

  return updateFocus;
};

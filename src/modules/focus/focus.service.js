import prisma from "../../lib/prisma.js";
import { ConflictError } from "../../errors/CustomError.js";

export const getSessions = async (studyId) => {
  const focus = await prisma.FocusSession.findMany({
    where: {
      studyId,
      status: {
        in: ["running", "paused"],
      },
    },
    orderBy: {
      startTime: "desc",
    },
    select: {
      id: true,
      studyId: true,
      title: true,
      status: true,
      startTime: true,
      endTime: true,
      durationSec: true,
      pausedAt: true,
      earnedPoint: true,
    },
  });

  if (!focus) return null;

  return focus;
};

export const createSession = async (studyId, durationSec, title) => {
  // 현재 진행중인 집중이 있는지 확인
  const focus = await prisma.FocusSession.findFirst({
    where: {
      studyId,
      title,
      status: {
        in: ["running", "paused"],
      },
    },
  });

  if (focus) throw new ConflictError("이미 진행 중인 집중 세션이 있습니다");

  // 현재 시간에 durationSec 더한 시간을 endTime으로 삽입
  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + durationSec * 1000);

  const newFocus = await prisma.FocusSession.create({
    data: {
      studyId,
      durationSec,
      status: "running",
      endTime,
      title: title.trim(),
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
      durationSec: true,
      endTime: true,
      pausedAt: true,
    },
  });

  if (focus.status === "completed") {
    throw new ConflictError("종료된 집중 상태는 변경할 수 없습니다.");
  }

  /* 상태에 따라 업데이트 되어야 할 필드가 달라지기 때문에 let으로 선언
   ** running과 completed일땐 pausedAt을 null 처리
   ** completed 처리 되었을 때 포인트 제공
   ** 0418 - status가 failed로 들어올 경우 중도 포기로 간주 -> completed로 처리 후 포인트 지급X
   */
  let data = {
    status: status === "failed" ? "completed" : status,
    updatedAt: new Date(),
    pausedAt: status === "paused" ? new Date() : null,
  };

  // 중도 포기시 상태는 completed로 들어가지만 지급 포인트는 X / 정상 완료 시 설정 시간 + 기본 3포인트로 정산해서 update
  if (status === "failed") data.earnedPoint = 0;
  else if (status === "completed")
    data.earnedPoint = Math.ceil(focus.durationSec / 60) + 3;

  // running 상태일 때 현재시간 기준으로 종료 시간 재계산
  if (status === "running") {
    const remainingMs =
      new Date(focus.endTime).getTime() - new Date(focus.pausedAt).getTime();

    data.endTime = new Date(Date.now() + remainingMs);
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

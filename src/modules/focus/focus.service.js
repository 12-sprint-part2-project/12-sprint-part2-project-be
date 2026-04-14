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
export const createSession = async (studyId, data) => {};
export const updateSession = async (id, data) => {};

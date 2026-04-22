import prisma from "../../lib/prisma.js";

const countedEmojis = (emojis, limit = null) => {
  const countMap = {};
  for (const { emoji } of emojis) {
    countMap[emoji] = (countMap[emoji] || 0) + 1;
  }

  const sorted = Object.entries(countMap)
    .map(([emoji, count]) => ({
      emoji,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  return limit ? sorted.slice(0, limit) : sorted;
};

export const getStudies = async (data) => {
  const page = Number(data.page) || 1; // 현재 페이지 초기 설정
  const limit = Number(data.limit) || 6; // 페이지당 출력 수 초기 설정
  const keyword = data.keyword || ""; // 검색 키워드
  const sortBy = data.sortBy || "createdAt"; // 초기 정렬 기준 필드
  const order = data.order || "desc"; // 초기 정렬 순서

  const skip = (page - 1) * limit; // 건너뛸 수

  const where = {};

  if (keyword) {
    // 스터디 제목에 검색키워드 포함된 데이터만
    where.OR = [
      { title: { contains: keyword, mode: "insensitive" } },
      { nickname: { contains: keyword, mode: "insensitive" } },
      { description: { contains: keyword, mode: "insensitive" } },
    ];
  }

  /**
   * 정렬 기준에 따라 응답해야할 데이터를 다르게 처리
   * 포인트 기준을 정렬을 해야하는 경우 집중 테이블(focusSessions)의 필드 데이터(earnedPoint)의 합계로 이루어져야 하는 이슈
   * 이 부분은 $queryRaw(?)를 이용해서 구현할 수 있다고는 하나 온전히 ai 가 짜준 코드를 복붙하는 수준밖에 안되는 상태라 용납할 수 없음
   * $queryRaw 를 찾아보고 적용하는 것은 추후에 고려.
   * 차선책으로는 study 테이블에 포인트합계 필드를 추가해서
   * 포인트 획득시 study 테이블, focusSessions 테이블 두 곳을 컨트롤하는 방법도 있음.
   *
   * 결론:
   * 포인트 기준 정렬 요청시 조회된 전체 데이터에서 배열을 포인트 정렬 기준에 맞게 가공 후 return
   * 생성일시 기준 정렬 요청시 조회시 쿼리를 사용해서 데이터를 가져옴
   */
  if (sortBy === "points") {
    const allStudiesRaw = await prisma.study.findMany({
      where,
      include: {
        focusSessions: {
          where: { status: "completed" },
          select: { earnedPoint: true },
        },
        emojis: true,
      },
    });

    const allStudies = allStudiesRaw.map(
      ({ focusSessions, emojis, ...rest }) => ({
        ...rest,
        points: focusSessions.reduce((sum, s) => sum + s.earnedPoint, 0),
        emojis: countedEmojis(emojis, 3),
      }),
    );

    allStudies.sort((a, b) =>
      order === "desc" ? b.points - a.points : a.points - b.points,
    );

    const total = allStudies.length;
    const studies = allStudies.slice(skip, skip + limit);
    const has_more = skip + limit < total;

    return { data: studies, total, has_more };
  }

  const [studiesRaw, total] = await Promise.all([
    prisma.study.findMany({
      skip,
      take: limit,
      where,
      orderBy: { [sortBy]: order },
      include: {
        focusSessions: {
          where: { status: "completed" },
          select: { earnedPoint: true },
        },
        emojis: true,
      },
    }),
    prisma.study.count({ where }),
  ]);

  const studies = studiesRaw.map(({ focusSessions, emojis, ...rest }) => ({
    ...rest,
    points: focusSessions.reduce((sum, s) => sum + s.earnedPoint, 0),
    emojis: countedEmojis(emojis, 3),
  }));

  const has_more = skip + limit < total;

  return {
    data: studies,
    total,
    has_more,
  };
};

export const getRecentStudies = async (ids) => {
  const studies = await prisma.study.findMany({
    where: { id: { in: ids } },
    omit: { password: true },
    include: {
      focusSessions: {
        where: { status: "completed" },
        select: {
          earnedPoint: true,
        },
      },
      emojis: true,
    },
  });

  const sorted = ids.map((id) => studies.find((study) => study.id === id));

  const res = sorted.map((study) => {
    const emojis = countedEmojis(study.emojis, 3);
    const points = study.focusSessions.reduce(
      (sum, s) => sum + s.earnedPoint,
      0,
    );

    return { ...study, points, emojis };
  });

  return res;
};

export const getStudyById = async (id) => {
  const today = new Date();
  const day = today.getDay(); // 오늘이 속한 요일(숫자로 받음)
  const monday = new Date(today); // 오늘 날짜를 기준으로 이번 주의 월요일을 구함
  monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1));
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(today); // 오늘 날짜를 기준으로 이번 주의 일요일을 구함
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  const res = await prisma.study.findUniqueOrThrow({
    where: { id },
    omit: { password: true },
    include: {
      habits: {
        orderBy: {
          createdAt: "asc",
        },
        include: {
          // habitLogs 까지 가져와야함
          habitLogs: {
            where: {
              logDate: {
                gte: monday,
                lte: sunday,
              },
            },
          },
        },
      },
      focusSessions: {
        where: { status: "completed" },
        select: {
          earnedPoint: true,
        },
      },
      emojis: true,
    },
  });

  const emojis = countedEmojis(res.emojis, 3);

  return { ...res, emojis };
};

export const createStudy = async (data) => {
  console.log("연결 주소 확인:", process.env.DATABASE_URL);
  const res = await prisma.study.create({
    data,
  });
  return res;
};

export const updateStudy = async (id, data) => {
  const res = await prisma.study.update({
    where: { id },
    data,
  });
  return res;
};

export const deleteStudy = async (id) => {
  const res = await prisma.study.delete({
    where: { id },
  });
  return res;
};

export const verifyPassword = async (id, password) => {
  //prisma로, 해당하는 id의 스터디를 가져온다. (password필드만 셀렉해서 가져옴.)
  const study = await prisma.study.findUniqueOrThrow({
    where: { id },
    select: { password: true },
  });
  //가져온 study의 password필드를 주어진 password와 비교한다.
  const isCorrect = study.password === password;
  //일치하는지에 대한 boolean값을 리턴함.
  return isCorrect;
};

export const getEmoji = async (studyId) => {
  const res = await prisma.emoji.findMany({
    where: { studyId },
  });

  return countedEmojis(res);
};

export const addEmoji = async (studyId, emoji) => {
  const res = await prisma.emoji.create({
    data: { studyId, emoji },
  });

  return res;
};

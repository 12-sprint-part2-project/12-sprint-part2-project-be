import prisma from "../../lib/prisma.js";

export const getStudies = async () => {};

export const getStudyById = async (id) => {
  const today = new Date();
  const day = today.getDay(); // 오늘이 속한 요일(숫자로 받음)
  const monday = new Date(today); // 오늘 날짜를 기준으로 이번 주의 월요일을 구함
  monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1));
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(today); // 오늘 날짜를 기준으로 이번 주의 일요일을 구함
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  const res = prisma.study.findUniqueOrThrow({
    where: { id: Number(id) },
    omit: { password: true },
    include: {
      habits: {
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
      focusSessions: true,
      emojis: true,
    },
  });

  return res;
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
    where: { id: Number(id) },
    data,
  });
  return res;
};

export const deleteStudy = async (id) => {
  const res = await prisma.study.delete({
    where: { id: Number(id) },
  });
  return res;
};

export const verifyPassword = async (id, password) => {
  //prisma로, 해당하는 id의 스터디를 가져온다. (password필드만 셀렉해서 가져옴.)
  const study = await prisma.study.findUniqueOrThrow({
    where: { id: Number(id) },
    select: { password: true },
  });
  //가져온 study의 password필드를 주어진 password와 비교한다.
  const isCorrect = study.password === password;
  //일치하는지에 대한 boolean값을 리턴함.
  return isCorrect;
};

export const addEmoji = async (studyId, emoji) => {};

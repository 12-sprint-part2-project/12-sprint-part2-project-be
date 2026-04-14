import prisma from "../../lib/prisma.js";

export const getStudies = async () => {};
export const createStudy = async (data) => {
  console.log("연결 주소 확인:", process.env.DATABASE_URL);
  const res = await prisma.study.create({
    data,
  });
  return res;
};
export const getStudyById = async (id) => {};
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
export const verifyPassword = async (id, password) => {};
export const addEmoji = async (studyId, emoji) => {};

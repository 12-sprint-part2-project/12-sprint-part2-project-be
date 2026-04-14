import { prisma } from "../../lib/prisma";

const prisma = new PrismaClient();

export const getStudies = async () => {};
export const createStudy = async (data) => {
  const res = await prisma.studies.create({
    data,
  });
  return res;
};
export const getStudyById = async (id) => {};
export const updateStudy = async (id, data) => {
  const res = await prisma.studies.update({
    where: { id },
    data,
  });
  return res;
};
export const deleteStudy = async (id) => {
  const res = await prisma.studies.delete({
    where: { id },
  });
  return res;
};
export const verifyPassword = async (id, password) => {};
export const addEmoji = async (studyId, emoji) => {};

import { prisma } from "~/db.server";

export const getAllQuestionTypes = async () => {
  return await prisma.questionType.findMany();
}

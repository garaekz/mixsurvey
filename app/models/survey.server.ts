import type { User, Survey, Question } from "@prisma/client";

import { prisma } from "~/db.server";
import { slugify } from "~/utils";
import { createId } from "@paralleldrive/cuid2";

export type { Survey } from "@prisma/client";


export async function createSurvey({
  title,
  questions,
  category,
  userId,
}: Pick<Survey, "title"> & {
  userId: User["id"];
} & {
  questions: Array<{
    text: Question["text"];
    type: Question["questionTypeId"];
  }>
} & {
  category: Survey["categoryId"];
}) {

  let slug = slugify(title);
  const checkTitle = await prisma.survey.findFirst({
    where: {
      slug,
    },
  });

  if (checkTitle) {
    slug = slugify(title + createId());
  }

  return await prisma.survey.create({
    data: {
      title,
      slug,
      questions: {
        create: questions.map((question) => ({
          text: question.text,
          questionTypeId: question.type,
        })),
      },
      user: {
        connect: {
          id: userId,
        },
      },
      category: {
        connect: {
          id: category,
        },
      },
    },
  });
}

export async function getPagedSurveys(
  page: number,
  limit: number
) {
  return await prisma.survey.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      slug: true,
      createdAt: true,
      updatedAt: true,
      category: {
        select: {
          name: true,
        },
      },
      questions: {
        select: {
          text: true,
        },
      },
      responses: {
        select: {
          id: true,
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
    skip: (page - 1) * limit,
    take: limit,
  });
}
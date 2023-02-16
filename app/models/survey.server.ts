import type { User, Survey, Question, CustomField } from "@prisma/client";

import { prisma } from "~/db.server";
import { slugify } from "~/utils";
import { createId } from "@paralleldrive/cuid2";

export type { Survey } from "@prisma/client";


export async function createSurvey({
  title,
  questions,
  customFields,
  userId,
}: Pick<Survey, "title"> & {
  userId: User["id"];
} & {
  questions: Array<{
    text: Question["text"];
    type: Question["questionTypeId"];
  }>
  & {
    customFields: Array<{
      key: CustomField["key"];
      value: CustomField["value"];
    }>
  }
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
      user: {
        connect: {
          id: userId,
        },
      },
      questions: questions?.length > 0 ? {
        create: questions.map((question) => ({
          text: question.text,
          questionTypeId: question.type,
        })),
      } : undefined,
      customFields: customFields?.length > 0 ? {
        create: customFields.map((customField: CustomField) => ({
          key: customField.key,
          value: customField.value,
        })),
      } : undefined,
    }
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
      isPublished: true,
      createdAt: true,
      updatedAt: true,
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
      customFields: {
        select: {
          id: true,
          key: true,
          value: true,
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
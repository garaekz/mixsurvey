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
} & {
  customFields: Array<{
    key: CustomField["key"];
    value: CustomField["value"];
  }>
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
        create: customFields.map((customField: any) => ({
          key: customField.key,
          value: customField.value,
        })),
      } : undefined,
    }
  });
}

export async function getSurveyById(id: Survey["id"]) {
  return await prisma.survey.findUnique({
    where: {
      id,
    },
    include: {
      questions: true,
      customFields: true,
      responses: true,
    },
  });
}

export async function getPagedSurveys(
  page: number,
  limit: number
) {
  const count = await prisma.survey.count();
  const totalPages = Math.ceil(count / limit);

  if (page > totalPages) {
    page = totalPages;
  }
  
  const surveys = await prisma.survey.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      questions: true,
      customFields: true,
      responses: true,
    },
  });

  return {
    data: surveys,
    pagination: {
      from: (page - 1) * limit + 1,
      to: (page - 1) * limit + surveys.length,
      currentPage: page,
      total: count,
      totalPages,
    },
  };
}

export async function updateSurvey(
  id: Survey["id"],
  data: Partial<Survey> & {
    questions: Pick<Question, "text" | "questionTypeId">[];
    customFields: Pick<CustomField, "key" | "value">[];
  }
) {
  return await prisma.survey.update({
    where: {
      id,
    },
    data: {
      ...data,
      questions: {
        deleteMany: {},
        create: data.questions?.map((question) => ({
          text: question.text,
          questionTypeId: question.questionTypeId,
        })),
      },
      customFields: {
        deleteMany: {},
        create: data.customFields?.map((customField: any) => ({
          key: customField.key,
          value: customField.value,
        })),
      },
    },
    include: {
      questions: true,
      customFields: true,
      responses: true,
    },
  });
}
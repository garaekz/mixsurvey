import type { Category, User } from "@prisma/client";
import { createId } from '@paralleldrive/cuid2';

import { prisma } from "~/db.server";
import { slugify } from "~/utils";

export type { Category } from "@prisma/client";

export async function getAllCategories() {
  return await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function createCategory({
  name,
  userId,
}: Pick<Category, "name"> & {
  userId: User["id"];
}) {
  let slug = slugify(name);
  const checkCategory = await prisma.category.findFirst({
    where: {
      slug,
    },
  });

  if (checkCategory) {
    slug = slugify(name + createId());
  }

  return await prisma.category.create({
    data: {
      name,
      slug,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { slugify } from "~/utils";

const prisma = new PrismaClient();

async function seed() {
  const email = "test@remix.run";
  const name = "Test User";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("racheliscool", 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  const questionTypes = [
    "Slider",
    "Opción múltiple",
    "Texto",
    "Texto largo",
  ];

  await prisma.questionType.createMany({
    data: questionTypes.map((name) => ({ name, slug: slugify(name) })),
  });


  await prisma.note.create({
    data: {
      title: "My first note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  await prisma.note.create({
    data: {
      title: "My second note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import prisma from "./lib/prisma.js";

async function test() {
  const users = await prisma.user.findMany();
  console.log(users);
}

test()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
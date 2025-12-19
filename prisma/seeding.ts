import { prisma } from "../src/libs/prisma";
import logger from "../src/libs/logger";
import { hashPassword, verifyPassword } from "../src/libs/passwordHashing";

async function main() {
    logger.info("🌱 Seeding database...");

    const users = [];

    const password = hashPassword("Aa@123456");

    for (let i = 1; i <= 30; i++) {
        users.push({
            email: `user${i}@gmail.com`,
            firstName: `firstUser${i}`,
            lastName: `lastUser${i}`,
            password,
        });
    }

    await prisma.user.createMany({
        data: users,
        skipDuplicates: true,
    });

    logger.info("🌱 Seeding finished!");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (error) => {
        logger.error("Seeder Error:", error);
        await prisma.$disconnect();
        process.exit(1);
    });

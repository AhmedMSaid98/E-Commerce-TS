import { PrismaClient } from "../../generated/prisma/client";
import logger from "../../libs/logger";
import { prisma } from "../../libs/prisma";

export async function genericCountService<Tmodel extends keyof PrismaClient>(
    model: Tmodel,
    where: Record<string, any>
) {
    logger.info(`Executing count service helper function for model: ${model.toString()}`);

    const totalCount = await (prisma as any)[model].count({ where });
    return totalCount as number;
}

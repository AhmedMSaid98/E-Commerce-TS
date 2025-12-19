import { PrismaClient } from "../../generated/prisma/client";
import { prisma } from "../../libs/prisma";
import logger from "../../libs/logger";

export async function genericSumService<TModel extends keyof PrismaClient>(
    model: TModel,
    field: string,
    whereQuery?: Record<string, any>
): Promise<number> {
    logger.info(`Executing sum service for model: ${model.toString()}`);

    const result = await (prisma as any)[model].aggregate({
        where: whereQuery,
        _sum: {
            [field]: true,
        },
    });

    return result?._sum?.[field] ?? 0;
}

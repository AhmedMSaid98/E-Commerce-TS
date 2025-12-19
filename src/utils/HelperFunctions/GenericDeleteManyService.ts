import logger from "../../libs/logger";
import { PrismaClient } from "../../generated/prisma/client";
import { prisma } from "../../libs/prisma";
import resTransformer from "../response/res-transformer";

export async function genericDeleteManyService<Tmodel extends keyof PrismaClient>(
    model: Tmodel,
    whereQuery: Record<string, any>,
    DFMessage: string,
    SCMessage: string
) {
    logger.info(`Executing delete many service helper function for model: ${model.toString()}`);
    const deleted = await (prisma as any)[model].deleteMany({ where: whereQuery });
    if (!deleted) {
        return resTransformer(
            false,
            400,
            `Failed to delete ${model.toString()} with id: ${JSON.stringify(whereQuery)}`,
            DFMessage
        );
    }
    return resTransformer(
        true,
        200,
        `${model.toString()} with id: ${JSON.stringify(whereQuery)} deleted successfully`,
        SCMessage,
        deleted
    );
}

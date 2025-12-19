import { PrismaClient } from "../../generated/prisma/client";
import logger from "../../libs/logger";
import { prisma } from "../../libs/prisma";
import resTransformer from "../response/res-transformer";

/**
 * Generic updateMany service for Prisma models
 */
export async function genericUpdateManyService<TModel extends keyof PrismaClient>(
    model: TModel,
    whereQuery: Record<string, any>,
    data: Record<string, any>,
    NFErrorMessage: string,
    UFMessage: string,
    SCMessage: string
) {
    logger.info(`Executing updateMany service for model: ${model.toString()}`);

    // ---------------------------------------------------
    // 1. Clean undefined fields
    // ---------------------------------------------------
    const cleanData = Object.fromEntries(Object.entries(data).filter(([_, value]) => value !== undefined));

    if (Object.keys(cleanData).length === 0) {
        return resTransformer(false, 400, "No valid fields provided for update", "No changes detected");
    }

    // ---------------------------------------------------
    // 2. Perform updateMany
    // ---------------------------------------------------
    const result = await (prisma as any)[model].updateMany({
        where: whereQuery,
        data: cleanData,
    });

    // ---------------------------------------------------
    // 3. Handle no records updated
    // ---------------------------------------------------
    if (result.count === 0) {
        return resTransformer(false, 404, NFErrorMessage, NFErrorMessage);
    }

    // ---------------------------------------------------
    // 4. Success response
    // ---------------------------------------------------
    return resTransformer(
        true,
        200,
        `${result.count} ${model.toString()} records updated successfully`,
        SCMessage,
        { updatedCount: result.count }
    );
}

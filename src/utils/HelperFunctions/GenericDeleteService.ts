import { PrismaClient } from "../../generated/prisma/client";
import logger from "../../libs/logger";
import { prisma } from "../../libs/prisma";
import resTransformer from "../response/res-transformer";
import { genericGetByConstrain } from "./GenericGetByConstrain";

/**
 * Fetches records from the database
 * @param model             - The Prisma model name (e.g. "user", "post")
 * @param whereQuery        - Filter conditions for searching records
 * @param selectQuery       - Fields to be returned from the model
 * @param NFErrorMessage    - Message shown when no records are found
 * @param DFMessage         - Message shown when no records are found
 * @param SCMessage         - Message shown when records are successfully retrieved
 */

export async function genericDeleteService<
    Tmodel extends keyof PrismaClient,
    TResult extends Record<string, any>
>(
    model: Tmodel,
    whereQuery: Record<string, any>,
    selectQuery: Record<string, any>,
    NFErrorMessage: string,
    DFMessage: string,
    SCMessage: string
) {
    logger.info(`Executing delete service helper function for model: ${model.toString()}`);

    const uniqueExists = await genericGetByConstrain<Tmodel, TResult>(
        model,
        whereQuery,
        selectQuery,
        NFErrorMessage
    );
    if (!uniqueExists) {
        return uniqueExists;
    }

    const deleted = await (prisma as any)[model].delete({ where: whereQuery, select: selectQuery });
    if (!deleted) {
        return resTransformer<TResult>(
            false,
            400,
            `Failed to delete ${model.toString()} with id: ${JSON.stringify(whereQuery)}`,
            DFMessage
        );
    }
    return resTransformer<TResult>(
        true,
        200,
        `${model.toString()} with id: ${JSON.stringify(whereQuery)} deleted successfully`,
        SCMessage,
        deleted
    );
}

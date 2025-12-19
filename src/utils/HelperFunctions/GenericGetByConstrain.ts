import { PrismaClient } from "../../generated/prisma/client";
import { UserSelect } from "../../generated/prisma/models";
import logger from "../../libs/logger";
import { prisma } from "../../libs/prisma";
import resTransformer from "../response/res-transformer";

/**
 * Fetches records from the database
 * @param model - The Prisma model name (e.g. "user", "post")
 * @param whereQuery - Filter conditions for searching records
 * @param selectQuery - Fields to be returned from the model
 * @param NFErrorMessage - Message shown when no records are found
 * @param SCMessage - Message shown when records are successfully retrieved
 */

export async function genericGetByConstrain<
    Tmodel extends keyof PrismaClient,
    TResult extends Record<string, any>
>(
    model: Tmodel,
    whereQuery: Record<string, any> | Record<string, any>[],
    selectQuery: Record<string, any>,
    NFErrorMessage?: string,
    SCMessage?: string
) {
    logger.info(`Executing find unique service helper function for model: ${model.toString()}`);

    let exists;

    // normalize to array
    const whereList = Array.isArray(whereQuery) ? whereQuery : [whereQuery];

    // try each unique constraint
    for (const where of whereList) {
        exists = await (prisma as any)[model].findUnique({
            where,
            select: selectQuery,
        });

        if (exists) break; // stop on first match
    }

    if (!exists) {
        return resTransformer<TResult>(
            false,
            404,
            `${model.toString()} with constrain: ${JSON.stringify(whereQuery)} not found`,
            NFErrorMessage!
        );
    }

    if ("isDeleted" in exists && exists.isDeleted === true) {
        return resTransformer<TResult>(
            false,
            403,
            `${model.toString()} is deleted`,
            `${model.toString()} is deleted`
        );
    }

    return resTransformer<TResult>(
        true,
        200,
        `${model.toString()} with constrain: ${JSON.stringify(whereQuery)} found successfully`,
        SCMessage!,
        exists!
    );
}

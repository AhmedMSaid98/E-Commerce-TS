import { PrismaClient } from "../../generated/prisma/client";
import logger from "../../libs/logger";
import { prisma } from "../../libs/prisma";
import resTransformer from "../response/res-transformer";
import { genericGetByConstrain } from "./GenericGetByConstrain";

/**
 * Fetches records from the database
 * @param model - The Prisma model name (e.g. "user", "post")
 * @param whereQuery - Filter conditions for searching records
 * @param selectQuery - Fields to be returned from the model
 * @param existMessage - Message shown when constrain found
 * @param SCMessage - Message shown when records are successfully retrieved
 * @param CFMessage - Message shown when something went wrong while creating
 */

export async function genericCreateService<
    Tmodel extends keyof PrismaClient,
    TResult extends Record<string, any>
>(
    model: Tmodel,
    data: Record<string, any>,
    selectQuery: Record<string, any>,
    CFMessage: string,
    SCMessage: string
    // FKData?: Record<string, any>,
    // foreignKey?: Record<string, { model: keyof PrismaClient; resMessage: string }>
) {
    logger.info(`Executing create service helper function for model: ${model.toString()}`);

    const create = (await (prisma as any)[model].create({ data, select: selectQuery })) as TResult;
    if (!create) {
        return resTransformer<TResult>(false, 400, `Failed to create new ${model.toString()}`, CFMessage);
    }
    return resTransformer<TResult>(
        true,
        200,
        `New ${model.toString()} created successfully`,
        SCMessage,
        create
    );
}

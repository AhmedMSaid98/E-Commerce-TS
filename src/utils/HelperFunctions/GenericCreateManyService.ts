import { Prisma, PrismaClient } from "../../generated/prisma/client";
import logger from "../../libs/logger";
import { prisma } from "../../libs/prisma";
import resTransformer from "../response/res-transformer";
import { genericGetAllService } from "./GenericGetAllService";
import { genericGetByConstrain } from "./GenericGetByConstrain";

export async function genericCreateManyService<
    Tmodel extends keyof PrismaClient,
    TResult extends Record<string, any>
>(
    model: Tmodel,
    whereQuery: Record<string, any> | Record<string, any>[],
    data: Record<string, any> | Record<string, any>[],
    selectQuery: Record<string, any>,
    NFErrorMessage: string,
    existMessage: string,
    CFMessage: string,
    GASCMessage: string,
    SCMessage: string
) {
    logger.info(`Executing create many service helper function for model: ${model.toString()}`);

    const exists = await genericGetAllService(model, whereQuery, selectQuery, NFErrorMessage, GASCMessage);
    if (exists.totalDataCount > 0) {
        return resTransformer(false, 400, existMessage, existMessage, exists.data);
    }

    const createMany = (await (prisma as any)[model].createMany({ data })) as Prisma.BatchPayload;
    if (!createMany) {
        return resTransformer<TResult>(false, 400, `Failed to create new ${model.toString()}`, CFMessage);
    }
    return resTransformer(true, 200, `New ${model.toString()} created successfully`, SCMessage, createMany);
}

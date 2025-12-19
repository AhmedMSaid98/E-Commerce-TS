import { PrismaClient } from "../../generated/prisma/client";
import logger from "../../libs/logger";
import { prisma } from "../../libs/prisma";
import resTransformer from "../response/res-transformer";
import { genericGetByConstrain } from "./GenericGetByConstrain";
import { genericUpdateService } from "./GenericUpdateService";

export async function genericSoftDeleteService<
    Tmodel extends keyof PrismaClient,
    TResult extends Record<string, any>
>(
    model: Tmodel,
    data: Object,
    whereQuery: Record<string, any>,
    selectQuery: Record<string, any>,
    NFErrorMessage: string,
    noChangesMessage: string,
    DFMessage: string,
    existMessage: string,
    SCMessage: string
) {
    logger.info(`Executing delete service helper function for model: ${model.toString}`);
    const uniqueExists = await genericGetByConstrain<Tmodel, TResult>(
        model,
        whereQuery,
        selectQuery,
        NFErrorMessage
    );
    if (!uniqueExists.success) {
        return uniqueExists;
    }

    const softDeleteUser = await genericUpdateService<Tmodel, TResult>(
        model,
        { isDeleted: true },
        whereQuery,
        data,
        selectQuery,
        NFErrorMessage,
        noChangesMessage,
        existMessage,
        DFMessage,
        SCMessage
    );
    return softDeleteUser;
}

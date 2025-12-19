import { PrismaClient } from "../../generated/prisma/client";
import logger from "../../libs/logger";
import { prisma } from "../../libs/prisma";
import paginateResTransformer from "../response/paginated-res-transformer";
import { genericCountService } from "./GenericCountService";

/**
 * in prisma what you gonna need to get from the frontEnd is depending on every project
 * but you can add all features for every possible situation that findMany is used for
 */

/**
 * Fetches records from the database
 * @param model             - The Prisma model name (e.g. "user", "post")
 * @param whereQuery        - Filter conditions for searching records
 * @param selectQuery       - Fields to be returned from the model
 * @param NFErrorMessage    - Message shown when no records are found
 * @param SCMessage         - Message shown when records are successfully retrieved
 * @param limit             - Number of records per page (must be used with `page`)
 * @param page              - Current page number (must be used with `limit`)
 */

export async function genericGetAllService<
    Tmodel extends keyof PrismaClient,
    TResult extends Record<string, any>
>(
    model: Tmodel,
    whereQuery: Record<string, any>, //Where conditions that is made for search
    selectQuery: Record<string, boolean> | Record<string, boolean>[], // What you want to return from the model
    NFErrorMessage: string, // Not Found error message {English}
    SCMessage: string, // successfull message {English}
    limit?: number, // return limit from the model
    page?: number
) {
    //can swap console.log() with logger
    logger.info(`Executing get all service helper function for model: ${model.toString()}`);

    let skip = undefined;
    let take = undefined;

    /**
     * check if limit and page are provided
     * or one of them and the other should be provided
     * or you return the full list without pagination
     */
    if (limit && page) {
        skip = (page - 1) * limit;
        take = limit;
    } else if ((limit && !page) || (!limit && page)) {
        logger.warn("Both limit and page must be provided");
        throw new Error("Both limit and page must be provided");
    }
    // filters the where if anything isn`t provided to avoid any errors or just search without a where argument
    const cleanWhere = Object.fromEntries(
        Object.entries(whereQuery).filter(([_, v]) => v !== undefined && v != null)
    );

    const totalCount = await genericCountService<Tmodel>(model, cleanWhere);
    const totalPages = Math.ceil(totalCount / limit!);
    if (skip !== undefined && take !== undefined) {
        if (totalCount === 0) {
            return paginateResTransformer<TResult>(
                false,
                404,
                `${model.toString()} not found`,
                NFErrorMessage,
                page!,
                totalPages,
                totalCount,
                []
            );
        } else if (page! > totalPages) {
            return paginateResTransformer<TResult>(
                false,
                400,
                "Page number exceeded total pages available",
                "Page number exceeded total pages available",
                page!,
                totalPages,
                totalCount,
                []
            );
        }

        const list = (await (prisma as any)[model].findMany({
            where: cleanWhere,
            select: selectQuery,
            skip: skip,
            take: take,
        })) as TResult[];
        return paginateResTransformer<TResult>(
            true,
            200,
            `Fetched ${model.toString()} list successfully`,
            SCMessage,
            page!,
            totalPages,
            totalCount,
            list
        );
    }

    if (totalCount === 0) {
        return paginateResTransformer<TResult>(
            false,
            404,
            `${model.toString()} not found`,
            NFErrorMessage,
            page!,
            totalPages,
            totalCount,
            []
        );
    }

    const list = (await (prisma as any)[model].findMany({
        where: cleanWhere,
        select: selectQuery,
    })) as TResult[];
    return paginateResTransformer(
        true,
        200,
        `Fetched ${model.toString()} list successfully`,
        SCMessage,
        page || 0,
        totalPages || 0,
        totalCount,
        list
    );
}

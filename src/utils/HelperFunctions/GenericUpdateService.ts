import { PrismaClient } from "../../generated/prisma/client";
import logger from "../../libs/logger";
import { prisma } from "../../libs/prisma";
import resTransformer from "../response/res-transformer";
import { genericGetByConstrain } from "./GenericGetByConstrain";

/**
 * Generic update service for Prisma models
 *
 * @param model             - Prisma model name (e.g. "user", "post")
 * @param data              - Fields to update
 * @param whereQuery             - Main constraint(s) to find the record
 * @param unique            - Unique constraint(s) to validate duplicates (e.g. email, phone)
 * @param selectQuery            - Fields to return in the response
 * @param NFErrorMessage    - Message when no record is found
 * @param noChangesMessage  - Message when the update contains no changes
 * @param existMessage      - Message when a unique value already exists
 * @param UFMessage         - Message when update fails
 * @param SCMessage         - Success message
 */
export async function genericUpdateService<
    Tmodel extends keyof PrismaClient,
    TResult extends Record<string, any>
>(
    model: Tmodel,
    data: object,
    whereQuery: Record<string, any> | Record<string, any>[],
    unique: Record<string, any> | Record<string, any>[] | undefined,
    selectQuery: Record<string, any>,
    NFErrorMessage: string,
    noChangesMessage: string,
    existMessage: string,
    UFMessage: string,
    SCMessage: string
) {
    logger.info(`Executing update service for model: ${model.toString()}`);

    // ---------------------------------------------------
    // 1. Check if the record to update exists
    // ---------------------------------------------------
    const found = await genericGetByConstrain<Tmodel, TResult>(
        model,
        whereQuery,
        selectQuery,
        NFErrorMessage
    );
    if (!found.success || !found.data) return found;

    const existingRecord = found.data;

    // ---------------------------------------------------
    // 2. Remove fields that are undefined or identical
    // ---------------------------------------------------
    const cleanData = Object.fromEntries(
        Object.entries(data).filter(([key, newVal]) => {
            const oldVal = existingRecord[key];

            // Skip undefined fields
            if (newVal === undefined) return false;

            // Skip fields that have the same value
            return newVal !== oldVal;
        })
    );

    // ---------------------------------------------------
    // 3. Check if there are actually no changes
    // ---------------------------------------------------
    const noChanges = Object.entries(cleanData).every(([key, newValue]) => {
        const oldValue = existingRecord[key];

        // Compare Date fields by YYYY-MM-DD (ignore time)
        if (oldValue instanceof Date) {
            const oldDate = new Date(oldValue).toISOString().slice(0, 10);
            const newDate = new Date(newValue).toISOString().slice(0, 10);
            return oldDate === newDate;
        }

        // Simple comparison for non-Date fields
        return oldValue === newValue;
    });

    if (noChanges) {
        return resTransformer<TResult>(
            false,
            201,
            `No changes detected on ${model.toString()}`,
            noChangesMessage
        );
    }

    // ---------------------------------------------------
    // 4. Validate unique constraints (e.g. email, username)
    // ---------------------------------------------------
    const uniqueConstraints = Array.isArray(unique) ? unique : [unique];

    for (const uniqueCondition of uniqueConstraints) {
        const check = await genericGetByConstrain<Tmodel, TResult>(
            model,
            uniqueCondition,
            selectQuery,
            existMessage
        );

        // If found AND it's not the same record → duplicate error
        if (check.success && check.data && check.data.id !== existingRecord.id) {
            return resTransformer<TResult>(
                false,
                400,
                `${model.toString()} ${JSON.stringify(uniqueCondition)} already exists`,
                existMessage
            );
        }
    }

    // ---------------------------------------------------
    // 5. Perform the update
    // ---------------------------------------------------
    const updatedRecord = await (prisma as any)[model].update({
        where: whereQuery,
        data: cleanData,
        select: selectQuery,
    });

    if (!updatedRecord) {
        return resTransformer<TResult>(
            false,
            400,
            `Failed to update ${model.toString()} with whereQuery ${JSON.stringify(whereQuery)}`,
            UFMessage
        );
    }

    // ---------------------------------------------------
    // 6. Return success response
    // ---------------------------------------------------
    return resTransformer<TResult>(
        true,
        200,
        `${model.toString()} updated successfully`,
        SCMessage,
        updatedRecord
    );
}

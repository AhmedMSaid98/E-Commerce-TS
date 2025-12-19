import { PrismaClient } from "../../generated/prisma/client";
import { prisma } from "../../libs/prisma";
import resTransformer from "../response/res-transformer";

export async function checkForeignKey<TResult extends Record<string, any>>(
    data: Record<string, any>,
    foreignKey: Record<string, { model: keyof PrismaClient; resMessage: string }>
) {
    const results = await Promise.all(
        Object.entries(foreignKey).map(async ([key, { model, resMessage }]) => {
            const value = data[key];
            if (!value) return null;

            const exists = (await (prisma as any)[model].findUnique({
                where: { id: value },
            })) as TResult;
            // If FK exists but is deleted
            if (exists && "isDeleted" in exists && exists.isDeleted === true) {
                return { key, resMessage: `${key} is deleted` };
            }

            // If FK does NOT exist
            if (!exists) {
                return { key, resMessage };
            }

            return null;
        })
    );

    const invalidKeys = results.filter(Boolean) as {
        key: string;
        resMessage: string;
    }[];

    if (invalidKeys.length > 0) {
        return resTransformer(
            false,
            400,
            "Foreign key validation failed",
            "One or more foreign keys are invalid",
            invalidKeys
        );
    }

    return resTransformer(true, 200, "Foreign keys valid", "All foreign keys exist", null);
}

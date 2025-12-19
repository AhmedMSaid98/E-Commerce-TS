import { PrismaClient } from "../../generated/prisma/client";
import { checkForeignKey } from "../HelperFunctions/GenericCheckForeignKey";

export async function checkFK(
    data: Record<string, any>,
    foreignKey: Record<string, { model: keyof PrismaClient; resMessage: string }>
) {
    const FK = await checkForeignKey(data, foreignKey);
    return FK;
}

import { Role } from "../../generated/prisma/enums";
import logger from "../../libs/logger";
import resTransformer from "../response/res-transformer";
import path from "path";
import fs from "fs";
import { SaveToDiskData } from "../../types/image";

export async function saveToDisk(
    role: Role,
    userId: string,
    mimetype: string,
    originalname: string,
    fileBuffer: Buffer<ArrayBufferLike>
) {
    try {
        logger.info(`Executing save to disk helper function for user id: ${userId}`);
        let finalPath: string;
        if (role === "ADMIN") {
            finalPath = path.join(process.cwd(), "uploads", `admin-${userId}`, "profileImage");
        } else if (role === "USER") {
            finalPath = path.join(process.cwd(), "uploads", `user-${userId}`, "profileImage");
        } else {
            return resTransformer<SaveToDiskData>(false, 400, `Invalid Role`, `Invalid Role`);
        }

        fs.mkdirSync(finalPath, { recursive: true });

        // unique final name
        const ext = path.extname(originalname);
        const name = path.parse(originalname).name;
        const fileName = `${name}-${userId}${ext}`;
        const fullPath = path.join(finalPath, fileName);

        // save file
        fs.writeFileSync(fullPath, fileBuffer);
        return resTransformer<SaveToDiskData>(
            true,
            200,
            `Image saved to disk successfully`,
            `Image saved to disk successfully`,
            { fullPath, fileName, mimetype }
        );
    } catch (error) {
        return resTransformer<SaveToDiskData>(
            false,
            400,
            `Something went wrong while saving to disk for user id: ${userId}`,
            `Something went wrong while saving to disk for user id: ${userId}`
        );
    }
}

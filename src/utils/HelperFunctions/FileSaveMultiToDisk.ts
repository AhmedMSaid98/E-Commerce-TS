import { Role } from "../../generated/prisma/enums";
import logger from "../../libs/logger";
import resTransformer from "../response/res-transformer";
import path from "path";
import fs from "fs";
import { SaveToDiskData } from "../../types/image";

export async function saveMultiToDisk(
    role: Role,
    userId: string,
    // originalname: string,
    // fileBuffer: Buffer<ArrayBufferLike>
    files: Express.Multer.File[]
) {
    try {
        logger.info(`Executing save to disk helper function for user id: ${userId}`);
        let finalPath: string;
        if (role === "ADMIN") {
            finalPath = path.join(process.cwd(), "uploads", `admin-${userId}`, "profileImage");
        } else if (role === "USER") {
            finalPath = path.join(process.cwd(), "uploads", `user-${userId}`, "profileImage");
        } else {
            return resTransformer<SaveToDiskData[]>(false, 400, `Invalid Role`, `Invalid Role`);
        }

        const images = files.map((file) => ({
            originalname: file.originalname,
            mimetype: file.mimetype,
            buffer: file.buffer,
        }));

        fs.mkdirSync(finalPath, { recursive: true });

        let imagesData: SaveToDiskData[] = [];
        for (const image of images) {
            // unique final name
            const ext = path.extname(image.originalname);
            const name = path.parse(image.originalname).name;
            const fileName = `${name}-${userId}${ext}`;
            const fullPath = path.join(finalPath, fileName);
            const mimetype = image.mimetype;
            // save file
            fs.writeFileSync(fullPath, image.buffer);
            imagesData.push({ fileName, fullPath, mimetype });
        }
        return resTransformer<SaveToDiskData[]>(
            true,
            200,
            `Image saved to disk successfully`,
            `Image saved to disk successfully`,
            imagesData
        );
    } catch (error) {
        return resTransformer<SaveToDiskData[]>(
            false,
            400,
            `Something went wrong while saving to disk for user id: ${userId}`,
            `Something went wrong while saving to disk for user id: ${userId}`
        );
    }
}

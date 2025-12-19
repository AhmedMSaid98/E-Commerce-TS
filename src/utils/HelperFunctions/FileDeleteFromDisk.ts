// helpers/delete-from-disk.ts
import fs from "fs";
import path from "path";
import { Role } from "../../generated/prisma/enums";
import logger from "../../libs/logger";
import resTransformer from "../response/res-transformer";

export async function deleteFromDisk(role: Role, userId: string, fileName: string) {
    try {
        let basePath: string;

        if (role === "ADMIN") {
            basePath = path.join(process.cwd(), "uploads", `admin-${userId}`, "profileImage");
        } else if (role === "USER") {
            basePath = path.join(process.cwd(), "uploads", `user-${userId}`, "profileImage");
        } else {
            return resTransformer(false, 400, "Invalid Role", "Invalid Role");
        }

        const fullPath = path.join(basePath, fileName);

        // 1️⃣ Delete file if exists
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            logger.info(`Deleted file: ${fullPath}`);
        }

        // 2️⃣ Remove profileImage folder if empty
        if (fs.existsSync(basePath) && fs.readdirSync(basePath).length === 0) {
            fs.rmdirSync(basePath);
        }

        // 3️⃣ Remove user/admin folder if empty
        const userRoot = path.dirname(basePath);
        if (fs.existsSync(userRoot) && fs.readdirSync(userRoot).length === 0) {
            fs.rmdirSync(userRoot);
        }

        return resTransformer(true, 200, "File deleted from disk", "File deleted from disk");
    } catch (error) {
        logger.error(error);
        return resTransformer(
            false,
            400,
            "Failed to delete file from disk",
            "Failed to delete file from disk"
        );
    }
}

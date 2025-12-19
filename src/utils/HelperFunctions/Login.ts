import logger from "../../libs/logger";
import { verifyPassword } from "../../libs/passwordHashing";
import { prisma } from "../../libs/prisma";
import { userSelect } from "../../modules/User/user.validation";
import { UserModel } from "../../types/models";
import { generateToken } from "../generateToken";
import resTransformer from "../response/res-transformer";
import { genericUpdateService } from "./GenericUpdateService";

export async function login(email: string, password: string) {
    try {
        logger.info("🆗 Executing login function.");
        const userVerify = await prisma.user.findUnique({ where: { email } });
        if (!userVerify) {
            return resTransformer<UserModel>(false, 400, "Email is invalid", "Email or password is invalid");
        }

        if (userVerify.isDeleted) {
            return resTransformer<UserModel>(
                false,
                400,
                "This user is deleted contact support for help.",
                "This user is deleted contact support for help."
            );
        }

        const verifiedPassword = await verifyPassword(password, userVerify.password);
        if (!verifiedPassword) {
            return resTransformer<UserModel>(
                false,
                400,
                "Password is invalid",
                "Email or password is invalid"
            );
        }

        const token = await generateToken(
            userVerify.id,
            userVerify.email,
            userVerify.role,
            userVerify.isDeleted
        );
        const updateUserToken = await genericUpdateService<"user", UserModel>(
            "user",
            { token: token },
            { email: email },
            { email: email },
            userSelect,
            `User with id: ${userVerify.id} not found`,
            `No changes occured on user with id: ${userVerify.id}`,
            `Email already exists`,
            `Something went wrong while updating token for user with id: ${userVerify.id}`,
            `User with id: ${userVerify.id} updated token successfully`
        );
        if (!updateUserToken.success) {
            return updateUserToken;
        }

        return resTransformer<UserModel>(
            true,
            200,
            "User logged in succefully",
            "User logged in succefully",
            updateUserToken.data
        );
    } catch (error) {
        logger.error("❌ Something went wrong while executing login function: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

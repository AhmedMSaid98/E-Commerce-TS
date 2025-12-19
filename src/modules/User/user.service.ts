import { Prisma } from "../../generated/prisma/client";
import logger from "../../libs/logger";
import { hashPassword } from "../../libs/passwordHashing";
import { AuthJwtPayload } from "../../types/auth";
import { UserModel } from "../../types/models";
import { generateToken } from "../../utils/generateToken";
import { genericCreateService } from "../../utils/HelperFunctions/GenericCreateService";
import { genericDeleteService } from "../../utils/HelperFunctions/GenericDeleteService";
import { genericGetAllService } from "../../utils/HelperFunctions/GenericGetAllService";
import { genericGetByConstrain } from "../../utils/HelperFunctions/GenericGetByConstrain";
import { genericSoftDeleteService } from "../../utils/HelperFunctions/GenericSoftDeleteService";
import { genericUpdateService } from "../../utils/HelperFunctions/GenericUpdateService";
import { login } from "../../utils/HelperFunctions/Login";
import resTransformer from "../../utils/response/res-transformer";
import {
    IUserCreate,
    IUserDelete,
    IUserGetUserById,
    IUserGetUsers,
    IUserLogin,
    IUserRestore,
    IUserUpdate,
    IUserUpdateAdmin,
    userSelect,
} from "./user.validation";

async function createUser(data: IUserCreate) {
    try {
        logger.info("🆗 Executing create user service..");
        const hashedPassword = await hashPassword(data.password);

        const userExists = await genericGetByConstrain<"user", UserModel>(
            "user",
            { email: data.email },
            userSelect,
            `User not found`,
            `Email already exists`
        );
        if (userExists.success) {
            return userExists;
        }
        let createUser = await genericCreateService<"user", UserModel>(
            "user",
            { ...data, password: hashedPassword },
            userSelect,
            `Something went wrong while creating user`,
            `User created succefully`
        );
        if (createUser.data) {
            const token = await generateToken(
                createUser.data.id,
                createUser.data.email,
                createUser.data.role,
                createUser.data.isDeleted
            );
            const updatetoken = await genericUpdateService<"user", UserModel>(
                "user",
                { token: token },
                { id: createUser.data.id },
                { email: createUser.data.email },
                userSelect,
                `User not found with id: ${createUser.data.id}`,
                `No changes occured on user id: ${createUser.data.id}`,
                `Unique constrain already exists`,
                `Something went wrong while updating user id: ${createUser.data.id}`,
                `User with id: ${createUser.data.id} updated succefully`
            );
            createUser.data.token = token;
        }
        return createUser;
    } catch (error) {
        logger.error("❌ Something went wrong while executing create user service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function getUserByIdAdmin(data: IUserGetUserById) {
    try {
        logger.info("🆗 Executing get user by id service..");
        const user = await genericGetByConstrain<"user", UserModel>(
            "user",
            data,
            userSelect,
            `User with id: ${data.id} not found`,
            `User with id: ${data.id} found succefully`
        );
        if (user.data?.isDeleted) {
            return resTransformer(
                true,
                200,
                `User with id: ${data.id} is deleted`,
                `User with id: ${data.id} is deleted`,
                user
            );
        }
        return user;
    } catch (error) {
        logger.error("❌ Something went wrong while executing get user by id service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function getAllUsers(data: IUserGetUsers) {
    try {
        logger.info("🆗 Executing get all users service..");
        const userList = await genericGetAllService<"user", UserModel>(
            "user",
            {
                firstName: { contains: data.firstName },
                lastName: { contains: data.lastName },
                email: { contains: data.email },
                role: { contains: data.role },
                isVerified: { contains: data.isVerified },
                isDeleted: data.isDeleted,
            },
            userSelect,
            "Users not found",
            "Users list found succefully",
            data.limit,
            data.page
        );
        return userList;
    } catch (error) {
        logger.error("❌ Something went wrong while executing get all users service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function updateUserAdmin(data: IUserUpdateAdmin) {
    try {
        logger.info("🆗 Executing update user admin service..");
        const updateUserAdmin = await genericUpdateService<"user", UserModel>(
            "user",
            data,
            { id: data.id },
            { email: data.email },
            userSelect,
            `User with id: ${data.id} not found`,
            `No changes occured on user id: ${data.id}`,
            `Unique constrain already exists ${data}`,
            "Something went wrong while updating user",
            "User updated succefully"
        );
        return updateUserAdmin;
    } catch (error) {
        logger.error("❌ Something went wrong while executing update user admin service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function updateUser(data: IUserUpdate, authUser: AuthJwtPayload) {
    try {
        logger.info("🆗 Executing update user service..");
        const updateUser = await genericUpdateService<"user", UserModel>(
            "user",
            data,
            { id: authUser.userId },
            { email: data.email },
            userSelect,
            `User with id: ${authUser.userId} not found`,
            `No changes occured on user with id: ${authUser.userId}`,
            `Unique constrain already exists: ${data.email}`,
            `Something went wrong while updating user with id: ${authUser.userId}`,
            `User with id: ${authUser.userId} updated succefully`
        );
        return updateUser;
    } catch (error) {
        logger.error("❌ Something went wrong while executing update user service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function deleteUser(data: IUserDelete) {
    try {
        logger.info("🆗 Executing delete user service..");
        const deleteUser = await genericDeleteService<"user", UserModel>(
            "user",
            { id: data },
            userSelect,
            `User with id: ${data} not found`,
            `Something went wrong while deleting user with id: ${data}`,
            `User with id: ${data} deleted permanently succefully`
        );
        return deleteUser;
    } catch (error) {
        logger.error("❌ Something went wrong while executing delete user service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function softDeleteUser(authUser: AuthJwtPayload) {
    try {
        logger.info("🆗 Executing soft delete user service..");
        const softDeleteUser = await genericSoftDeleteService<"user", UserModel>(
            "user",
            { id: authUser.userId },
            { id: authUser.userId },
            userSelect,
            `User with id: ${authUser.userId} not found`,
            `No changes occured on user with id: ${authUser.userId}`,
            `Something went wrong while deleting user with id: ${authUser.userId}`,
            `User with id: ${authUser.userId} already exists`,
            `User with id: ${authUser.userId} deleted succefully`
        );
        return softDeleteUser;
    } catch (error) {
        logger.error("❌ Something went wrong while executing soft delete user service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function loginUser(data: IUserLogin) {
    try {
        logger.info("🆗 Executing login user service..");
        const loginUser = await login(data.email, data.password);
        return loginUser;
    } catch (error) {
        logger.error("❌ Something went wrong while executing login user service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function getUserProfile(authUser: AuthJwtPayload) {
    try {
        logger.info("🆗 Executing get user profile service..");
        const user = await genericGetByConstrain<"user", UserModel>(
            "user",
            { id: authUser.userId },
            userSelect,
            `User with id: ${authUser.userId} not found`,
            `User with id: ${authUser.userId} found succefully`
        );
        return user;
    } catch (error) {
        logger.error("❌ Something went wrong while executing get user profile service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function restoreUser(data: IUserRestore) {
    try {
        logger.info("🆗 Executing restore user service..");
        const restoreUser = await genericUpdateService<"user", UserModel>(
            "user",
            { isDeleted: false },
            data,
            data,
            userSelect,
            `User not found with id: ${data.id}`,
            `No changes occured on user id: ${data.id}`,
            `Unique constrain exists: ${data}`,
            `Something went wrong while restoring user id: ${data.id}`,
            `User with id: ${data.id} restored succefully`
        );
        return restoreUser;
    } catch (error) {
        logger.error("❌ Something went wrong while executing restore user service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

export const userService = {
    createUser,
    getUserByIdAdmin,
    getAllUsers,
    updateUserAdmin,
    updateUser,
    deleteUser,
    softDeleteUser,
    loginUser,
    getUserProfile,
    restoreUser,
};

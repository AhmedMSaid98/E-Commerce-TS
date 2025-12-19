import { Request, Response } from "express";
import logger from "../../libs/logger";
import {
    createUserSchema,
    deleteUserSchema,
    getUserByIdAdminSchema,
    getUsersSchema,
    IUserCreate,
    IUserDelete,
    IUserGetUserById,
    IUserGetUsers,
    IUserLogin,
    IUserRestore,
    IUserUpdate,
    IUserUpdateAdmin,
    loginUserSchema,
    restoreUserSchema,
    updateUserAdminSchema,
    updateUserSchema,
} from "./user.validation";
import { ZodError } from "zod";
import { userService } from "./user.service";
import { AuthJwtPayload } from "../../types/auth";

async function getUserByIdAdmin(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing get user by id controller..");
        const request = req.query as IUserGetUserById;
        const { success, data, error } = await getUserByIdAdminSchema.safeParse(request);
        if (!success) {
            return res.status(400).json({
                success: false,
                message: JSON.parse(error.message).map((error: ZodError) => error.message),
            });
        }

        const user = await userService.getUserByIdAdmin(data);
        return res.status(user.statusCode).json({
            success: user.success,
            message: user.message,
            data: user.data,
        });
    } catch (error) {
        logger.error("❌ Something went wrong while executing get user by id controller: ", error);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

async function getAllUsers(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing get all users controller..");
        const request = req.query as IUserGetUsers;
        const { success, data, error } = await getUsersSchema.safeParse(request);
        if (!success) {
            return res.status(400).json({
                success: false,
                message: JSON.parse(error.message).map((error: ZodError) => error.message),
            });
        }

        const userList = await userService.getAllUsers(data);
        return res.status(userList.statusCode).json({
            success: userList.success,
            message: userList.message,
            data: userList.data,
        });
    } catch (error) {
        logger.error("❌ Something went wrong while executing get all users controller: ", error);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

async function updateUserAdmin(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing update user admin controller..");
        const request = req.body as IUserUpdateAdmin;
        const { success, data, error } = await updateUserAdminSchema.safeParse(request);
        if (!success) {
            return res.status(400).json({
                success: false,
                message: JSON.parse(error.message).map((error: ZodError) => error.message),
            });
        }

        const updateUserAdmin = await userService.updateUserAdmin(data);
        return res.status(updateUserAdmin.statusCode).json({
            success: updateUserAdmin.success,
            message: updateUserAdmin.message,
            data: updateUserAdmin.data,
        });
    } catch (error) {
        logger.error("❌ Something went wrong while executing update user admin controller: ", error);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

async function deleteUser(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing delete user controller..");
        const request = req.query as IUserDelete;
        const { success, data, error } = await deleteUserSchema.safeParse(request);
        if (!success) {
            return res.status(400).json({
                success: false,
                message: JSON.parse(error.message).map((error: ZodError) => error.message),
            });
        }

        const deleteUser = await userService.deleteUser(data);
        return res.status(deleteUser.statusCode).json({
            success: deleteUser.success,
            message: deleteUser.message,
            data: deleteUser.data,
        });
    } catch (error) {
        logger.error("❌ Something went wrong while executing delete user controller: ", error);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

async function createUser(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing create user controller..");
        const request = req.body as IUserCreate;
        const { success, data, error } = await createUserSchema.safeParse(request);
        if (!success) {
            return res.status(400).json({
                success: false,
                message: JSON.parse(error.message).map((error: ZodError) => error.message),
            });
        }

        const createUser = await userService.createUser(data);
        return res.status(createUser.statusCode).json({
            success: createUser.success,
            message: createUser.message,
            data: createUser.data,
        });
    } catch (error) {
        logger.error("❌ Something went wrong while executing create user controller: ", error);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

async function updateUser(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing update user controller..");
        const userId = req.user as AuthJwtPayload;
        const request = req.body as IUserUpdate;
        const { success, data, error } = await updateUserSchema.safeParse(request);
        if (!success) {
            return res.status(400).json({
                success: false,
                message: JSON.parse(error.message).map((error: ZodError) => error.message),
            });
        }

        const updateUser = await userService.updateUser(data, userId);
        return res.status(updateUser.statusCode).json({
            success: updateUser.success,
            message: updateUser.message,
            data: updateUser.data,
        });
    } catch (error) {
        logger.error("❌ Something went wrong while executing update user controller: ", error);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

async function softDeleteUser(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing soft delete user controller..");
        const request = req.user as AuthJwtPayload;

        const softDeleteUser = await userService.softDeleteUser(request);
        return res.status(softDeleteUser.statusCode).json({
            success: softDeleteUser.success,
            message: softDeleteUser.message,
            data: softDeleteUser.data,
        });
    } catch (error) {
        logger.error("❌ Something went wrong while executing soft delete user controller: ", error);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

async function loginUser(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing login user controller..");
        const request = req.body as IUserLogin;
        const { success, data, error } = await loginUserSchema.safeParse(request);
        if (!success) {
            return res.status(400).json({
                success: false,
                message: JSON.parse(error.message).map((error: ZodError) => error.message),
            });
        }

        const login = await userService.loginUser(data);
        return res.status(login.statusCode).json({
            success: login.success,
            message: login.message,
            data: login.data,
        });
    } catch (error) {
        logger.error("❌ Something went wrong while executing login user controller: ", error);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

async function getUserProfile(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing get user profile controller..");
        const request = req.user as AuthJwtPayload;
        const user = await userService.getUserProfile(request);
        return res.status(user.statusCode).json({
            success: user.success,
            message: user.message,
            data: user.data,
        });
    } catch (error) {
        logger.error("❌ Something went wrong while executing get user profile controller: ", error);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

async function restoreUser(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing restore user controller..");
        const request = req.query as IUserRestore;
        const { success, data, error } = await restoreUserSchema.safeParse(request);
        if (!success) {
            return res.status(400).json({
                success: false,
                message: JSON.parse(error.message).map((error: ZodError) => error.message),
            });
        }

        const restoreUser = await userService.restoreUser(data);
        return res.status(restoreUser.statusCode).json({
            success: restoreUser.success,
            message: restoreUser.message,
            data: restoreUser.data,
        });
    } catch (error) {
        logger.error("❌ Something went wrong while executing restore user controller: ", error);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

export const userController = {
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

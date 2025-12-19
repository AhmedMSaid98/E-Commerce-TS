import { Request, Response } from "express";
import logger from "../../libs/logger";
import {
    createAddressSchema,
    deleteAddressAdminSchema,
    getAddressByUserIdAdminSchema,
    getAllAddressesAdminSchema,
    IAddressCreate,
    IAddressDeleteAdmin,
    IAddressGetAllAdmin,
    IAddressGetByUserIDAdmin,
    IAddressRestoreUser,
    IAddressUpdateAdmin,
    restorAddressSchema,
    updateAddressAdminSchema,
    updateAddressUserSchema,
} from "./address.validation";
import z, { ZodError } from "zod";
import { addressService } from "./address.service";
import { AuthJwtPayload } from "../../types/auth";
import { checkForeignKey } from "../../utils/HelperFunctions/GenericCheckForeignKey";

async function createAddress(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing create address controller..");
        const request = req.body as IAddressCreate;
        const { success, data, error } = await createAddressSchema.safeParse(request);
        if (!success) {
            return res.status(400).json({
                success: false,
                message: z.flattenError(error).fieldErrors,
            });
        }

        const fk = { userId: data.userId };
        const checkFK = await checkForeignKey(fk, {
            userId: { model: "user", resMessage: "User not found" },
        });
        if (!checkFK.success) {
            return res.status(checkFK.statusCode).json({
                success: false,
                message: checkFK.message,
                data: checkFK.data,
            });
        }

        const createAddress = await addressService.createAddress(data);
        return res.status(createAddress.statusCode).json({
            success: createAddress.success,
            message: createAddress.message,
            data: createAddress.data,
        });
    } catch (error) {
        logger.error("❌ Something went wrong while executing create address controller: ", error);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

async function getAddressByUserIdAdmin(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing get address by user ID controller..");
        const request = req.query as IAddressGetByUserIDAdmin;
        const { success, data, error } = await getAddressByUserIdAdminSchema.safeParse(request);
        if (!success) {
            return res.status(400).json({
                success: false,
                message: JSON.parse(error.message).map((error: ZodError) => error.message),
            });
        }

        const address = await addressService.getAddressByUserIdAdmin(data);
        return res.status(address.statusCode).json({
            success: address.success,
            message: address.message,
            data: address.data,
        });
    } catch (error) {
        logger.error("❌ Something went wrong while executing get address by user ID controller: ", error);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

async function getAllAddressesAdmin(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing get all addresses controller..");
        const request = req.query as IAddressGetAllAdmin;
        const { success, data, error } = await getAllAddressesAdminSchema.safeParse(request);
        if (!success) {
            return res.status(400).json({
                success: false,
                message: JSON.parse(error.message).map((error: ZodError) => error.message),
            });
        }

        const addressList = await addressService.getAllAddressesAdmin(data);
        return res.status(addressList.statusCode).json(addressList);
    } catch (error) {
        logger.error("❌ Something went wrong while executing get all addresses controller: ", error);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

async function updateAddressAdmin(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing update address controller..");
        const request = req.query as IAddressUpdateAdmin;
        const { success, data, error } = await updateAddressAdminSchema.safeParse(request);
        if (!success) {
            return res.status(400).json({
                success: false,
                message: JSON.parse(error.message).map((error: ZodError) => error.message),
            });
        }

        const fk = { userId: data.userId };
        const checkFK = await checkForeignKey(fk, {
            userId: { model: "user", resMessage: `User not found with id: ${fk.userId}` },
        });
        if (!checkFK.success) {
            return res.status(checkFK.statusCode).json({
                success: false,
                message: checkFK.message,
                data: checkFK.data,
            });
        }

        const addressUpdate = await addressService.updateAddressAdmin(data);
        return res.status(addressUpdate.statusCode).json(addressUpdate);
    } catch (error) {
        logger.error("❌ Something went wrong while executing update address controller: ", error);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

async function deleteAddressAdmin(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing delete address controller..");
        const request = req.query as IAddressDeleteAdmin;
        const { success, data, error } = await deleteAddressAdminSchema.safeParse(request);
        if (!success) {
            return res.status(400).json({
                success: false,
                message: JSON.parse(error.message).map((error: ZodError) => error.message),
            });
        }

        const fk = { userId: data.userId };
        const checkFK = await checkForeignKey(fk, {
            userId: { model: "user", resMessage: `User not found with id: ${fk.userId}` },
        });
        if (!checkFK.success) {
            return res.status(checkFK.statusCode).json({
                success: false,
                message: checkFK.message,
                data: checkFK.data,
            });
        }

        const addressDelete = await addressService.deleteAddressAdmin(data);
        return res.status(addressDelete.statusCode).json({
            success: addressDelete.success,
            message: addressDelete.message,
            data: addressDelete.data,
        });
    } catch (error) {
        logger.error("❌ Something went wrong while executing delete address controller: ", error);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

async function getAddressUser(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing get address by user id controller..");
        const userAuth = req.user as AuthJwtPayload;
        const user = await addressService.getAddressUser(userAuth);
        return res.status(user.statusCode).json({
            success: user.success,
            message: user.message,
            data: user.data,
        });
    } catch (error) {
        logger.error("❌ Something went wrong while executing get address by user id controller: ", error);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

async function updateAddressUser(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing update address by user id controller..");
        const userAuth = req.user as AuthJwtPayload;
        const request = req.body as IAddressUpdateAdmin;
        const { success, data, error } = await updateAddressUserSchema.safeParse(request);
        if (!success) {
            return res.status(400).json({
                success: false,
                message: JSON.parse(error.message).map((error: ZodError) => error.message),
            });
        }

        const fk = { userId: userAuth.userId };
        const checkFK = await checkForeignKey(fk, {
            userId: { model: "user", resMessage: `User not found with id: ${fk.userId}` },
        });
        if (!checkFK.success) {
            return res.status(checkFK.statusCode).json({
                success: false,
                message: checkFK.message,
                data: checkFK.data,
            });
        }
        const updateAddress = await addressService.updateAddressUser(userAuth, data);
        return res.status(updateAddress.statusCode).json({
            success: updateAddress.success,
            message: updateAddress.message,
            data: updateAddress.data,
        });
    } catch (error) {
        logger.error("❌ Something went wrong while executing update address by user id controller: ", error);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

async function softDelteAddressUser(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing soft delete address by user id controller..");
        const userAuth = req.user as AuthJwtPayload;

        const fk = { userId: userAuth.userId };
        const checkFK = await checkForeignKey(fk, {
            userId: { model: "user", resMessage: `User not found with id: ${fk.userId}` },
        });
        if (!checkFK.success) {
            return res.status(checkFK.statusCode).json({
                success: false,
                message: checkFK.message,
                data: checkFK.data,
            });
        }

        const softDelete = await addressService.softDeleteAddressUser(userAuth);
        return res.status(softDelete.statusCode).json({
            success: softDelete.success,
            message: softDelete.message,
            data: softDelete.data,
        });
    } catch (error) {
        logger.error(
            "❌ Something went wrong while executing soft delete address by user id controller: ",
            error
        );
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

async function restoreAddressUser(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing restore address by user id controller..");
        const request = req.query as IAddressRestoreUser;
        const { success, data, error } = await restorAddressSchema.safeParse(request);
        if (!success) {
            return res.status(400).json({
                success: false,
                message: JSON.parse(error.message).map((error: ZodError) => error.message),
            });
        }

        const fk = { userId: data.userId };
        const checkFK = await checkForeignKey(fk, {
            userId: { model: "user", resMessage: `User not found with id: ${fk.userId}` },
        });
        if (!checkFK.success) {
            return res.status(checkFK.statusCode).json({
                success: false,
                message: checkFK.message,
                data: checkFK.data,
            });
        }

        const retoreAddress = await addressService.restoreAddressUser(data);
        return res.status(retoreAddress.statusCode).json({
            success: retoreAddress.success,
            message: retoreAddress.message,
            data: retoreAddress.data,
        });
    } catch (error) {
        logger.error(
            "❌ Something went wrong while executing restore address by user id controller: ",
            error
        );
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

export const addressController = {
    createAddress,
    getAddressByUserIdAdmin,
    getAllAddressesAdmin,
    updateAddressAdmin,
    deleteAddressAdmin,
    getAddressUser,
    updateAddressUser,
    softDelteAddressUser,
    restoreAddressUser,
};

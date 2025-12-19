import logger from "../../libs/logger";
import { Request, Response } from "express";
import { AuthJwtPayload } from "../../types/auth";
import { imageService } from "./image.service";
import z from "zod";
import { getProductIdSchema, getProductImageIdSchema } from "./image.validation";

async function uploadUserImage(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing upload user image controller..");
        const user = req.user as AuthJwtPayload;
        const image = req.file as Express.Multer.File;
        const uploadImage = await imageService.uploadUserImage(user, image);
        return res.status(uploadImage.statusCode).json({
            success: uploadImage.success,
            message: uploadImage.message,
            data: uploadImage.data,
        });
    } catch (error) {
        logger.error("❌ Something went wrong while executing upload user image controller: ", error);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

async function getUserImage(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing get user image controller..");
        const user = req.user as AuthJwtPayload;
        const image = await imageService.getUserImage(user);
        return res.status(image.statusCode).json({
            success: image.success,
            message: image.message,
            data: image.data,
        });
    } catch (error) {
        logger.error("❌ Something went wrong while executing get user image controller: ", error);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

async function updateUserImage(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing update user image controller..");
        const user = req.user as AuthJwtPayload;
        const image = req.file as Express.Multer.File;
        const updateImage = await imageService.updateUserImage(user, image);
        return res.status(updateImage.statusCode).json({
            success: updateImage.success,
            message: updateImage.message,
            data: updateImage.data,
        });
    } catch (error) {
        logger.error("❌ Something went wrong while executing update user image controller: ", error);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

async function deleteUserImage(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing delete user image controller..");
        const user = req.user as AuthJwtPayload;
        const deleteImage = await imageService.deleteUserImage(user);
        return res.status(deleteImage.statusCode).json({
            success: deleteImage.success,
            message: deleteImage.message,
            data: deleteImage.data,
        });
    } catch (error) {
        logger.error("❌ Something went wrong while executing delete user image controller: ", error);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

async function uploadProductImages(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing upload product image controller..");
        const user = req.user as AuthJwtPayload;
        const images = req.files as Express.Multer.File[];
        const { success, data, error } = getProductIdSchema.safeParse({
            productId: req.query.productId,
        });
        if (!success) {
            return res.status(400).json({
                success: false,
                message: z.flattenError(error).fieldErrors,
            });
        }
        const createImage = await imageService.uploadProductImages(user, images, data.productId);
        return res.status(createImage.statusCode).json({
            success: createImage.success,
            message: createImage.message,
            data: createImage.data,
        });
    } catch (error) {
        logger.error("❌ Something went wrong while executing upload product image controller: ", error);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

async function getProductImages(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing upload product image controller..");
        const user = req.user as AuthJwtPayload;
        const { success, data, error } = getProductIdSchema.safeParse({
            productId: req.query.productId,
        });
        if (!success) {
            return res.status(400).json({
                success: false,
                message: z.flattenError(error).fieldErrors,
            });
        }
        const imageList = await imageService.getProductImages(user, data.productId);
        return res.status(imageList.statusCode).json({
            success: imageList.success,
            message: imageList.message,
            data: imageList.data,
        });
    } catch (error) {
        logger.error("❌ Something went wrong while executing upload product image controller: ", error);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

async function deleteProductImages(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing delete product images controller..");
        const user = req.user as AuthJwtPayload;
        const { success, data, error } = getProductIdSchema.safeParse({
            productId: req.query.productId,
        });
        if (!success) {
            return res.status(400).json({
                success: false,
                message: z.flattenError(error).fieldErrors,
            });
        }
        const deleteImages = await imageService.deleteProductImages(user, data.productId);
        return res.status(deleteImages.statusCode).json({
            success: deleteImages.success,
            message: deleteImages.message,
            data: deleteImages.data,
        });
    } catch (error) {
        logger.error("❌ Something went wrong while executing delete product images controller: ", error);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

async function deleteProductImage(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing delete product images controller..");
        const user = req.user as AuthJwtPayload;
        const { success, data, error } = getProductImageIdSchema.safeParse({
            productImageId: req.query.productImageId,
        });
        if (!success) {
            return res.status(400).json({
                success: false,
                message: z.flattenError(error).fieldErrors,
            });
        }
        const deleteImage = await imageService.deleteProductImage(user, data.productImageId);
        return res.status(deleteImage.statusCode).json({
            success: deleteImage.success,
            message: deleteImage.message,
            data: deleteImage.data,
        });
    } catch (error) {
        logger.error("❌ Something went wrong while executing delete product images controller: ", error);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

export const imageController = {
    uploadUserImage,
    getUserImage,
    updateUserImage,
    deleteUserImage,
    uploadProductImages,
    getProductImages,
    deleteProductImages,
    deleteProductImage,
};

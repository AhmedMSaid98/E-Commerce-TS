import logger from "../../libs/logger";
import { Request, Response } from "express";
import {
    createManyPurchasedProductSchema,
    createPurchasedProductSchema,
    getPurchasedProductByUserIdSchema,
    getPurchasedProductByIdSchema,
    getAllPurchasedProductSchema,
    paginationPurchasedProductSchema,
    updatePurchasedProductStatusSchema,
    updateOrderIdPurchasedProductSchema,
} from "./purchasedProduct.validation";
import z from "zod";
import { purchasedProductService } from "./purchasedProduct.service";

async function createPurchasedProduct(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing create purchased product controller..");
        const { success, data, error } = await createPurchasedProductSchema.safeParse(req.body);
        if (!success) {
            return res.status(400).json({
                success: false,
                message: z.flattenError(error).fieldErrors,
            });
        }

        const purchasedProduct = await purchasedProductService.createPurchasedProduct(data);
        return res.status(purchasedProduct.statusCode).json({
            success: purchasedProduct.success,
            message: purchasedProduct.message,
            data: purchasedProduct.data,
        });
    } catch (error) {
        logger.error("❌ Something went wrong while executing create purchased product controller: ", error);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

async function createManyPurchasedProduct(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing create many purchased products controller..");
        const { success, data, error } = await createManyPurchasedProductSchema.safeParse(req.body);
        if (!success) {
            return res.status(400).json({
                success: false,
                message: z.flattenError(error).fieldErrors,
            });
        }

        const purchasedProduct = await purchasedProductService.createManyPurchasedProduct(data);
        return res.status(purchasedProduct.statusCode).json({
            success: purchasedProduct.success,
            message: purchasedProduct.message,
            data: purchasedProduct.data,
        });
    } catch (error) {
        logger.error(
            "❌ Something went wrong while executing create many purchased products controller: ",
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

async function getAllPurchasedProductByUserId(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing get all purchased product by user ID controller..");
        const userIdResult = await getPurchasedProductByUserIdSchema.safeParse(req.query);
        if (!userIdResult.success) {
            return res.status(400).json({
                success: false,
                message: z.flattenError(userIdResult.error).fieldErrors,
            });
        }

        const paginationResult = await paginationPurchasedProductSchema.safeParse(req.query);
        if (!paginationResult.success) {
            return res.status(400).json({
                success: false,
                message: z.flattenError(paginationResult.error).fieldErrors,
            });
        }

        const purchasedProduct = await purchasedProductService.getAllPurchasedProductByUserId(
            userIdResult.data,
            paginationResult.data
        );
        return res.status(purchasedProduct.statusCode).json({
            success: purchasedProduct.success,
            message: purchasedProduct.message,
            data: purchasedProduct.data,
        });
    } catch (error) {
        logger.error(
            "❌ Something went wrong while executing get all purchased product by user ID controller: ",
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

async function getPurchasedProductById(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing get purchased product by id controller..");
        const { success, data, error } = await getPurchasedProductByIdSchema.safeParse(req.query);
        if (!success) {
            return res.status(400).json({
                success: false,
                message: z.flattenError(error).fieldErrors,
            });
        }

        const purchasedProduct = await purchasedProductService.getPurchasedProductById(data);
        return res.status(purchasedProduct.statusCode).json({
            success: purchasedProduct.success,
            message: purchasedProduct.message,
            data: purchasedProduct.data,
        });
    } catch (error) {
        logger.error(
            "❌ Something went wrong while executing get purchased product by id controller: ",
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

async function getAllPurchasedProduct(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing get all purchased products controller..");
        const getResult = await getAllPurchasedProductSchema.safeParse(req.query);
        const paginationResult = await paginationPurchasedProductSchema.safeParse(req.query);
        if (!getResult.success || !paginationResult.success) {
            return res.status(400).json({
                success: false,
                message: {
                    ...(getResult.success ? {} : getResult.error.flatten().fieldErrors),
                    ...(paginationResult.success ? {} : paginationResult.error.flatten().fieldErrors),
                },
            });
        }

        const purchasedProductList = await purchasedProductService.getAllPurchasedProduct(
            getResult.data,
            paginationResult.data
        );
        return res.status(purchasedProductList.statusCode).json({
            success: purchasedProductList.success,
            message: purchasedProductList.message,
            data: purchasedProductList.data,
        });
    } catch (error) {
        logger.error(
            "❌ Something went wrong while executing get all purchased products controller: ",
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

async function updateOrderIdPurchasedProduct(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing update order Id purchased product controller..");
        const orderResult = await updateOrderIdPurchasedProductSchema.safeParse(req.body);
        const userResult = await getPurchasedProductByUserIdSchema.safeParse(req.query);
        if (!orderResult.success || !userResult.success) {
            return res.status(400).json({
                success: false,
                message: {
                    ...(orderResult.success ? {} : orderResult.error.flatten().fieldErrors),
                    ...(userResult.success ? {} : userResult.error.flatten().fieldErrors),
                },
            });
        }

        const updateResult = await purchasedProductService.updateOrderIdPurchasedProduct(
            orderResult.data,
            userResult.data
        );
        return res.status(updateResult.statusCode).json({
            success: updateResult.success,
            message: updateResult.message,
            data: updateResult.data,
        });
    } catch (error) {
        logger.error(
            "❌ Something went wrong while executing update order Id purchased product controller: ",
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

async function updatePurchasedProductStatus(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing update purchased product status controller..");
        const userResult = await getPurchasedProductByUserIdSchema.safeParse(req.query);
        const statusResult = await updatePurchasedProductStatusSchema.safeParse(req.query);
        if (!userResult.success || !statusResult.success) {
            return res.status(400).json({
                success: false,
                message: {
                    ...(userResult.success ? {} : userResult.error.flatten().fieldErrors),
                    ...(statusResult.success ? {} : statusResult.error.flatten().fieldErrors),
                },
            });
        }
        const updatePurchasedProduct = await purchasedProductService.updatePurchasedProductStatus(
            userResult.data,
            statusResult.data
        );
        return res.status(updatePurchasedProduct.statusCode).json({
            success: updatePurchasedProduct.success,
            message: updatePurchasedProduct.message,
            data: updatePurchasedProduct.data,
        });
    } catch (error) {
        logger.error(
            "❌ Something went wrong while executing update purchased product status controller: ",
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

async function deletePurchasedProduct(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing delete purchased product controller..");
        const { success, data, error } = await getPurchasedProductByIdSchema.safeParse(req.query);
        if (!success) {
            return res.status(400).json({
                success: false,
                message: z.flattenError(error).fieldErrors,
            });
        }

        const deleted = await purchasedProductService.deletePurchasedProduct(data);
        return res.status(deleted.statusCode).json({
            success: deleted.success,
            message: deleted.message,
            data: deleted.data,
        });
    } catch (error) {
        logger.error("❌ Something went wrong while executing delete purchased product controller: ", error);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

async function softDeletePurchasedProduct(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing soft delete purchased product controller..");
        const { success, data, error } = await getPurchasedProductByIdSchema.safeParse(req.query);
        if (!success) {
            return res.status(400).json({
                success: false,
                message: z.flattenError(error).fieldErrors,
            });
        }

        const softDelete = await purchasedProductService.softDeletePurchasedProduct(data);
        return res.status(softDelete.statusCode).json({
            success: softDelete.success,
            message: softDelete.message,
            data: softDelete.data,
        });
    } catch (error) {
        logger.error(
            "❌ Something went wrong while executing soft delete purchased product controller: ",
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

async function restorePurchasedProduct(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing restore purchased product controller..");
        const { success, data, error } = await getPurchasedProductByIdSchema.safeParse(req.query);
        if (!success) {
            return res.status(400).json({
                success: false,
                message: z.flattenError(error).fieldErrors,
            });
        }

        const restored = await purchasedProductService.restorePurchasedProduct(data);
        return res.status(restored.statusCode).json({
            success: restored.success,
            message: restored.message,
            data: restored.data,
        });
    } catch (error) {
        logger.error("❌ Something went wrong while executing restore purchased product controller: ", error);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

export const purchasedProductController = {
    createPurchasedProduct,
    createManyPurchasedProduct,
    getAllPurchasedProductByUserId,
    getPurchasedProductById,
    getAllPurchasedProduct,
    updateOrderIdPurchasedProduct,
    updatePurchasedProductStatus,
    deletePurchasedProduct,
    softDeletePurchasedProduct,
    restorePurchasedProduct,
};

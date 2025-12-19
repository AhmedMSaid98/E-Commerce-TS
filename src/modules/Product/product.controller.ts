import logger from "../../libs/logger";
import { Request, Response } from "express";
import {
    changeProductStockSchema,
    createProductSchema,
    getAllProductSchema,
    getProductIdSchema,
    IProductChangeStock,
    IProductCreate,
    IProductGetAll,
    IProductGetId,
    IProductUpdate,
    updateProductSchema,
} from "./product.validation";
import z from "zod";
import { productService } from "./product.service";

async function createProduct(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing create product controller..");

        const request = req.body as IProductCreate;
        const { success, data, error } = await createProductSchema.safeParse(request);
        if (!success) {
            return res.status(400).json({
                success: false,
                message: z.flattenError(error).fieldErrors,
            });
        }

        const product = await productService.createProduct(data);
        return res.status(product.statusCode).json({
            success: product.success,
            message: product.message,
            data: product.data,
        });
    } catch (error) {
        logger.error("❌ Something went wrong while executing create product controller: ", error);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

async function getProductById(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing get product by id controller..");
        const request = req.query as IProductGetId;
        const { success, data, error } = await getProductIdSchema.safeParse(request);
        if (!success) {
            return res.status(400).json({
                success: false,
                message: z.flattenError(error).fieldErrors,
            });
        }

        const product = await productService.getProductById(data);
        return res.status(product.statusCode).json({
            success: product.success,
            message: product.message,
            data: product.data,
        });
    } catch (error) {
        logger.error("❌ Something went wrong while executing get product by id controller: ", error);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

async function getAllProducts(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing get all product controller..");
        const request = req.query as IProductGetAll;
        const { success, data, error } = await getAllProductSchema.safeParse(request);
        if (!success) {
            return res.status(400).json({
                success: false,
                message: z.flattenError(error).fieldErrors,
            });
        }

        const product = await productService.getAllProducts(data);
        return res.status(product.statusCode).json({
            success: product.success,
            message: product.message,
            data: product.data,
        });
    } catch (error) {
        logger.error("❌ Something went wrong while executing get all product controller: ", error);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

async function updateProduct(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing update product controller..");
        const request = req.body as IProductUpdate;
        const { success, data, error } = await updateProductSchema.safeParse(request);
        if (!success) {
            return res.status(400).json({
                success: false,
                message: z.flattenError(error).fieldErrors,
            });
        }

        const product = await productService.updateProduct(data);
        return res.status(product.statusCode).json({
            success: product.success,
            message: product.message,
            data: product.data,
        });
    } catch (error) {
        logger.error("❌ Something went wrong while executing update product controller: ", error);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

async function changeProductStock(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing change product stock controller..");
        const { success, data, error } = await changeProductStockSchema.safeParse(req.query);
        if (!success) {
            return res.status(400).json({
                success: false,
                message: z.flattenError(error).fieldErrors,
            });
        }

        const product = await productService.changeProductStock(data);
        return res.status(product.statusCode).json({
            success: product.success,
            message: product.message,
            data: product.data,
        });
    } catch (error) {
        logger.error("❌ Something went wrong while executing change product stock controller: ", error);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

async function deleteProduct(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing delete product controller..");
        const request = req.query as IProductGetId;
        const { success, data, error } = await getProductIdSchema.safeParse(request);
        if (!success) {
            return res.status(400).json({
                success: false,
                message: z.flattenError(error).fieldErrors,
            });
        }

        const product = await productService.deleteProduct(data);
        return res.status(product.statusCode).json({
            success: product.success,
            message: product.message,
            data: product.data,
        });
    } catch (error) {
        logger.error("❌ Something went wrong while executing delete product controller: ", error);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

async function softDeleteProduct(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing soft delete product controller..");
        const request = req.query as IProductGetId;
        const { success, data, error } = await getProductIdSchema.safeParse(request);
        if (!success) {
            return res.status(400).json({
                success: false,
                message: z.flattenError(error).fieldErrors,
            });
        }

        const product = await productService.softDeleteProduct(data);
        return res.status(product.statusCode).json({
            success: product.success,
            message: product.message,
            data: product.data,
        });
    } catch (error) {
        logger.error("❌ Something went wrong while executing soft delete product controller: ", error);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

async function restoreProduct(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing soft delete product controller..");
        const request = req.query as IProductGetId;
        const { success, data, error } = await getProductIdSchema.safeParse(request);
        if (!success) {
            return res.status(400).json({
                success: false,
                message: z.flattenError(error).fieldErrors,
            });
        }

        const product = await productService.restoreProduct(data);
        return res.status(product.statusCode).json({
            success: product.success,
            message: product.message,
            data: product.data,
        });
    } catch (error) {
        logger.error("❌ Something went wrong while executing soft delete product controller: ", error);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

export const productController = {
    createProduct,
    getProductById,
    getAllProducts,
    updateProduct,
    changeProductStock,
    deleteProduct,
    softDeleteProduct,
    restoreProduct,
};

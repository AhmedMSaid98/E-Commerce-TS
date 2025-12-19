import logger from "../../libs/logger";
import { Request, Response } from "express";
import {
    createCategorySchema,
    deleteCategorySchema,
    getAllCategoriesSchema,
    getCategoryByIdSchema,
    ICategoryCreate,
    ICategoryDelete,
    ICategoryGetAll,
    ICategoryGetById,
    ICategoryRestore,
    ICategoryUpdate,
    restoreCategorySchema,
    updateCategorySchema,
} from "./category.validation";
import z from "zod";
import { categoryService } from "./category.service";

async function createCategory(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing create category controller..");
        const request = req.body as ICategoryCreate;
        const { success, data, error } = await createCategorySchema.safeParse(request);
        if (!success) {
            return res.status(400).json({
                success: false,
                message: z.flattenError(error).fieldErrors,
            });
        }

        const category = await categoryService.createCategory(data);
        return res.status(category.statusCode).json({
            success: category.success,
            message: category.message,
            data: category.data,
        });
    } catch (error) {
        logger.error("❌ Something went wrong while executing create category controller: ", error);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

async function getCategoryById(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing get category by id controller..");
        const request = req.query as ICategoryGetById;
        const { success, data, error } = await getCategoryByIdSchema.safeParse(request);
        if (!success) {
            return res.status(400).json({
                success: false,
                message: z.flattenError(error).fieldErrors,
            });
        }

        const category = await categoryService.getCategoryById(data);
        return res.status(category.statusCode).json({
            success: category.success,
            message: category.message,
            data: category.data,
        });
    } catch (error) {
        logger.error("❌ Something went wrong while executing get category by id controller: ", error);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

async function getAllCategories(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing get all categories controller..");
        const request = req.query as ICategoryGetAll;
        const { success, data, error } = await getAllCategoriesSchema.safeParse(request);
        if (!success) {
            return res.status(400).json({
                success: false,
                message: z.flattenError(error).fieldErrors,
            });
        }

        const category = await categoryService.getAllCategories(data);
        return res.status(category.statusCode).json({
            success: category.success,
            message: category.message,
            data: category.data,
        });
    } catch (error) {
        logger.error("❌ Something went wrong while executing get all categories controller: ", error);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

async function updateCategory(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing update category controller..");
        const request = req.body as ICategoryUpdate;
        const { success, data, error } = await updateCategorySchema.safeParse(request);
        if (!success) {
            return res.status(400).json({
                success: false,
                message: z.flattenError(error).fieldErrors,
            });
        }

        const category = await categoryService.updateCategory(data);
        return res.status(category.statusCode).json({
            success: category.success,
            message: category.message,
            data: category.data,
        });
    } catch (error) {
        logger.error("❌ Something went wrong while executing update category controller: ", error);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

async function deleteCategory(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing delete category controller..");
        const request = req.body as ICategoryDelete;
        const { success, data, error } = await deleteCategorySchema.safeParse(request);
        if (!success) {
            return res.status(400).json({
                success: false,
                message: z.flattenError(error).fieldErrors,
            });
        }

        const category = await categoryService.deleteCategory(data);
        return res.status(category.statusCode).json({
            success: category.success,
            message: category.message,
            data: category.data,
        });
    } catch (error) {
        logger.error("❌ Something went wrong while executing delete category controller: ", error);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

async function softDeleteCategory(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing soft delete category controller..");
        const request = req.body as ICategoryDelete;
        const { success, data, error } = await deleteCategorySchema.safeParse(request);
        if (!success) {
            return res.status(400).json({
                success: false,
                message: z.flattenError(error).fieldErrors,
            });
        }

        const category = await categoryService.softDeleteCategory(data);
        return res.status(category.statusCode).json({
            success: category.success,
            message: category.message,
            data: category.data,
        });
    } catch (error) {
        logger.error("❌ Something went wrong while executing soft delete category controller: ", error);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

async function restoreCategory(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing restore category controller..");
        const request = req.body as ICategoryRestore;
        const { success, data, error } = await restoreCategorySchema.safeParse(request);
        if (!success) {
            return res.status(400).json({
                success: false,
                message: z.flattenError(error).fieldErrors,
            });
        }

        const category = await categoryService.restoreCategory(data);
        return res.status(category.statusCode).json({
            success: category.success,
            message: category.message,
            data: category.data,
        });
    } catch (error) {
        logger.error("❌ Something went wrong while executing restore category controller: ", error);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

export const categoryController = {
    createCategory,
    getCategoryById,
    getAllCategories,
    updateCategory,
    deleteCategory,
    softDeleteCategory,
    restoreCategory,
};

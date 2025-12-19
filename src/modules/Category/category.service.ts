import logger from "../../libs/logger";
import { CategoryModel } from "../../types/models";
import { genericCreateService } from "../../utils/HelperFunctions/GenericCreateService";
import { genericDeleteService } from "../../utils/HelperFunctions/GenericDeleteService";
import { genericGetAllService } from "../../utils/HelperFunctions/GenericGetAllService";
import { genericGetByConstrain } from "../../utils/HelperFunctions/GenericGetByConstrain";
import { genericSoftDeleteService } from "../../utils/HelperFunctions/GenericSoftDeleteService";
import { genericUpdateService } from "../../utils/HelperFunctions/GenericUpdateService";
import {
    categorySelect,
    ICategoryCreate,
    ICategoryDelete,
    ICategoryGetAll,
    ICategoryGetById,
    ICategoryRestore,
    ICategoryUpdate,
} from "./category.validation";

async function createCategory(data: ICategoryCreate) {
    try {
        logger.info("🆗 Executing create category service..");
        const categoryExists = await genericGetByConstrain<"category", CategoryModel>(
            "category",
            { name: data.name },
            categorySelect,
            `Category not found`,
            `Category already exists`
        );
        if (categoryExists.success) {
            return categoryExists;
        }
        const createCategory = await genericCreateService(
            "category",
            data,
            categorySelect,
            `Something went wrong while creating category name: ${data.name}`,
            `Category created succefully`
        );
        return createCategory;
    } catch (error) {
        logger.error("❌ Something went wrong while executing create category service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function getCategoryById(data: ICategoryGetById) {
    try {
        logger.info("🆗 Executing get category by id service..");
        const category = await genericGetByConstrain(
            "category",
            data,
            categorySelect,
            `Category not found with id: ${data.id}`,
            `Category with id: ${data.id} found succefully`
        );
        return category;
    } catch (error) {
        logger.error("❌ Something went wrong while executing get category by id service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function getAllCategories(data: ICategoryGetAll) {
    try {
        logger.info("🆗 Executing get all categories service..");
        const categoryList = await genericGetAllService(
            "category",
            { name: { contains: data.name } },
            categorySelect,
            `Category not found`,
            `Categories found succefully`,
            data.limit,
            data.page
        );
        return categoryList;
    } catch (error) {
        logger.error("❌ Something went wrong while executing get all categories service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function updateCategory(data: ICategoryUpdate) {
    try {
        logger.info("🆗 Executing update category service..");
        const updateCategory = await genericUpdateService(
            "category",
            { name: data.name },
            { id: data.id },
            { name: data.name },
            categorySelect,
            `Category not found`,
            `No changes occured on category`,
            `Unique constrains already exists`,
            `Something went wrong while updating category`,
            `Category updated succefully`
        );
        return updateCategory;
    } catch (error) {
        logger.error("❌ Something went wrong while executing update category service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function deleteCategory(data: ICategoryDelete) {
    try {
        logger.info("🆗 Executing delete category service..");
        const deleteCategory = await genericDeleteService(
            "category",
            data,
            categorySelect,
            `Category not found`,
            `Something went wrong while deleting category`,
            `Category permanently deleted succefully`
        );
        return deleteCategory;
    } catch (error) {
        logger.error("❌ Something went wrong while executing delete category service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function softDeleteCategory(data: ICategoryDelete) {
    try {
        logger.info("🆗 Executing soft delete category service..");
        const softDelete = await genericSoftDeleteService(
            "category",
            data,
            data,
            categorySelect,
            `Category not found`,
            `No changes occured on category`,
            `Unique constrains already exists`,
            `Something went wrong while deleting category`,
            `Category deleted succefully`
        );
        return softDelete;
    } catch (error) {
        logger.error("❌ Something went wrong while executing soft delete category service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function restoreCategory(data: ICategoryRestore) {
    try {
        logger.info("🆗 Executing restore category service..");
        const restore = await genericUpdateService(
            "category",
            data,
            data,
            data,
            categorySelect,
            `Category not found`,
            `No changes occured on category`,
            `Unique constrains already exists`,
            `Something went wrong while restoring category`,
            `Category restored succefully`
        );
        return restore;
    } catch (error) {
        logger.error("❌ Something went wrong while executing restore category service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

export const categoryService = {
    createCategory,
    getCategoryById,
    getAllCategories,
    updateCategory,
    deleteCategory,
    softDeleteCategory,
    restoreCategory,
};

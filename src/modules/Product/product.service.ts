import logger from "../../libs/logger";
import { AuthJwtPayload } from "../../types/auth";
import { ProductModel } from "../../types/models";
import { checkForeignKey } from "../../utils/HelperFunctions/GenericCheckForeignKey";
import { genericCreateService } from "../../utils/HelperFunctions/GenericCreateService";
import { genericDeleteService } from "../../utils/HelperFunctions/GenericDeleteService";
import { genericGetAllService } from "../../utils/HelperFunctions/GenericGetAllService";
import { genericGetByConstrain } from "../../utils/HelperFunctions/GenericGetByConstrain";
import { genericSoftDeleteService } from "../../utils/HelperFunctions/GenericSoftDeleteService";
import { genericUpdateService } from "../../utils/HelperFunctions/GenericUpdateService";
import resTransformer from "../../utils/response/res-transformer";
import {
    IProductChangeStock,
    IProductCreate,
    IProductGetAll,
    IProductGetId,
    IProductUpdate,
    productSelect,
} from "./product.validation";

async function createProduct(data: IProductCreate) {
    try {
        logger.info("🆗 Executing create product service..");
        const checkFK = await checkForeignKey(data, {
            categoryId: { model: "category", resMessage: "Category not found" },
        });
        if (!checkFK.success) {
            return checkFK;
        }

        const whereQuery = { name: data.name };

        const productExists = await genericGetByConstrain<"product", ProductModel>(
            "product",
            whereQuery,
            productSelect,
            `Product not found`,
            `Name already exists`
        );
        if (productExists.success) {
            return productExists;
        }
        const createProduct = await genericCreateService<"product", ProductModel>(
            "product",
            data,
            productSelect,
            `Somthing went wrong while creating produc`,
            `Product created successfully`
        );
        return createProduct;
    } catch (error) {
        logger.error("❌ Something went wrong while executing create product service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function getProductById(data: IProductGetId) {
    try {
        logger.info("🆗 Executing get product id service..");
        const product = await genericGetByConstrain<"product", ProductModel>(
            "product",
            data,
            productSelect,
            `Product not found`,
            `Product found successfully`
        );
        return product;
    } catch (error) {
        logger.error("❌ Something went wrong while executing get product id service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function getAllProducts(data: IProductGetAll) {
    try {
        logger.info("🆗 Executing get all product service..");
        const whereQuery = {
            name: { contains: data.name },
            price: { gte: data.minPrice, lte: data.maxPrice },
            category: { name: { contains: data.categoryName } },
        };
        const productList = await genericGetAllService<"product", ProductModel>(
            "product",
            whereQuery,
            productSelect,
            `products not found`,
            `Product list found successfully`,
            data.limit,
            data.page
        );
        return productList;
    } catch (error) {
        logger.error("❌ Something went wrong while executing get all product service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function updateProduct(data: IProductUpdate) {
    try {
        logger.info("🆗 Executing update product service..");
        const whereQuery = { id: data.id };
        const uniqueConstrain = { name: data.name };
        const checkFK = await checkForeignKey(data, {
            categoryId: { model: "category", resMessage: "Category not found" },
        });
        if (!checkFK.success) {
            return checkFK;
        }

        const updateProduct = await genericUpdateService<"product", ProductModel>(
            "product",
            data,
            whereQuery,
            uniqueConstrain,
            productSelect,
            `Product not found`,
            `No changes occured on product`,
            `Name already exists`,
            `Something went wrong while updating product`,
            `Product updated successfully`
        );
        return updateProduct;
    } catch (error) {
        logger.error("❌ Something went wrong while executing update product service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function changeProductStock(data: IProductChangeStock) {
    try {
        logger.info("🆗 Executing change product stock service..");
        const getWhereQuery = { id: data.id };
        const product = await genericGetByConstrain<"product", ProductModel>(
            "product",
            getWhereQuery,
            productSelect,
            `Product not found`,
            `Product found successfully`
        );
        if (!product.success || !product.data) {
            return product;
        }

        if (data.stockQuantity > product.data.stockQuantity) {
            return resTransformer(
                false,
                400,
                `Stock quantity provided exceeds availability`,
                `Stock quantity provided exceeds availability`,
                { StockQuantityAvailable: product.data.stockQuantity }
            );
        }

        const newStockQuantity = product.data.stockQuantity - data.stockQuantity;
        let updateProductData;
        if (newStockQuantity === 0) {
            updateProductData = {
                stockQuantity: 0,
                isAvailable: false,
            };
        } else {
            updateProductData = {
                stockQuantity: newStockQuantity,
            };
        }

        const updateProduct = await genericUpdateService<"product", ProductModel>(
            "product",
            updateProductData,
            getWhereQuery,
            {},
            productSelect,
            `Product not found`,
            `No changes occured on product`,
            `Name already exists`,
            `Something went wrong while updating product stock quantity`,
            `Product stock quantity updated successfully`
        );
        return updateProduct;
    } catch (error) {
        logger.error("❌ Something went wrong while executing change product stock service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function deleteProduct(data: IProductGetId) {
    try {
        logger.info("🆗 Executing delete product service..");
        const whereQuery = { id: data.id };
        const deleteProduct = await genericDeleteService<"product", ProductModel>(
            "product",
            whereQuery,
            productSelect,
            `Product not found`,
            `Something went wrong while deleting product`,
            `Product permanently deleted successfully`
        );
        return deleteProduct;
    } catch (error) {
        logger.error("❌ Something went wrong while executing delete product service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function softDeleteProduct(data: IProductGetId) {
    try {
        logger.info("🆗 Executing soft delete product service..");
        const softDelete = await genericSoftDeleteService<"product", ProductModel>(
            "product",
            data,
            data,
            productSelect,
            `Product not found`,
            `No changes occured on product`,
            `Something went wrong while soft deleting product`,
            `Unique constrain alrady exists`,
            `Product deleted successfully`
        );
        return softDelete;
    } catch (error) {
        logger.error("❌ Something went wrong while executing soft delete product service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function restoreProduct(data: IProductGetId) {
    try {
        logger.info("🆗 Executing restore product service..");
        const restoreProduct = await genericUpdateService<"product", ProductModel>(
            "product",
            { isDeleted: false },
            data,
            data,
            productSelect,
            `Product not found`,
            `No changes occured on product`,
            `Unique constrain already exists`,
            `Something went wrong while restoring product`,
            `Product restored successfully`
        );
        return restoreProduct;
    } catch (error) {
        logger.error("❌ Something went wrong while executing restore product service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

export const productService = {
    createProduct,
    getProductById,
    getAllProducts,
    updateProduct,
    changeProductStock,
    deleteProduct,
    softDeleteProduct,
    restoreProduct,
};

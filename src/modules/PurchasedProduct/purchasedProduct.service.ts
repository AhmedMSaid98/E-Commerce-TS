import { OrderStatus } from "../../generated/prisma/enums";
import logger from "../../libs/logger";
import { ProductModel, PurchasedProductModel } from "../../types/models";
import { checkForeignKey } from "../../utils/HelperFunctions/GenericCheckForeignKey";
import { genericCreateManyService } from "../../utils/HelperFunctions/GenericCreateManyService";
import { genericCreateService } from "../../utils/HelperFunctions/GenericCreateService";
import { genericDeleteService } from "../../utils/HelperFunctions/GenericDeleteService";
import { genericGetAllService } from "../../utils/HelperFunctions/GenericGetAllService";
import { genericGetByConstrain } from "../../utils/HelperFunctions/GenericGetByConstrain";
import { genericGetFirstService } from "../../utils/HelperFunctions/GenericGetFirstService";
import { genericSoftDeleteService } from "../../utils/HelperFunctions/GenericSoftDeleteService";
import { genericUpdateManyService } from "../../utils/HelperFunctions/GenericUpdateManyService";
import { genericUpdateService } from "../../utils/HelperFunctions/GenericUpdateService";
import { productSelect } from "../Product/product.validation";
import {
    IPurchasedProductCreate,
    IPurchasedProductCreateMany,
    IPurchasedProductGetAll,
    IPurchasedProductGetById,
    IPurchasedProductGetByUserId,
    IPurchasedProductPagination,
    IPurchasedProductUpdateOrderId,
    IPurchasedProductUpdateStatus,
    purchasedProductSelect,
} from "./purchasedProduct.validation";

async function createPurchasedProduct(data: IPurchasedProductCreate) {
    try {
        logger.info("🆗 Executing create purchased product service..");
        const whereQueryPurchasedProduct = {
            userId: data.userId,
            productId: data.productId,
            status: { in: ["PENDING"] },
        };
        const purchasedProductExists = await genericGetFirstService<
            "purchasedProduct",
            PurchasedProductModel
        >(
            "purchasedProduct",
            whereQueryPurchasedProduct,
            purchasedProductSelect,
            `Purchased product not found`,
            `Purchased product already exists`
        );
        if (purchasedProductExists.success) {
            return purchasedProductExists;
        }

        const product = await genericGetFirstService<"product", ProductModel>(
            "product",
            { id: data.productId },
            productSelect,
            `Product not found`,
            `Product found successfully`
        );
        if (!product.success || !product.data) {
            return product;
        }

        const totalPrice = product.data.price * data.quantityPurchased;
        const purchasedProductData = {
            ...data,
            pricePurchased: product.data.price,
            totalPrice: totalPrice,
        };

        const purchasedProduct = await genericCreateService<"purchasedProduct", PurchasedProductModel>(
            "purchasedProduct",
            purchasedProductData,
            purchasedProductSelect,
            `Something went wrong while creating purchased product`,
            `Purchased product created successfully`
        );
        return purchasedProduct;
    } catch (error) {
        logger.error("❌ Something went wrong while executing create purchased product service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function createManyPurchasedProduct(data: IPurchasedProductCreateMany) {
    try {
        logger.info("🆗 Executing create purchased product service..");
        const products = await Promise.all(
            data.map((data) =>
                genericGetByConstrain<"product", ProductModel>(
                    "product",
                    { id: data.productId },
                    productSelect,
                    `Product with id: ${data.productId} not found`,
                    `Product with id: ${data.productId} found successfully`
                )
            )
        );
        const failedProducts = products.filter((r) => !r.success);
        if (failedProducts.length > 0) {
            return {
                success: false,
                statusCode: 400,
                message: failedProducts.map((m) => m.message),
                data: null,
            };
        }

        // const purchasedProductData = (await products).map((d) => d.data);
        const checkPurchasedProduct = Promise.all(
            data.map((data) =>
                genericGetFirstService<"purchasedProduct", PurchasedProductModel>(
                    "purchasedProduct",
                    { userId: data.userId, productId: data.productId, status: { in: [OrderStatus.PENDING] } },
                    purchasedProductSelect,
                    `Purchased product with user id: ${data.userId} not found`,
                    `Purchased product with user id: ${data.userId} already exists`
                )
            )
        );

        const existsPurchasedProduct = (await checkPurchasedProduct).filter((s) => s.success);
        if (existsPurchasedProduct.length > 0) {
            return {
                success: false,
                statusCode: 400,
                message: existsPurchasedProduct.map((m) => m.message),
                data: existsPurchasedProduct.map((d) => d.data),
            };
        }

        const purchasedProductsData = data.map((item, index) => {
            const productData = products[index];
            const totalPrice = productData?.data?.price! * item.quantityPurchased;
            return {
                ...item,
                pricePurchased: productData?.data?.price!,
                totalPrice: totalPrice,
            };
        });

        const createPurchasedProduct = await genericCreateManyService<
            "purchasedProduct",
            PurchasedProductModel
        >(
            "purchasedProduct",
            {},
            purchasedProductsData,
            purchasedProductSelect,
            `Purchased product not found`,
            `Unique constrain already exists`,
            `Something went wrong while creating many purchased product`,
            `Purchased product list found`,
            `Purchased products created successfully`
        );
        return createPurchasedProduct;
    } catch (error) {
        logger.error("❌ Something went wrong while executing create purchased product service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function getAllPurchasedProductByUserId(
    data: IPurchasedProductGetByUserId,
    paginationData: IPurchasedProductPagination
) {
    try {
        logger.info("🆗 Executing get all purchased product by user id service..");
        const whereQuery = { userId: data.userId };
        const purchasedProduct = await genericGetAllService<"purchasedProduct", PurchasedProductModel>(
            "purchasedProduct",
            whereQuery,
            purchasedProductSelect,
            `Purchased product with user Id: ${data.userId} not found`,
            `Purchased product list with user Id: ${data.userId} found successfully`,
            paginationData.limit,
            paginationData.page
        );
        return purchasedProduct;
    } catch (error) {
        logger.error(
            "❌ Something went wrong while executing get all purchased product by user id service: ",
            error
        );
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function getPurchasedProductById(data: IPurchasedProductGetById) {
    try {
        logger.info("🆗 Executing get purchased product by id service..");
        const purchasedProduct = await genericGetByConstrain<"purchasedProduct", PurchasedProductModel>(
            "purchasedProduct",
            { id: data.id },
            purchasedProductSelect,
            `Purchased product with id: ${data.id} not found`,
            `Purchased product with id: ${data.id} found successfully`
        );
        return purchasedProduct;
    } catch (error) {
        logger.error("❌ Something went wrong while executing get purchased product by id service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function getAllPurchasedProduct(
    data: IPurchasedProductGetAll,
    paginationData: IPurchasedProductPagination
) {
    try {
        logger.info("🆗 Executing get all purchased product service..");
        const whereQuery = {
            userId: data.userId,
            productId: data.productId,
            status: { in: [data.status] },
        };
        const purchasedProductList = await genericGetAllService<"purchasedProduct", PurchasedProductModel>(
            "purchasedProduct",
            whereQuery,
            purchasedProductSelect,
            `Purchased product list not found`,
            `Purchased product list found successfully`,
            paginationData.limit,
            paginationData.page
        );
        return purchasedProductList;
    } catch (error) {
        logger.error("❌ Something went wrong while executing get all purchased product service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function updateOrderIdPurchasedProduct(
    orderIdData: IPurchasedProductUpdateOrderId,
    userIdData: IPurchasedProductGetByUserId
) {
    try {
        logger.info("🆗 Executing update purchased product service..");
        const whereQuery = { userId: userIdData.userId, status: { in: [OrderStatus.PENDING] } };
        const updatePurchasedProduct = await genericUpdateManyService<"purchasedProduct">(
            "purchasedProduct",
            whereQuery,
            orderIdData,
            `Purchased product not found`,
            `Something went wrong while updating purchased product`,
            `Purchased product updated successfully`
        );
        return updatePurchasedProduct;
    } catch (error) {
        logger.error("❌ Something went wrong while executing update purchased product service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function updatePurchasedProductStatus(
    userData: IPurchasedProductGetByUserId,
    statusData: IPurchasedProductUpdateStatus
) {
    try {
        logger.info("🆗 Executing update purchased product status service..");
        const checkFK = await checkForeignKey(userData, {
            userId: { model: "user", resMessage: "User not found" },
        });
        if (!checkFK.success) {
            return checkFK;
        }

        const purchasedProductList = await genericGetAllService<"purchasedProduct", PurchasedProductModel>(
            "purchasedProduct",
            { userId: userData.userId, status: { not: [OrderStatus.SHIPPED, OrderStatus.DELIVERED] } },
            purchasedProductSelect,
            `Purchased products not found`,
            `Purchased product list found successfully`
        );

        if (purchasedProductList.data?.length === 0) {
            return purchasedProductList;
        }

        if (statusData.status === "CANCELLED") {
            const updatePurchasedProduct = await genericUpdateManyService<"purchasedProduct">(
                "purchasedProduct",
                { userId: userData.userId, status: { not: [OrderStatus.SHIPPED, OrderStatus.DELIVERED] } },
                { status: OrderStatus.CANCELLED },
                `Purchased products not found`,
                `Something went wrong while updating purchased products status`,
                `Purchased product status updated successfully`
            );
            if (!updatePurchasedProduct.success) {
                return updatePurchasedProduct;
            }
            const updateProduct = await Promise.all(
                purchasedProductList.data!.map((purchased) =>
                    genericUpdateService<"product", any>(
                        "product",
                        {
                            stock: {
                                increment: purchased.quantityPurchased,
                            },
                        },
                        { id: purchased.productId },
                        undefined,
                        {},
                        "Product not found",
                        "No stock changes detected",
                        "Product already exists",
                        "Failed to update product stock",
                        "Product stock restored successfully"
                    )
                )
            );
            return {
                success: true,
                statusCode: 200,
                message: "Purchased products cancelled and stock restored successfully",
                data: {
                    cancelledPurchasedProducts: purchasedProductList.data,
                    updatedProducts: updateProduct.filter((r) => r.success).map((r) => r.data),
                },
            };
        }
        const updatePurchasedProduct = await genericUpdateManyService<"purchasedProduct">(
            "purchasedProduct",
            { userId: userData.userId, status: { not: [OrderStatus.SHIPPED, OrderStatus.DELIVERED] } },
            { status: OrderStatus.CANCELLED },
            `Purchased products not found`,
            `Something went wrong while updating purchased products status`,
            `Purchased product status updated successfully`
        );
        return updatePurchasedProduct;
    } catch (error) {
        logger.error(
            "❌ Something went wrong while executing update purchased product status service: ",
            error
        );
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function deletePurchasedProduct(data: IPurchasedProductGetById) {
    try {
        logger.info("🆗 Executing delete purchased product service..");
        const deletePurchasedProduct = await genericDeleteService<"purchasedProduct", PurchasedProductModel>(
            "purchasedProduct",
            { id: data.id },
            purchasedProductSelect,
            `Purchased product not found`,
            `Something went wrong while deleting purchased product`,
            `Purchased product permanently deleted successfully`
        );
        return deletePurchasedProduct;
    } catch (error) {
        logger.error("❌ Something went wrong while executing delete purchased product service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function softDeletePurchasedProduct(data: IPurchasedProductGetById) {
    try {
        logger.info("🆗 Executing soft delete purchased product service..");
        const softDelete = await genericSoftDeleteService<"purchasedProduct", PurchasedProductModel>(
            "purchasedProduct",
            data,
            data,
            purchasedProductSelect,
            `Purchased product not found`,
            `No changes occured on purchased product`,
            `Something went wrong while deleting purchased product`,
            `Unique constrain already exists`,
            `Purchased product deleted successfully`
        );
        return softDelete;
    } catch (error) {
        logger.error(
            "❌ Something went wrong while executing soft delete purchased product service: ",
            error
        );
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function restorePurchasedProduct(data: IPurchasedProductGetById) {
    try {
        logger.info("🆗 Executing restore purchased product service..");
        const restore = await genericUpdateService<"purchasedProduct", PurchasedProductModel>(
            "purchasedProduct",
            { isDeleted: false },
            data,
            {},
            purchasedProductSelect,
            `Purchased product not found`,
            `No changes occured on purchased product`,
            `Something went wrong while deleting purchased product`,
            `Unique constrain already exists`,
            `Purchased product restored successfully`
        );
        return restore;
    } catch (error) {
        logger.error("❌ Something went wrong while executing restore purchased product service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

export const purchasedProductService = {
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

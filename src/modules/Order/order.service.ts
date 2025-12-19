import { OrderStatus } from "../../generated/prisma/enums";
import logger from "../../libs/logger";
import { AuthJwtPayload } from "../../types/auth";
import { OrderModel, PurchasedProductModel } from "../../types/models";
import { checkForeignKey } from "../../utils/HelperFunctions/GenericCheckForeignKey";
import { genericCreateService } from "../../utils/HelperFunctions/GenericCreateService";
import { genericGetAllService } from "../../utils/HelperFunctions/GenericGetAllService";
import { genericGetByConstrain } from "../../utils/HelperFunctions/GenericGetByConstrain";
import { genericGetFirstService } from "../../utils/HelperFunctions/GenericGetFirstService";
import { genericSumService } from "../../utils/HelperFunctions/GenericSumService";
import { genericUpdateService } from "../../utils/HelperFunctions/GenericUpdateService";
import resTransformer from "../../utils/response/res-transformer";
import { purchasedProductService } from "../PurchasedProduct/purchasedProduct.service";
import { purchasedProductSelect } from "../PurchasedProduct/purchasedProduct.validation";
import {
    IOrderGetUserId,
    IOrderGetUserIdOptional,
    IOrderPagination,
    IOrderUpdateStatus,
    orderSelect,
} from "./order.validation";

async function createOrder(userAuth: AuthJwtPayload) {
    try {
        logger.info("🆗 Executing create order service..");
        const checkFK = await checkForeignKey(userAuth, {
            userId: { model: "user", resMessage: "User not found" },
        });
        if (!checkFK.success) {
            return checkFK;
        }

        const purchasedProducts = await genericGetAllService<"purchasedProduct", PurchasedProductModel>(
            "purchasedProduct",
            { userId: userAuth.userId, status: { in: [OrderStatus.PENDING] } },
            purchasedProductSelect,
            `Purchased products not found`,
            `Purchased products found successfully`
        );
        if (!purchasedProducts.success) {
            return purchasedProducts;
        }

        const totalAmount = await genericSumService<"purchasedProduct">("purchasedProduct", "totalPrice", {
            userId: userAuth.userId,
            status: { in: [OrderStatus.PENDING] },
        });

        const orderData = {
            userId: userAuth.userId,
            totalAmount,
        };

        const orderExists = await genericGetFirstService<"order", OrderModel>(
            "order",
            { userId: userAuth.userId, status: { in: [OrderStatus.PENDING] } },
            orderSelect,
            `Order not found`,
            `Order already exists`
        );
        if (orderExists.success) {
            return orderExists;
        }

        const order = await genericCreateService<"order", OrderModel>(
            "order",
            orderData,
            orderSelect,
            `Somthing went wrong while creating order`,
            `Order created successfully`
        );

        const updatePurchasedProduct = await purchasedProductService.updateOrderIdPurchasedProduct(
            { orderId: order.data?.id! },
            { userId: userAuth.userId }
        );

        const orderUp = await genericGetByConstrain<"order", OrderModel>(
            "order",
            { id: order.data?.id! },
            orderSelect,
            `Order not found`,
            `Order created successfully`
        );
        return orderUp;
    } catch (error) {
        logger.error("❌ Something went wrong while executing create order service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function createOrderByUserId(data: IOrderGetUserId) {
    try {
        logger.info("🆗 Executing create order by user id service..");
        const checkFK = await checkForeignKey(data, {
            userId: { model: "user", resMessage: "User not found" },
        });
        if (!checkFK.success) {
            return checkFK;
        }

        const purchasedProducts = await genericGetAllService<"purchasedProduct", PurchasedProductModel>(
            "purchasedProduct",
            { userId: data.userId, status: { in: [OrderStatus.PENDING] } },
            purchasedProductSelect,
            `Purchased products not found`,
            `Purchased products found successfully`
        );
        if (!purchasedProducts.success) {
            return purchasedProducts;
        }

        const totalAmount = await genericSumService<"purchasedProduct">("purchasedProduct", "totalPrice", {
            userId: data.userId,
            status: { in: [OrderStatus.PENDING] },
        });

        const orderData = {
            userId: data.userId,
            totalAmount,
        };

        const orderExists = await genericGetFirstService<"order", OrderModel>(
            "order",
            { userId: data.userId, status: { in: [OrderStatus.PENDING] } },
            orderSelect,
            `Order not found`,
            `Order already exists`
        );
        if (orderExists.success) {
            return orderExists;
        }

        const order = await genericCreateService<"order", OrderModel>(
            "order",
            orderData,
            orderSelect,
            `Somthing went wrong while creating order`,
            `Order created successfully`
        );

        const updatePurchasedProduct = await purchasedProductService.updateOrderIdPurchasedProduct(
            { orderId: order.data?.id! },
            { userId: data.userId }
        );

        const orderUp = await genericGetByConstrain<"order", OrderModel>(
            "order",
            { id: order.data?.id! },
            orderSelect,
            `Order not found`,
            `Order created successfully`
        );
        return orderUp;
    } catch (error) {
        logger.error("❌ Something went wrong while executing create order by user id service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function getAllOrders(userData: IOrderGetUserIdOptional, paginationData: IOrderPagination) {
    try {
        logger.info("🆗 Executing get all orders service..");
        const checkFK = await checkForeignKey(userData, {
            userId: { model: "user", resMessage: "User not found" },
        });
        if (!checkFK.success) {
            return checkFK;
        }

        const orderList = await genericGetAllService<"order", OrderModel>(
            "order",
            userData,
            orderSelect,
            `Order not found`,
            `Order list found successfully`,
            paginationData.limit,
            paginationData.page
        );
        return orderList;
    } catch (error) {
        logger.error("❌ Something went wrong while executing get all orders service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function getAllOrdersByUserAuth(userAuth: AuthJwtPayload, paginationData: IOrderPagination) {
    try {
        logger.info("🆗 Executing get order by user id service..");
        const orderList = await genericGetAllService<"order", OrderModel>(
            "order",
            { userId: userAuth.userId },
            orderSelect,
            `Order with user id: ${userAuth.userId} not found `,
            `Order list found successfully`,
            paginationData.limit,
            paginationData.page
        );
        return orderList;
    } catch (error) {
        logger.error("❌ Something went wrong while executing get order by user id service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function updateOrderStatus(userData: IOrderGetUserId, statusData: IOrderUpdateStatus) {
    try {
        logger.info("🆗 Executing update order status service..");
        const userExists = await checkForeignKey(userData, {
            userId: { model: "user", resMessage: "User not found" },
        });
        if (!userExists.success) {
            return userExists;
        }

        if (statusData.status === "CANCELLED") {
            const updateOrder = await genericUpdateService<"order", OrderModel>(
                "order",
                statusData,
                { userId: userData.userId },
                {},
                orderSelect,
                `Order not found`,
                `No changes occured on Order`,
                `Unique constrain already exists`,
                `Something went wrong while updating order`,
                `Order status updated successfully`
            );
            if (!updateOrder.success) {
                return updateOrder;
            }

            const updatePurchasedProducts = await purchasedProductService.updatePurchasedProductStatus(
                userData,
                statusData
            );
            if (!updatePurchasedProducts.success) {
                return updatePurchasedProducts;
            }

            return resTransformer(
                true,
                200,
                `${updateOrder.message} -- ${updatePurchasedProducts.message}`,
                `${updateOrder.message} -- ${updatePurchasedProducts.message}`,
                {
                    updatedOrder: updateOrder.data,
                    updatePurchasedProducts: updatePurchasedProducts.data,
                }
            );
        }

        const updateOrder = await genericUpdateService<"order", OrderModel>(
            "order",
            statusData,
            { userId: userData.userId },
            {},
            orderSelect,
            `Order not found`,
            `No changes occured on Order`,
            `Unique constrain already exists`,
            `Something went wrong while updating order`,
            `Order status updated successfully`
        );
        return updateOrder;
    } catch (error) {
        logger.error("❌ Something went wrong while executing update order status service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

export const orderService = {
    createOrder,
    createOrderByUserId,
    getAllOrders,
    getAllOrdersByUserAuth,
    updateOrderStatus,
};

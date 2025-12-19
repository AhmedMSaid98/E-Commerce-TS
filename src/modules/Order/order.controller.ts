import logger from "../../libs/logger";
import { Request, Response } from "express";
import { AuthJwtPayload } from "../../types/auth";
import { orderService } from "./order.service";
import {
    orderGetUserIdOptionalSchema,
    orderGetUserIdSchema,
    orderPaginationSchema,
    orderUpdateStatusSchema,
} from "./order.validation";
import z from "zod";

async function createOrder(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing create order controller..");
        const user = req.user as AuthJwtPayload;
        const order = await orderService.createOrder(user);
        return res.status(order.statusCode).json({
            success: order.success,
            message: order.message,
            data: order.data,
        });
    } catch (error) {
        logger.error("❌ Something went wrong while executing create order controller: ", error);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

async function createOrderByUserId(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing create order by user id controller..");
        const data = await orderGetUserIdSchema.safeParse(req.query);
        if (!data.success) {
            return res.status(400).json({
                success: false,
                message: z.flattenError(data.error).fieldErrors,
            });
        }

        const order = await orderService.createOrderByUserId(data.data);
        return res.status(order.statusCode).json({
            success: order.success,
            message: order.message,
            data: order.data,
        });
    } catch (error) {
        logger.error("❌ Something went wrong while executing create order by user id controller: ", error);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

async function getAllOrders(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing get all orders controller..");
        const getResult = await orderGetUserIdOptionalSchema.safeParse(req.query);
        const paginationResult = await orderPaginationSchema.safeParse(req.query);
        if (!getResult.success || !paginationResult.success) {
            return res.status(400).json({
                success: false,
                message: {
                    ...(getResult.success ? {} : getResult.error.flatten().fieldErrors),
                    ...(paginationResult.success ? {} : paginationResult.error.flatten().fieldErrors),
                },
            });
        }

        const order = await orderService.getAllOrders(getResult.data, paginationResult.data);
        return res.status(order.statusCode).json({
            success: order.success,
            message: order.message,
            data: order.data,
        });
    } catch (error) {
        logger.error("❌ Something went wrong while executing get all orders controller: ", error);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

async function getAllOrdersByUserAuth(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing get all orders by user id controller..");
        const user = req.user as AuthJwtPayload;
        const paginationResult = await orderPaginationSchema.safeParse(req.query);
        if (!paginationResult.success) {
            return res.status(400).json({
                success: false,
                message: z.flattenError(paginationResult.error).fieldErrors,
            });
        }

        const order = await orderService.getAllOrdersByUserAuth(user, paginationResult.data);
        return res.status(order.statusCode).json({
            success: order.success,
            message: order.message,
            data: order.data,
        });
    } catch (error) {
        logger.error("❌ Something went wrong while executing get all orders by user id controller: ", error);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

async function updateOrderStatus(req: Request, res: Response) {
    try {
        logger.info("🆗 Executing update order status controller..");
        const userData = await orderGetUserIdSchema.safeParse(req.query);
        const statusResult = await orderUpdateStatusSchema.safeParse(req.query);
        if (!userData.success || !statusResult.success) {
            return res.status(400).json({
                success: false,
                message: {
                    ...(userData.success ? {} : userData.error.flatten().fieldErrors),
                    ...(statusResult.success ? {} : statusResult.error.flatten().fieldErrors),
                },
            });
        }

        const order = await orderService.updateOrderStatus(userData.data, statusResult.data);
        return res.status(order.statusCode).json({
            success: order.success,
            message: order.message,
            data: order.data,
        });
    } catch (error) {
        logger.error("❌ Something went wrong while executing update order status controller: ", error);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        });
    }
}

export const orderController = {
    createOrder,
    createOrderByUserId,
    getAllOrders,
    getAllOrdersByUserAuth,
    updateOrderStatus,
};

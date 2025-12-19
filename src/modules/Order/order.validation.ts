import z from "zod";
import { OrderStatus } from "../../generated/prisma/enums";

export const orderGetUserIdSchema = z.object({
    userId: z.string(),
});

export const orderPaginationSchema = z.object({
    limit: z.coerce.number().optional(),
    page: z.coerce.number().optional(),
});

export const orderGetUserIdOptionalSchema = z.object({
    userId: z.string().optional(),
});

export const orderUpdateStatusSchema = z.object({
    status: z.enum(OrderStatus),
});

export const orderSelect = {
    id: true,
    user: true,
    status: true,
    paymentMethod: true,
    purchasedProducts: true,
    totalAmount: true,
};

export type IOrderGetUserId = z.infer<typeof orderGetUserIdSchema>;
export type IOrderPagination = z.infer<typeof orderPaginationSchema>;
export type IOrderGetUserIdOptional = z.infer<typeof orderGetUserIdOptionalSchema>;
export type IOrderUpdateStatus = z.infer<typeof orderUpdateStatusSchema>;

import z from "zod";
import { OrderStatus } from "../../generated/prisma/enums";

export const createPurchasedProductSchema = z.object({
    userId: z.string(),
    productId: z.coerce.number(),
    quantityPurchased: z.coerce.number(),
});

export const createManyPurchasedProductSchema = z.array(createPurchasedProductSchema);

export const getPurchasedProductByIdSchema = z.object({
    id: z.string(),
});

export const getPurchasedProductByUserIdSchema = z.object({
    userId: z.string(),
});

export const getAllPurchasedProductSchema = z.object({
    userId: z.string().optional(),
    productId: z.coerce.number().optional(),
    status: z.enum(OrderStatus).optional(),
});

export const paginationPurchasedProductSchema = z.object({
    limit: z.coerce.number().optional(),
    page: z.coerce.number().optional(),
});

export const updateOrderIdPurchasedProductSchema = z.object({
    orderId: z.string(),
});

export const updatePurchasedProductStatusSchema = z.object({
    status: z.enum(OrderStatus),
});

export const purchasedProductSelect = {
    id: true,
    orderId: true,
    userId: true,
    product: true,
    quantityPurchased: true,
    pricePurchased: true,
    totalPrice: true,
    status: true,
};

export type IPurchasedProductCreate = z.infer<typeof createPurchasedProductSchema>;
export type IPurchasedProductCreateMany = z.infer<typeof createManyPurchasedProductSchema>;
export type IPurchasedProductGetById = z.infer<typeof getPurchasedProductByIdSchema>;
export type IPurchasedProductGetByUserId = z.infer<typeof getPurchasedProductByUserIdSchema>;
export type IPurchasedProductGetAll = z.infer<typeof getAllPurchasedProductSchema>;
export type IPurchasedProductPagination = z.infer<typeof paginationPurchasedProductSchema>;
export type IPurchasedProductUpdateOrderId = z.infer<typeof updateOrderIdPurchasedProductSchema>;
export type IPurchasedProductUpdateStatus = z.infer<typeof updatePurchasedProductStatusSchema>;

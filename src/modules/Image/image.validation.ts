import z from "zod";

export const getProductIdSchema = z.object({
    productId: z.coerce.number(),
});

export const getProductImageIdSchema = z.object({
    productImageId: z.coerce.string(),
});

export const userImageSelect = {
    id: true,
    mimetype: true,
    fileName: true,
    path: true,
    hashedBuffer: true,
    userId: true,
};

export const productImageSelect = {
    id: true,
    mimetype: true,
    fileName: true,
    path: true,
    hashedBuffer: true,
    productId: true,
    userId: true,
};

export type IGetProductId = z.infer<typeof getProductIdSchema>;
export type IGetProductImageId = z.infer<typeof getProductImageIdSchema>;

import z from "zod";

export const createProductSchema = z.object({
    name: z.string(),
    categoryId: z.coerce.number(),
    description: z.coerce.string().optional(),
    price: z.coerce.number(),
    costPrice: z.coerce.number().optional(),
    stockQuantity: z.coerce.number(),
    isAvailable: z.boolean(),
});

export const getProductIdSchema = z.object({
    id: z.string(),
});

export const getAllProductSchema = z.object({
    name: z.string().optional(),
    minPrice: z.coerce.number().optional(),
    maxPrice: z.coerce.number().optional(),
    categoryName: z.string().optional(),
    limit: z.coerce.number().optional(),
    page: z.coerce.number().optional(),
});

export const updateProductSchema = z.object({
    id: z.coerce.number(),
    name: z.coerce.string().optional(),
    categoryId: z.coerce.number().optional(),
    description: z.string().optional(),
    price: z.coerce.number().optional(),
    costPrice: z.coerce.number().optional(),
    stockQuantity: z.coerce.number().optional(),
    isAvailable: z.boolean().optional(),
});

export const changeProductStockSchema = z.object({
    id: z.coerce.number().int().positive(),
    stockQuantity: z.coerce.number().int().nonnegative(),
});

export const productSelect = {
    id: true,
    categoryId: true,
    description: true,
    price: true,
    costPrice: true,
    stockQuantity: true,
    isAvailable: true,
    images: true,
    isDeleted: true,
};

export type IProductCreate = z.infer<typeof createProductSchema>;
export type IProductGetId = z.infer<typeof getProductIdSchema>;
export type IProductGetAll = z.infer<typeof getAllProductSchema>;
export type IProductUpdate = z.infer<typeof updateProductSchema>;
export type IProductChangeStock = z.infer<typeof changeProductStockSchema>;

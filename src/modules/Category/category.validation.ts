import z from "zod";

export const createCategorySchema = z.object({
    name: z.string(),
});

export const getCategoryByIdSchema = z.object({
    id: z.string(),
});

export const getAllCategoriesSchema = z.object({
    name: z.string().optional(),
    limit: z.coerce.number().optional(),
    page: z.coerce.number().optional(),
});

export const updateCategorySchema = z.object({
    id: z.string(),
    name: z.string(),
});

export const deleteCategorySchema = z.object({
    id: z.string(),
});

export const restoreCategorySchema = z.object({
    id: z.string(),
});

export const categorySelect = {
    id: true,
    name: true,
    products: true,
    isDeleted: true,
};

export type ICategoryCreate = z.infer<typeof createCategorySchema>;
export type ICategoryGetById = z.infer<typeof getCategoryByIdSchema>;
export type ICategoryGetAll = z.infer<typeof getAllCategoriesSchema>;
export type ICategoryUpdate = z.infer<typeof updateCategorySchema>;
export type ICategoryDelete = z.infer<typeof deleteCategorySchema>;
export type ICategoryRestore = z.infer<typeof restoreCategorySchema>;

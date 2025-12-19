import z from "zod";

export const createAddressSchema = z.object({
    userId: z.string(),
    address1: z.string().min(5, "Minimum charaters -> 5").max(100, "Maximum characters -> 100"),
    address2: z.string().min(5, "Minimum charaters -> 5").max(100, "Maximum characters -> 100"),
    city: z.string().min(5, "Minimum charaters -> 5").max(100, "Maximum characters -> 100"),
    state: z.string().min(5, "Minimum charaters -> 5").max(100, "Maximum characters -> 100"),
    country: z.string().min(5, "Minimum charaters -> 5").max(100, "Maximum characters -> 100"),
    postalCode: z.string().min(5, "Minimum charaters -> 5").max(100, "Maximum characters -> 100"),
});

export const getAddressByUserIdAdminSchema = z.object({
    userId: z.string(),
});

export const getAllAddressesAdminSchema = z.object({
    address1: z.string().optional(),
    address2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional(),
    isDeleted: z.boolean().optional(),
    limit: z.coerce.number().optional(),
    page: z.coerce.number().optional(),
});

export const updateAddressAdminSchema = z.object({
    userId: z.string(),
    address1: z.string().optional(),
    address2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional(),
});

export const updateAddressUserSchema = z.object({
    address1: z.string().optional(),
    address2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional(),
});

export const deleteAddressAdminSchema = z.object({
    userId: z.string(),
});

export const restorAddressSchema = z.object({
    id: z.string(),
    userId: z.string(),
});

export const addressSelect = {
    id: true,
    userId: true,
    address1: true,
    address2: true,
    city: true,
    state: true,
    country: true,
    postalCode: true,
    isDeleted: true,
};

export type IAddressCreate = z.infer<typeof createAddressSchema>;
export type IAddressGetByUserIDAdmin = z.infer<typeof getAddressByUserIdAdminSchema>;
export type IAddressGetAllAdmin = z.infer<typeof getAllAddressesAdminSchema>;
export type IAddressUpdateAdmin = z.infer<typeof updateAddressAdminSchema>;
export type IAddressUpdateUser = z.infer<typeof updateAddressUserSchema>;
export type IAddressDeleteAdmin = z.infer<typeof deleteAddressAdminSchema>;
export type IAddressRestoreUser = z.infer<typeof restorAddressSchema>;

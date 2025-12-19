import z from "zod";
import { Role } from "../../generated/prisma/enums";

export const createUserSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.email(),
    password: z
        .string()
        .regex(/[A-Z]/, { error: "Must contain at least one uppercase letter" })
        .regex(/\d/, { error: "Must contain at least one number" })
        .regex(/[^A-Za-z0-9]/, { error: "Must contain at least one special character" }),
    role: z.enum(Role),
    isVerified: z.boolean(),
    phone: z.string().startsWith("+20").optional(),
});

export const getUserByIdAdminSchema = z.object({
    id: z.string(),
});

export const getUsersSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().optional(),
    role: z.string().optional(),
    isVerified: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
    limit: z.coerce.number().optional(),
    page: z.coerce.number().optional(),
});

export const updateUserAdminSchema = z.object({
    id: z.string(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().optional(),
    password: z
        .string()
        .regex(/[A-Z]/, { error: "Must contain at least one uppercase letter" })
        .regex(/\d/, { error: "Must contain at least one number" })
        .regex(/[^A-Za-z0-9]/, { error: "Must contain at least one special character" })
        .optional(),
    isVerified: z.boolean().optional(),
    phone: z.string().optional(),
    limit: z.coerce.number().optional(),
    page: z.coerce.number().optional(),
});

export const updateUserSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().optional(),
    password: z
        .string()
        .regex(/[A-Z]/, { error: "Must contain at least one uppercase letter" })
        .regex(/\d/, { error: "Must contain at least one number" })
        .regex(/[^A-Za-z0-9]/, { error: "Must contain at least one special character" })
        .optional(),
    isVerified: z.boolean().optional(),
    phone: z.string().optional(),
    limit: z.coerce.number().optional(),
    page: z.coerce.number().optional(),
});

export const deleteUserSchema = z.object({
    id: z.string(),
});

export const loginUserSchema = z.object({
    email: z.email(),
    password: z.string(),
});

export const restoreUserSchema = z.object({
    id: z.string(),
});

export const userSelect = {
    id: true,
    firstName: true,
    lastName: true,
    email: true,
    role: true,
    isVerified: true,
    phone: true,
    address: true,
    orders: true,
    purchasedProduct: true,
    token: true,
    isDeleted: true,
};

export type IUserCreate = z.infer<typeof createUserSchema>;
export type IUserGetUserById = z.infer<typeof getUserByIdAdminSchema>;
export type IUserGetUsers = z.infer<typeof getUsersSchema>;
export type IUserUpdateAdmin = z.infer<typeof updateUserAdminSchema>;
export type IUserUpdate = z.infer<typeof updateUserSchema>;
export type IUserDelete = z.infer<typeof deleteUserSchema>;
export type IUserLogin = z.infer<typeof loginUserSchema>;
export type IUserRestore = z.infer<typeof restoreUserSchema>;

import jwt from "jsonwebtoken";
import "dotenv/config";
import { Role, User } from "../generated/prisma/client";

export const generateToken = async (id: string, email: string, role: Role, isDeleted: boolean) => {
    const accessToken = jwt.sign(
        {
            userId: id,
            userEmail: email,
            userRole: role,
            isDeleted: isDeleted,
        },
        process.env.JWT_SECRET || "",
        { expiresIn: "120m" }
    );

    return accessToken;
};

module.exports = { generateToken };

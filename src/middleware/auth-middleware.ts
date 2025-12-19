import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../libs/prisma";
import { Role } from "../generated/prisma/enums";
import logger from "../libs/logger";
import "dotenv/config";

export async function authenticationMiddleware(req: Request, res: Response, next: NextFunction) {
    logger.info("Authentication middleware executed");
    const authHeader = req.headers.authorization ?? "";

    if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Invalid authorization header format.",
        });
    }

    const token = authHeader.substring(7); // remove "Bearer "

    try {
        const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
        const decodeToken = jwt.verify(token, JWT_SECRET) as {
            userId: string;
            userEmail: string;
            role: Role;
            isDeleted: boolean;
        };

        const user = await prisma.user.findUnique({
            where: { id: decodeToken.userId },
            select: { id: true, email: true, role: true, isDeleted: true },
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid token - user not found",
            });
        }

        req.user = {
            userId: user.id,
            email: user.email,
            role: user.role,
            isDeleted: user.isDeleted,
        };

        return next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                success: false,
                message: "Access denied.",
            });
        }

        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                status: "error",
                message: "Token expired",
            });
        }

        return res.status(500).json({
            status: "error",
            message: "Authentication failed",
        });
    }
}

export const authorize = (role: Role | Role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        logger.info("authorize middleware executed");
        try {
            const allowedRoles = Array.isArray(role) ? role : [role];
            if (!req.user) {
                return res.status(401).json({
                    status: "error",
                    message: "Authentication required",
                });
            }

            const userRole = req.user.role as Role;
            if (!allowedRoles.includes(userRole)) {
                logger.warn(
                    `Access denied for user ${
                        req.user.userId
                    } with role ${userRole}. Required roles: ${allowedRoles.join(", ")}`
                );
                return res.status(403).json({
                    status: "error",
                    message: "Insufficient permissions",
                    required_roles: Role,
                    user_role: userRole,
                });
            }
            const deletedUser = req.user.isDeleted as boolean;
            if (deletedUser) {
                logger.warn(`Access deined for user ${req.user.userId}, account already deleted.`);
                return res.status(403).json({
                    status: "error",
                    message: "Deleted account",
                });
            }
            return next();
        } catch (error) {
            logger.error("Authorization error:", error);
            return res.status(500).json({
                status: "error",
                message: "Authorization failed",
            });
        }
    };
};

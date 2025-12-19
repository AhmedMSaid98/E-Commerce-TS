import { Role } from "generated/prisma/enums";
import { JwtPayload } from "jsonwebtoken";

export {};
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                email: string;
                role: Role;
                isDeleted: boolean;
            };
        }
    }
}

export interface AuthJwtPayload extends JwtPayload {
    userId: string;
    email: string;
    role: Role;
    isDeleted: boolean;
}

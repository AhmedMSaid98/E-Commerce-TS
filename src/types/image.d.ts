import multer from "multer";

export {};
declare global {
    namespace Express {
        interface Request {
            filesData?: Express.Multer.File | Express.Multer.File[];
        }
    }
}

export interface SaveToDiskData {
    fullPath: string;
    fileName: string;
    mimetype: string;
}

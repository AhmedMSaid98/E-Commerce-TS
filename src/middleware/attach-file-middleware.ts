import { Request, Response, NextFunction } from "express";

export function attachFilesData() {
    return (req: Request, res: Response, next: NextFunction) => {
        const files = Array.isArray(req.files) ? req.files : req.file ? [req.file] : [];

        req.filesData = files;
        next();
    };
}

import multer from "multer";

export const imageFilter: multer.Options["fileFilter"] = (req, file, cb) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png"];

    if (!allowed.includes(file.mimetype)) {
        return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
    }
    cb(null, true);
};

export const uploadImage = multer({
    storage: multer.memoryStorage(), // we store in memory to manually save to disk later
    fileFilter: imageFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
        files: 10,
    },
});

export const pdfFilter: multer.Options["fileFilter"] = (req, file, cb) => {
    const allowed = ["application/pdf"];

    if (!allowed.includes(file.mimetype)) {
        return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
    }
    cb(null, true);
};

export const uploadPDF = multer({
    storage: multer.memoryStorage(), // we store in memory to manually save to disk later
    fileFilter: pdfFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
        files: 10,
    },
});

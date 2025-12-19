import logger from "../../libs/logger";
import { AuthJwtPayload } from "../../types/auth";
import { ProductImageModel, UserImageModel } from "../../types/models";
import { deleteFromDisk } from "../../utils/HelperFunctions/FileDeleteFromDisk";
import { saveMultiToDisk } from "../../utils/HelperFunctions/FileSaveMultiToDisk";
import { saveToDisk } from "../../utils/HelperFunctions/FileSaveToDisk";
import { checkForeignKey } from "../../utils/HelperFunctions/GenericCheckForeignKey";
import { genericCountService } from "../../utils/HelperFunctions/GenericCountService";
import { genericCreateManyService } from "../../utils/HelperFunctions/GenericCreateManyService";
import { genericCreateService } from "../../utils/HelperFunctions/GenericCreateService";
import { genericDeleteManyService } from "../../utils/HelperFunctions/GenericDeleteManyService";
import { genericDeleteService } from "../../utils/HelperFunctions/GenericDeleteService";
import { genericGetAllService } from "../../utils/HelperFunctions/GenericGetAllService";
import { genericGetByConstrain } from "../../utils/HelperFunctions/GenericGetByConstrain";
import { genericUpdateService } from "../../utils/HelperFunctions/GenericUpdateService";
import resTransformer from "../../utils/response/res-transformer";
import { userSelect } from "../User/user.validation";
import { productImageSelect, userImageSelect } from "./image.validation";
import crypto from "crypto";

async function uploadUserImage(authUser: AuthJwtPayload, image: Express.Multer.File) {
    try {
        logger.info("🆗 Executing upload user image service..");
        const userId = authUser.userId;
        const { buffer, mimetype, originalname } = image;
        const hashedBuffer = crypto.createHash("sha256").update(buffer).digest("hex");
        const imageWhere = { hashedBuffer: hashedBuffer, userId: userId };

        const userExists = await genericGetByConstrain(
            "user",
            { id: userId },
            userSelect,
            `User with id: ${userId} not found`,
            `User with id: ${userId} found successfully`
        );
        if (!userExists.success) {
            return userExists;
        }

        const userImageExists = await genericGetByConstrain(
            "userImage",
            { userId: userId },
            userImageSelect,
            `User image with user id: ${userId} not found`,
            `User image with user id: ${userId} already exists`
        );
        if (userImageExists.success) {
            userImageExists.statusCode = 201;
            return userImageExists;
        }

        const saveImageDisk = await saveToDisk(authUser.role, userId, mimetype, originalname, buffer);
        if (!saveImageDisk.success || !saveImageDisk.data) {
            return saveImageDisk;
        }

        const data = {
            mimetype,
            fileName: saveImageDisk.data.fileName,
            path: saveImageDisk.data.fullPath,
            hashedBuffer,
            userId,
        };

        const imageExists = await genericGetByConstrain(
            "userImage",
            imageWhere,
            userImageSelect,
            `Image not found`,
            `Image already exists`
        );
        if (imageExists.success) {
            return imageExists;
        }
        const saveImageDb = await genericCreateService(
            "userImage",
            data,
            userImageSelect,
            `Something went wrong while creating image`,
            `Image created successfully`
        );
        return saveImageDb;
    } catch (error) {
        logger.error("❌ Something went wrong while executing upload user image service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function getUserImage(authUser: AuthJwtPayload) {
    try {
        logger.info("🆗 Executing get user image service..");
        const userId = authUser.userId;
        const image = await genericGetByConstrain(
            "userImage",
            { userId: userId },
            userImageSelect,
            `User image with id: ${userId} not found`,
            `User image with id: ${userId} found succefully`
        );
        return image;
    } catch (error) {
        logger.error("❌ Something went wrong while executing get user image service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function updateUserImage(authUser: AuthJwtPayload, image: Express.Multer.File) {
    try {
        logger.info("🆗 Executing update user image service..");
        const userId = authUser.userId;
        const { buffer, originalname, mimetype } = image;
        const imageExists = await genericGetByConstrain<"userImage", UserImageModel>(
            "userImage",
            { userId: userId },
            userImageSelect,
            `User image with id: ${userId} not found`,
            `User image with id: ${userId} found succefully`
        );
        if (!imageExists.success || !imageExists.data) {
            return imageExists;
        }

        const newImage = await saveToDisk(authUser.role, userId, mimetype, originalname, buffer);
        if (!newImage.success || !newImage.data) {
            return newImage;
        }
        const hashedBuffer = crypto.createHash("sha256").update(buffer).digest("hex");
        const imageWhere = { userId: userId };
        const updateImage = await genericUpdateService<"userImage", UserImageModel>(
            "userImage",
            {
                hashedBuffer: hashedBuffer,
                fileName: originalname,
                path: newImage.data.fullPath,
                mimetype,
            },
            imageWhere,
            imageWhere,
            userImageSelect,
            `Image not found`,
            `No changes occured on image`,
            `Unique constrain already exists`,
            `Something went wrong while updating image`,
            `Image updated succefully`
        );
        if (!updateImage.success) {
            return updateImage;
        }

        const oldImage = await deleteFromDisk(authUser.role, userId, imageExists.data.fileName);
        if (!oldImage.success) {
            return oldImage;
        }

        return updateImage;
    } catch (error) {
        logger.error("❌ Something went wrong while executing update user image service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function deleteUserImage(authUser: AuthJwtPayload) {
    try {
        logger.info("🆗 Executing delete user image service..");
        const userId = authUser.userId;
        const imageExists = await genericGetByConstrain<"userImage", UserImageModel>(
            "userImage",
            { userId: userId },
            userImageSelect,
            `Image for user id: ${userId} not found`,
            `Image for user id: ${userId} found successfully`
        );
        if (!imageExists.success || !imageExists.data) {
            return imageExists;
        }

        const deleteImage = await deleteFromDisk(authUser.role, userId, imageExists.data.fileName);
        if (!deleteImage.success) {
            return deleteImage;
        }

        const deteteFromDb = await genericDeleteService(
            "userImage",
            { userId: userId },
            userImageSelect,
            `Image for user id: ${userId} not found`,
            `Something went wrong while deleteing user image`,
            `User image with id: ${userId} deleted succefully`
        );
        return deteteFromDb;
    } catch (error) {
        logger.error("❌ Something went wrong while executing delete user image service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function uploadProductImages(
    authUser: AuthJwtPayload,
    images: Express.Multer.File[],
    productId: number
) {
    try {
        logger.info("🆗 Executing upload product images service..");
        const userId = authUser.userId;
        const role = authUser.role;
        const uploadedFiles = images;

        const checkFK1 = await checkForeignKey(
            { productId: productId },
            { productId: { model: "product", resMessage: "product id not found" } }
        );
        if (!checkFK1.success) {
            return checkFK1;
        }

        const imagesCount = await genericCountService<"productImage">("productImage", {
            productId: productId,
        });

        if (imagesCount + images.length > 5) {
            return resTransformer<ProductImageModel>(
                false,
                400,
                "Max images per product are 5",
                "Max images per product are 5"
            );
        }

        const hashedImages = uploadedFiles.map((file) => ({
            hashedBuffer: crypto.createHash("sha256").update(file.buffer).digest("hex"),
        }));

        const hashes = hashedImages.map((img) => img.hashedBuffer);

        const allWhere = {
            productId,
            hashedBuffer: hashes.length === 1 ? hashes[0] : { in: hashes },
        };

        const imageList = await genericGetAllService<"productImage", ProductImageModel>(
            "productImage",
            allWhere,
            productImageSelect,
            `Product image not found`,
            `Product images found succefully`
        );
        if (imageList.success) {
            return resTransformer(
                false,
                400,
                "One or more images already exist for this product",
                "Duplicate images detected",
                imageList.data
            );
        }

        const diskResult = await saveMultiToDisk(role, userId, uploadedFiles);
        if (!diskResult.success || !diskResult.data) {
            return diskResult;
        }

        const createData = diskResult.data.map((diskImage, index) => ({
            productId,
            userId,
            fileName: diskImage.fileName,
            path: diskImage.fullPath,
            mimetype: diskImage.mimetype,
            hashedBuffer: hashedImages[index]?.hashedBuffer,
        }));

        const createImages = await genericCreateManyService<"productImage", ProductImageModel>(
            "productImage",
            { productId: productId, hashedBuffer: { in: hashes } },
            createData,
            productImageSelect,
            `Image not found`,
            `Unique image already exists`,
            `Something went wrong while creating images`,
            `One or more duplicate found`,
            `Images created succefully`
        );
        return createImages;
    } catch (error) {
        logger.error("❌ Something went wrong while executing upload product images service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function getProductImages(authUser: AuthJwtPayload, productId: number) {
    try {
        logger.info("🆗 Executing get product images service..");
        const userId = authUser.userId;
        const whereQuery = { productId: productId };
        const imageList = await genericGetAllService<"productImage", ProductImageModel>(
            "productImage",
            whereQuery,
            productImageSelect,
            `Images with product id: ${productId} not found by user id: ${userId}`,
            `Images with product id: ${productId} found succefully by user id: ${userId}`
        );
        return imageList;
    } catch (error) {
        logger.error("❌ Something went wrong while executing get product images service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function deleteProductImages(authUser: AuthJwtPayload, productId: number) {
    try {
        logger.info("🆗 Executing delete product images service..");
        const userId = authUser.userId;
        const productImageExists = await genericGetByConstrain<"productImage", ProductImageModel>(
            "productImage",
            { productId: productId },
            productImageSelect,
            `Product image with product id: ${productId} not found by user id: ${userId}`,
            `Product image with id: ${productId} found succefully by user id: ${userId}`
        );
        if (!productImageExists.success) {
            return productImageExists;
        }

        const deletedImages = await genericDeleteManyService<"productImage">(
            "productImage",
            { productId: productId },
            `Something went wrong while delete images for product id: ${productId} by user id: ${userId}`,
            `Images for product id: ${productId} deleted succefully by user id: ${userId}`
        );
        return deletedImages;
    } catch (error) {
        logger.error("❌ Something went wrong while executing delete product images service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function deleteProductImage(authUser: AuthJwtPayload, productImageId: string) {
    try {
        logger.info("🆗 Executing delete product images service..");
        const userId = authUser.userId;
        const deletedImage = await genericDeleteService<"productImage", ProductImageModel>(
            "productImage",
            {
                id: productImageId,
            },
            productImageSelect,
            `Product image not found`,
            `Something went wrong while deleting product image`,
            `Product image deleted succefully`
        );
        return deletedImage;
    } catch (error) {
        logger.error("❌ Something went wrong while executing delete product images service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

export const imageService = {
    uploadUserImage,
    getUserImage,
    updateUserImage,
    deleteUserImage,
    uploadProductImages,
    getProductImages,
    deleteProductImages,
    deleteProductImage,
};

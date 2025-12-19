import { Router } from "express";
import { uploadImage } from "../../libs/multer-upload";
import { attachFilesData } from "../../middleware/attach-file-middleware";
import { imageController } from "./image.controller";
import { authenticationMiddleware, authorize } from "../../middleware/auth-middleware";

const router = Router();

router.use(authenticationMiddleware);

router.post(
    "/upload-user-image",
    uploadImage.single("image"),
    authorize(["ADMIN", "USER"]),
    imageController.uploadUserImage
);
router.get("/get-user-image", authorize(["ADMIN", "USER"]), imageController.getUserImage);
router.patch(
    "/update-user-image",
    uploadImage.single("image"),
    authorize(["ADMIN", "USER"]),
    imageController.updateUserImage
);
router.delete("/delete-user-image", authorize(["ADMIN", "USER"]), imageController.deleteUserImage);
router.post(
    "/upload-products-images",
    authorize("ADMIN"),
    uploadImage.array("images", 5),
    imageController.uploadProductImages
);
router.get("/get-product-images", authorize(["ADMIN", "USER"]), imageController.getProductImages);
router.delete("/delete-product-images", authorize("ADMIN"), imageController.deleteProductImages);
router.delete("/delete-product-image", authorize("ADMIN"), imageController.deleteProductImage);

export const imageRouter = router;

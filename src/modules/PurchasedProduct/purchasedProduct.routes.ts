import { Router } from "express";
import { purchasedProductController } from "./purchasedProduct.controller";
import { authenticationMiddleware, authorize } from "../../middleware/auth-middleware";

const router = Router();

router.use(authenticationMiddleware);

router.post(
    "/create-purchased-product",
    authorize(["ADMIN"]),
    purchasedProductController.createPurchasedProduct
);
router.post(
    "/create-many-purchased-product",
    authorize(["ADMIN"]),
    purchasedProductController.createManyPurchasedProduct
);
router.get(
    "/get-all-user-purchased-product",
    authorize(["ADMIN", "USER"]),
    purchasedProductController.getAllPurchasedProductByUserId
);
router.get(
    "/get-purchased-product-by-id",
    authorize(["ADMIN"]),
    purchasedProductController.getPurchasedProductById
);
router.get(
    "/get-all-purchased-product",
    authorize(["ADMIN"]),
    purchasedProductController.getAllPurchasedProduct
);
router.patch(
    "/update-orderId-purchased-product",
    authorize(["ADMIN"]),
    purchasedProductController.updateOrderIdPurchasedProduct
);
router.patch(
    "/update-purchased-product-status",
    authorize(["ADMIN"]),
    purchasedProductController.updatePurchasedProductStatus
);
router.delete(
    "/delete-purchased-product",
    authorize(["ADMIN"]),
    purchasedProductController.deletePurchasedProduct
);
router.patch(
    "/soft-delete-purchased-product",
    authorize(["ADMIN"]),
    purchasedProductController.softDeletePurchasedProduct
);
router.patch(
    "/restore-purchased-product",
    authorize(["ADMIN"]),
    purchasedProductController.restorePurchasedProduct
);
export const purchasedProductRouter = router;

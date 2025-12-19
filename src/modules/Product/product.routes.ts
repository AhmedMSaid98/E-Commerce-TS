import { Router } from "express";
import { productController } from "./product.controller";
import { authenticationMiddleware } from "../../middleware/auth-middleware";

const router = Router();

router.use(authenticationMiddleware);

router.post("/create-product", productController.createProduct);
router.get("/get-product", productController.getProductById);
router.get("/get-products", productController.getAllProducts);
router.patch("/update-product", productController.updateProduct);
router.patch("/change-product-stock", productController.changeProductStock);
router.delete("/delete-product", productController.deleteProduct);
router.patch("/soft-delete-product", productController.softDeleteProduct);
router.patch("/restore-product", productController.restoreProduct);

export const productRouter = router;

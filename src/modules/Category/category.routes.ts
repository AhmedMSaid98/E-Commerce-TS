import { Router } from "express";
import { authenticationMiddleware, authorize } from "../../middleware/auth-middleware";
import { categoryController } from "./category.controller";

const router = Router();

router.use(authenticationMiddleware);

router.post("/create-category", authorize(["ADMIN"]), categoryController.createCategory);
router.get("/get-category", authorize(["ADMIN", "USER"]), categoryController.getCategoryById);
router.get("/get-categories", authorize(["ADMIN"]), categoryController.getAllCategories);
router.patch("/update-category", authorize(["ADMIN"]), categoryController.updateCategory);
router.delete("/delete-category", authorize(["ADMIN"]), categoryController.deleteCategory);
router.patch("/soft-delete-category", authorize(["ADMIN"]), categoryController.softDeleteCategory);
router.patch("/restore-category", authorize(["ADMIN"]), categoryController.restoreCategory);

export const categoryRouter = router;

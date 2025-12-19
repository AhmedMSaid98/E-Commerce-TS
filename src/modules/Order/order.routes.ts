import { Router } from "express";
import { authenticationMiddleware, authorize } from "../../middleware/auth-middleware";
import { orderController } from "./order.controller";

const router = Router();

router.use(authenticationMiddleware);

router.post("/create-order", authorize(["USER"]), orderController.createOrder);
router.post("/create-order-by-userId", authorize(["ADMIN"]), orderController.createOrderByUserId);
router.get("/get-orders", authorize(["ADMIN"]), orderController.getAllOrders);
router.get("/get-orders-by-userAuth", authorize(["USER"]), orderController.getAllOrdersByUserAuth);
router.patch("/update-order-status", authorize(["ADMIN"]), orderController.updateOrderStatus);

export const orderRouter = router;

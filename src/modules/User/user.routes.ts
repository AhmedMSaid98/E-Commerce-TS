import { Router } from "express";
import { userController } from "./user.controller";
import { authenticationMiddleware, authorize } from "../../middleware/auth-middleware";

const router = Router();

router.get("/get-user", authenticationMiddleware, authorize("ADMIN"), userController.getUserByIdAdmin);
router.get("/get-users", authenticationMiddleware, authorize("ADMIN"), userController.getAllUsers);
router.patch(
    "/update-user/admin",
    authenticationMiddleware,
    authorize("ADMIN"),
    userController.updateUserAdmin
);
router.delete("/delete-user", authenticationMiddleware, authorize("ADMIN"), userController.deleteUser);
router.post("/register-user", userController.createUser);
router.post("/login", userController.loginUser);
router.get("/get-user-profile", authenticationMiddleware, userController.getUserProfile);
router.patch("/update-user", authenticationMiddleware, authorize("USER"), userController.updateUser);
router.patch(
    "/soft-delete-user",
    authenticationMiddleware,
    authorize(["ADMIN", "USER"]),
    userController.softDeleteUser
);
router.patch("/restore-user", authenticationMiddleware, authorize("ADMIN"), userController.restoreUser);

export const userRouter = router;

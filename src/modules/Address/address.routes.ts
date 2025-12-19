import { Router } from "express";
import { addressController } from "./address.controller";
import { authenticationMiddleware, authorize } from "../../middleware/auth-middleware";

const router = Router();

router.use(authenticationMiddleware);
router.post(
    "/create-address",

    authorize(["ADMIN", "USER"]),
    addressController.createAddress
);
router.get(
    "/get-address/admin",

    authorize("ADMIN"),
    addressController.getAddressByUserIdAdmin
);
router.get(
    "/get-addresses/admin",

    authorize("ADMIN"),
    addressController.getAllAddressesAdmin
);
router.patch(
    "/update-address/admin",

    authorize("ADMIN"),
    addressController.updateAddressAdmin
);
router.delete(
    "/delete-address/admin",

    authorize("ADMIN"),
    addressController.deleteAddressAdmin
);
router.patch(
    "/restore-address",

    authorize("ADMIN"),
    addressController.restoreAddressUser
);
router.get("/get-address", authorize("USER"), addressController.getAddressUser);
router.patch(
    "/update-address",

    authorize("USER"),
    addressController.updateAddressUser
);
router.patch(
    "/soft-delete-address",

    authorize("USER"),
    addressController.softDelteAddressUser
);

export const addressRouter = router;

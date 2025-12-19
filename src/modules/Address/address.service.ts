import {
    IAddressCreate,
    IAddressDeleteAdmin,
    IAddressGetAllAdmin,
    IAddressGetByUserIDAdmin,
    IAddressRestoreUser,
    IAddressUpdateAdmin,
    IAddressUpdateUser,
    addressSelect,
} from "./address.validation";
import logger from "../../libs/logger";
import { genericCreateService } from "../../utils/HelperFunctions/GenericCreateService";
import { genericGetByConstrain } from "../../utils/HelperFunctions/GenericGetByConstrain";
import { genericGetAllService } from "../../utils/HelperFunctions/GenericGetAllService";
import { genericUpdateService } from "../../utils/HelperFunctions/GenericUpdateService";
import { genericDeleteService } from "../../utils/HelperFunctions/GenericDeleteService";
import { userSelect } from "../User/user.validation";
import { AuthJwtPayload } from "../../types/auth";
import { Address, Prisma } from "../../generated/prisma/client";
import resTransformer from "../../utils/response/res-transformer";
import { AddressModel, UserModel } from "../../types/models";
import { genericSoftDeleteService } from "../../utils/HelperFunctions/GenericSoftDeleteService";
import { checkForeignKey } from "../../utils/HelperFunctions/GenericCheckForeignKey";

async function createAddress(data: IAddressCreate) {
    try {
        logger.info("🆗 Executing create address service..");
        const constrainExists = await genericGetByConstrain<"address", AddressModel>(
            "address",
            {
                userId: data.userId,
            },
            addressSelect,
            `Address not found`,
            `Address already exists`
        );
        if (constrainExists.success) {
            return constrainExists;
        }
        const createAddress = await genericCreateService<"address", AddressModel>(
            "address",
            data,
            addressSelect,
            `Something went wrong while creating address with user ID: ${data.userId}`,
            `Address created succefully for user ID: ${data.userId}`
        );

        return createAddress;
    } catch (error) {
        logger.error("❌ Something went wrong while executing create address service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function getAddressByUserIdAdmin(data: IAddressGetByUserIDAdmin) {
    try {
        logger.info("🆗 Executing get address by user id service..");
        const address = await genericGetByConstrain<"address", AddressModel>(
            "address",
            data,
            addressSelect,
            `Address not found for user ID: ${data.userId}`,
            `Address found succefully for user ID: ${data.userId}`
        );
        return address;
    } catch (error) {
        logger.error("❌ Something went wrong while executing get address by user id service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function getAllAddressesAdmin(data: IAddressGetAllAdmin) {
    try {
        logger.info("🆗 Executing get all addresses service..");
        const addressList = await genericGetAllService<"address", AddressModel>(
            "address",
            {
                address1: { contains: data.address1 },
                address2: { contains: data.address2 },
                city: { contains: data.city },
                state: { contains: data.state },
                country: { contains: data.country },
                postalCode: { contains: data.postalCode },
                isDeleted: data.isDeleted,
            },
            addressSelect,
            "Address not found",
            "Address list found succefully",
            data.limit,
            data.page
        );

        return addressList;
    } catch (error) {
        logger.error("❌ Something went wrong while executing get all addresses service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function updateAddressAdmin(data: IAddressUpdateAdmin) {
    try {
        logger.info("🆗 Executing update address service..");
        const checkFK = await checkForeignKey<UserModel>(data, {
            userId: { model: "user", resMessage: "User id not found" },
        });
        if (!checkFK.success) {
            return checkFK;
        }

        const addressUpdate = await genericUpdateService<"address", AddressModel>(
            "address",
            data,
            { userId: data.userId },
            { userId: data.userId },
            addressSelect,
            `Address not found for user id: ${data.userId}`,
            `No changes found on address with id: ${data.userId}`,
            `Unique constrian with id: ${data} already exists`,
            "Something went wrong while updating address",
            `Address with id: ${data.userId} updated succefully`
        );

        return addressUpdate;
    } catch (error) {
        logger.error("❌ Something went wrong while executing update address service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function deleteAddressAdmin(data: IAddressDeleteAdmin) {
    try {
        logger.info("🆗 Executing delete address service..");
        const addressDelete = await genericDeleteService<"address", AddressModel>(
            "address",
            { userId: data.userId },
            addressSelect,
            `Address with user id: ${data.userId} not found`,
            "Something went wrong while deleteing address",
            `Address with user id: ${data.userId} permanently deleted succefully`
        );
        return addressDelete;
    } catch (error) {
        logger.error("❌ Something went wrong while executing delete address service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function getAddressUser(authUser: AuthJwtPayload) {
    try {
        logger.info("🆗 Executing get address by user id service..");
        const user = await genericGetByConstrain<"address", AddressModel>(
            "address",
            { userId: authUser.userId },
            addressSelect,
            `Address not found for user id: ${authUser.userId}`,
            `Address found succefully for user id: ${authUser.userId}`
        );
        return user;
    } catch (error) {
        logger.error("❌ Something went wrong while executing get address by user id service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function updateAddressUser(authUser: AuthJwtPayload, data: IAddressUpdateUser) {
    try {
        logger.info("🆗 Executing update address by auth service..");
        const whereQuery = { userId: authUser.userId };
        const updateAddress = await genericUpdateService<"address", AddressModel>(
            "address",
            data,
            whereQuery,
            whereQuery,
            addressSelect,
            `Address with user id: ${authUser.userId} not found`,
            `No changes occured on address with user id: ${authUser.userId}`,
            `Unique constrains ${data} already exists`,
            `Something went wrong while updating address with user id: ${authUser.userId}`,
            `Address with user id: ${authUser.userId} updated succefully`
        );
        return updateAddress;
    } catch (error) {
        logger.error("❌ Something went wrong while executing update address by auth service: ", error);
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function softDeleteAddressUser(authUser: AuthJwtPayload) {
    try {
        logger.info("🆗 Executing soft delete address by user id service..");
        const whereQuery = { userId: authUser.userId };
        const softDeleteAddress = await genericSoftDeleteService<"address", AddressModel>(
            "address",
            { isDeleted: true },
            whereQuery,
            addressSelect,
            `Address not found with user id: ${authUser.userId}`,
            `No changes occured on address with user id: ${authUser.userId}`,
            `Something went wrong while deleting address with user id: ${authUser.userId}`,
            `Unique constrain already exists`,
            `Address with user id: ${authUser.userId} deleted succefully`
        );
        return softDeleteAddress;
    } catch (error) {
        logger.error(
            "❌ Something went wrong while executing soft delete address by user id service: ",
            error
        );
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

async function restoreAddressUser(data: IAddressRestoreUser) {
    try {
        logger.info("🆗 Executing soft delete address by user id service..");
        const checkFK = await checkForeignKey(data, {
            userId: { model: "user", resMessage: "User id not found" },
        });
        if (!checkFK.success) {
            return checkFK;
        }
        const restoreAddress = await genericUpdateService<"address", AddressModel>(
            "address",
            { isDeleted: false },
            data,
            data,
            addressSelect,
            `Address not found with user id: ${data.id}`,
            `No changes occured on address with user id: ${data.id}`,
            `Somrhing went wrong while restoring address with user id: ${data.id}`,
            `Unique constrains already exists`,
            `Address with user id: ${data.id} restored succefully`
        );
        return restoreAddress;
    } catch (error) {
        logger.error(
            "❌ Something went wrong while executing soft delete address by user id service: ",
            error
        );
        return {
            success: false,
            statusCode: 500,
            message: `Internal server error: ${error}`,
            data: null,
        };
    }
}

export const addressService = {
    createAddress,
    getAddressByUserIdAdmin,
    getAllAddressesAdmin,
    updateAddressAdmin,
    deleteAddressAdmin,
    getAddressUser,
    updateAddressUser,
    softDeleteAddressUser,
    restoreAddressUser,
};

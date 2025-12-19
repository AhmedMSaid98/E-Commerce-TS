import { Address, Order, Product, PurchasedProduct } from "../generated/prisma/client";
import { OrderStatus, PaymentMethod, Role } from "../generated/prisma/enums";

type UserModel = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
    isVerified: boolean;
    phone: string;
    address: Address;
    orders: Order[];
    purchasedProduct: PurchasedProduct[];
    token: string;
    isDeleted: boolean;
};

type AddressModel = {
    id: string;
    userId: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    isDeleted: boolean;
};

type ProductModel = {
    id: number;
    name: string;
    sku: string;
    categoryId: number;
    description: string;
    price: number;
    costPrice: number;
    stockQuantity: number;
    isAvailable: boolean;
    images: string[];
    isDeleted: boolean;
};

type CategoryModel = {
    id: number;
    name: string;
    products: Product[];
    isDeleted: boolean;
};

type OrderModel = {
    id: string;
    userId: string;
    status: OrderStatus;
    paymentMethod: PaymentMethod;
    purchasedProducts: PurchasedProduct[];
    shippingAddressId: string;
    totalAmount: number;
    isDeleted: boolean;
};

type PurchasedProductModel = {
    id: string;
    orderId: string;
    userId: string;
    productId: number;
    productName: string;
    quantityPurchased: number;
    pricePurchase: number;
    totalPrice: number;
    isDeleted: boolean;
};

type ProductImageModel = {
    id: string;
    mimetype: string;
    fileName: string;
    path: string;
    hashedBuffer: string;
    productId: string;
    userId: string;
};

type UserImageModel = {
    id: string;
    mimetype: string;
    fileName: string;
    path: string;
    hashedBuffer: string;
    userId: string;
};

import express from "express";
import logger from "./libs/logger";
import { addressRouter } from "./modules/Address/address.routes";
import { userRouter } from "./modules/User/user.routes";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import "dotenv/config";
import { categoryRouter } from "./modules/Category/category.routes";
import { imageRouter } from "./modules/Image/image.routes";
import { productRouter } from "./modules/Product/product.routes";
import { purchasedProductRouter } from "./modules/PurchasedProduct/purchasedProduct.routes";
import { orderRouter } from "./modules/Order/order.routes";

const app = express();
const PORT = process.env.PORT || 4005;
const HOST = process.env.HOST || "localhost:";
const PROTOCOL = process.env.PROTOCOL || "http://";

app.use(express.json());

// swagger
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "E-Commerce",
            version: "1.0.0",
            description: "--------------",
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
        servers: [{ url: `${process.env.PROTOCOL}${process.env.HOST}${process.env.PORT}` }],
    },
    apis: ["./src/utils/swagger/*.ts"],
};

const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use("/ecommerce-address", addressRouter);
app.use("/ecommerce-user", userRouter);
app.use("/ecommerce-category", categoryRouter);
app.use("/ecommerce-image", imageRouter);
app.use("/ecommerce-product", productRouter);
app.use("/ecommerce-purchased-product", purchasedProductRouter);
app.use("/ecommerce-order", orderRouter);

app.listen(PORT, () => {
    logger.info(`🚀 Server is now running on: ${PROTOCOL}${HOST}${PORT}`);
    logger.info(`🚀 Swagger: http://localhost:4000/api-docs`);
});

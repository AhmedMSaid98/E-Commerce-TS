/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: string
 *       enum:
 *         - USER
 *         - ADMIN
 *
 *     PaymentMethod:
 *       type: string
 *       enum:
 *         - CASH
 *
 *     OrderStatus:
 *       type: string
 *       enum:
 *         - PENDING
 *         - CONFIRMED
 *         - SHIPPED
 *         - DELIVERED
 *         - CANCELLED
 *
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         role:
 *           $ref: '#/components/schemas/Role'
 *         isVerified:
 *           type: boolean
 *         phone:
 *           type: string
 *           nullable: true
 *         address:
 *           $ref: '#/components/schemas/Address'
 *         orders:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Order'
 *         purchasedProduct:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PurchasedProduct'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     Address:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: string
 *         Address1:
 *           type: string
 *         Address2:
 *           type: string
 *           nullable: true
 *         city:
 *           type: string
 *         state:
 *           type: string
 *           nullable: true
 *         country:
 *           type: string
 *         postalCode:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         order:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Order'
 *
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: string
 *         status:
 *           $ref: '#/components/schemas/OrderStatus'
 *         paymentMethod:
 *           $ref: '#/components/schemas/PaymentMethod'
 *         purchasedProducts:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PurchasedProduct'
 *         shippingAddressId:
 *           type: string
 *           nullable: true
 *         shippingAddress:
 *           $ref: '#/components/schemas/Address'
 *         totalAmount:
 *           type: number
 *           format: float
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         sku:
 *           type: string
 *           nullable: true
 *         categoryId:
 *           type: integer
 *         category:
 *           $ref: '#/components/schemas/Category'
 *         description:
 *           type: string
 *           nullable: true
 *         price:
 *           type: number
 *           format: float
 *         costPrice:
 *           type: number
 *           format: float
 *           nullable: true
 *         stockQuantity:
 *           type: integer
 *         isAvailable:
 *           type: boolean
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         purchasedProducts:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PurchasedProduct'
 *
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
 *
 *     PurchasedProduct:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         orderId:
 *           type: string
 *           nullable: true
 *         userId:
 *           type: string
 *         productId:
 *           type: integer
 *         productName:
 *           type: string
 *         quantityPurchased:
 *           type: integer
 *         pricePurchased:
 *           type: number
 *           format: float
 *         totalPrice:
 *           type: number
 *           format: float
 *         createdAt:
 *           type: string
 *           format: date-time
 */

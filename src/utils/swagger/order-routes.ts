/**
 * @swagger
 * tags:
 *   name: Order
 *   description: Order management API
 */

/**
 * @swagger
 * /ecommerce-order/create-order:
 *   post:
 *     summary: Create an order from authenticated user's pending purchased products
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order created
 */

/**
 * @swagger
 * /ecommerce-order/create-order-by-user-id:
 *   post:
 *     summary: Create an order for a user id (admin)
 *     tags: [Order]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Order created for user
 */

/**
 * @swagger
 * /ecommerce-order/get-orders:
 *   get:
 *     summary: Get orders (optional user filter)
 *     tags: [Order]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order list
 */

/**
 * @swagger
 * /ecommerce-order/get-orders-auth:
 *   get:
 *     summary: Get orders for authenticated user
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order list for auth user
 */

/**
 * @swagger
 * /ecommerce-order/update-order-status:
 *   patch:
 *     summary: Update order status for a user's orders
 *     tags: [Order]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/OrderStatus'
 *     responses:
 *       200:
 *         description: Order status updated
 */

/**
 * @swagger
 * tags:
 *   name: PurchasedProduct
 *   description: Purchased products / cart API
 */

/**
 * @swagger
 * /ecommerce-purchased-product/create-purchased-product:
 *   post:
 *     summary: Add a purchased product (add to cart)
 *     tags: [PurchasedProduct]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               productId:
 *                 type: integer
 *               quantityPurchased:
 *                 type: integer
 *             required:
 *               - userId
 *               - productId
 *               - quantityPurchased
 *     responses:
 *       201:
 *         description: Purchased product created
 */

/**
 * @swagger
 * /ecommerce-purchased-product/create-many-purchased-product:
 *   post:
 *     summary: Add multiple purchased products
 *     tags: [PurchasedProduct]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                 productId:
 *                   type: integer
 *                 quantityPurchased:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Purchased products created
 */

/**
 * @swagger
 * /ecommerce-purchased-product/get-purchased-product:
 *   get:
 *     summary: Get purchased product by id
 *     tags: [PurchasedProduct]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Purchased product found
 */

/**
 * @swagger
 * /ecommerce-purchased-product/get-purchased-products:
 *   get:
 *     summary: Get purchased products with filters
 *     tags: [PurchasedProduct]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *       - in: query
 *         name: productId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           $ref: '#/components/schemas/OrderStatus'
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
 *         description: Purchased product list
 */

/**
 * @swagger
 * /ecommerce-purchased-product/get-purchased-product-by-user:
 *   get:
 *     summary: Get purchased products by user with pagination
 *     tags: [PurchasedProduct]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
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
 *         description: Purchased products for user
 */

/**
 * @swagger
 * /ecommerce-purchased-product/update-order-id:
 *   patch:
 *     summary: Attach order id to pending purchased products for a user
 *     tags: [PurchasedProduct]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Purchased products updated with order id
 */

/**
 * @swagger
 * /ecommerce-purchased-product/update-purchased-product-status:
 *   patch:
 *     summary: Update status of purchased products (cancel/order lifecycle)
 *     tags: [PurchasedProduct]
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
 *         description: Purchased products status updated
 */

/**
 * @swagger
 * /ecommerce-purchased-product/delete-purchased-product:
 *   delete:
 *     summary: Delete a purchased product permanently
 *     tags: [PurchasedProduct]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 */

/**
 * @swagger
 * /ecommerce-purchased-product/soft-delete-purchased-product:
 *   patch:
 *     summary: Soft delete a purchased product
 *     tags: [PurchasedProduct]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Soft deleted
 */

/**
 * @swagger
 * /ecommerce-purchased-product/restore-purchased-product:
 *   patch:
 *     summary: Restore a soft-deleted purchased product
 *     tags: [PurchasedProduct]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Restored
 */

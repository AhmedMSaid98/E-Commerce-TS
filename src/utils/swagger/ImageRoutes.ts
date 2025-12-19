/**
 * @swagger
 * tags:
 *   name: Image
 *   description: Image upload and management
 */

/**
 * @swagger
 * /ecommerce-image/upload-user-image:
 *   post:
 *     summary: Upload or create user profile image
 *     tags: [Image]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Image uploaded
 */

/**
 * @swagger
 * /ecommerce-image/get-user-image:
 *   get:
 *     summary: Get authenticated user's profile image
 *     tags: [Image]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User image
 */

/**
 * @swagger
 * /ecommerce-image/update-user-image:
 *   patch:
 *     summary: Update authenticated user's profile image
 *     tags: [Image]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image updated
 */

/**
 * @swagger
 * /ecommerce-image/delete-user-image:
 *   delete:
 *     summary: Delete authenticated user's profile image
 *     tags: [Image]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Image deleted
 */

/**
 * @swagger
 * /ecommerce-image/upload-product-images:
 *   post:
 *     summary: Upload images for a product
 *     tags: [Image]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Product images uploaded
 */

/**
 * @swagger
 * /ecommerce-image/get-product-images:
 *   get:
 *     summary: Get product images
 *     tags: [Image]
 *     parameters:
 *       - in: query
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product images list
 */

/**
 * @swagger
 * /ecommerce-image/delete-product-images:
 *   delete:
 *     summary: Delete all images for a product
 *     tags: [Image]
 *     parameters:
 *       - in: query
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted images
 */

/**
 * @swagger
 * /ecommerce-image/delete-product-image:
 *   delete:
 *     summary: Delete a specific product image
 *     tags: [Image]
 *     parameters:
 *       - in: query
 *         name: productImageId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted product image
 */

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Product management API
 */

/**
 * @swagger
 * /ecommerce-product/create-product:
 *   post:
 *     summary: Create a new product
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               sku:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               costPrice:
 *                 type: number
 *               stockQuantity:
 *                 type: integer
 *             required:
 *               - name
 *               - categoryId
 *               - price
 *               - stockQuantity
 *     responses:
 *       201:
 *         description: Product created
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /ecommerce-product/get-product:
 *   get:
 *     summary: Get product by id
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product found
 */

/**
 * @swagger
 * /ecommerce-product/get-products:
 *   get:
 *     summary: Get products with filters
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: categoryName
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
 *         description: Product list
 */

/**
 * @swagger
 * /ecommerce-product/update-product:
 *   patch:
 *     summary: Update a product
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               stockQuantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Product updated
 */

/**
 * @swagger
 * /ecommerce-product/change-product-stock:
 *   patch:
 *     summary: Decrease product stock (purchase)
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: stockQuantity
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Stock updated
 */

/**
 * @swagger
 * /ecommerce-product/delete-product:
 *   delete:
 *     summary: Delete a product permanently
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product deleted
 */

/**
 * @swagger
 * /ecommerce-product/soft-delete-product:
 *   patch:
 *     summary: Soft delete a product
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product soft-deleted
 */

/**
 * @swagger
 * /ecommerce-product/restore-product:
 *   patch:
 *     summary: Restore a soft-deleted product
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product restored
 */

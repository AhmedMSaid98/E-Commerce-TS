/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Category management API
 */

/**
 * @swagger
 * /ecommerce-category/create-category:
 *   post:
 *     summary: Create a category
 *     tags: [Category]
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
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: Category created
 */

/**
 * @swagger
 * /ecommerce-category/get-category:
 *   get:
 *     summary: Get category by id
 *     tags: [Category]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Category found
 */

/**
 * @swagger
 * /ecommerce-category/get-categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Category]
 *     parameters:
 *       - in: query
 *         name: name
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
 *         description: Category list
 */

/**
 * @swagger
 * /ecommerce-category/update-category:
 *   patch:
 *     summary: Update a category
 *     tags: [Category]
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
 *     responses:
 *       200:
 *         description: Category updated
 */

/**
 * @swagger
 * /ecommerce-category/delete-category:
 *   delete:
 *     summary: Delete a category permanently
 *     tags: [Category]
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
 *             required:
 *               - id
 *     responses:
 *       200:
 *         description: Category deleted
 */

/**
 * @swagger
 * /ecommerce-category/soft-delete-category:
 *   patch:
 *     summary: Soft delete a category
 *     tags: [Category]
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
 *     responses:
 *       200:
 *         description: Category soft-deleted
 */

/**
 * @swagger
 * /ecommerce-category/restore-category:
 *   patch:
 *     summary: Restore a soft-deleted category
 *     tags: [Category]
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
 *     responses:
 *       200:
 *         description: Category restored
 */

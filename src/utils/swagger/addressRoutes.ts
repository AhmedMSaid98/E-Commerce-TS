/**
 * @swagger
 * tags:
 *   name: Address
 *   description: Address management API
 */

/**
 * @swagger
 * /ecommerce-address/create-address:
 *   post:
 *     summary: Create a new address for a user
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               address1:
 *                 type: string
 *               address2:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               country:
 *                 type: string
 *               postalCode:
 *                 type: string
 *             required:
 *               - userId
 *               - address1
 *               - address2
 *               - city
 *               - state
 *               - country
 *               - postalCode
 *     responses:
 *       201:
 *         description: Address created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /ecommerce-address/get-address:
 *   get:
 *     summary: Get a user's address by user ID
 *     tags: [Address]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to fetch the address for
 *     responses:
 *       200:
 *         description: Address found
 *       404:
 *         description: Address not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /ecommerce-address/get-addresses:
 *   get:
 *     summary: Get all addresses with optional filters
 *     tags:
 *       - Address
 *     parameters:
 *       - in: query
 *         name: address1
 *         schema:
 *           type: string
 *       - in: query
 *         name: address2
 *         schema:
 *           type: string
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *       - in: query
 *         name: postalCode
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           format: int32
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           format: int32
 *     responses:
 *       200:
 *         description: List of addresses
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /ecommerce-address/update-address:
 *   patch:
 *     summary: Update an address
 *     tags: [Address]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: address1
 *         schema:
 *           type: string
 *       - in: query
 *         name: address2
 *         schema:
 *           type: string
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *       - in: query
 *         name: postalCode
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Address updated successfully
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /ecommerce-address/delete-address:
 *   delete:
 *     summary: Delete an address
 *     tags: [Address]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Address ID to delete
 *     responses:
 *       200:
 *         description: Address deleted
 *       404:
 *         description: Address not found
 *       500:
 *         description: Server error
 */

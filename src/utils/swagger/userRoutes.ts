//? Register User
/**
 * @swagger
 * /ecommerce-user/register-user:
 *   post:
 *     summary: Register a new user
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "Ahmed"
 *               lastName:
 *                 type: string
 *                 example: "Said"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "example@gmail.com"
 *               password:
 *                 type: string
 *                 description: Must contain at least one uppercase letter, one number, and one special character
 *                 example: "Password123!"
 *               role:
 *                 $ref: '#/components/schemas/Role'
 *               isVerified:
 *                 type: boolean
 *                 example: false
 *               phone:
 *                 type: string
 *                 nullable: true
 *                 example: "+20123456789"
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *               - role
 *               - isVerified
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "User created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Email must be valid", "Password must contain at least one uppercase letter"]
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 statusCode:
 *                   type: number
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Internal server error: ..."
 *                 data:
 *                   type: null
 */

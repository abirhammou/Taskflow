const router = require('express').Router();
const ctrl = require('../controllers/auth.controller');

/**
 * @swagger
 * /auth/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/users', ctrl.getAllUsers);

/**
 * @swagger
 * /auth/users/{id}:
 *   get:
 *     summary: Get a user by Mongo ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
router.get('/users/:id', ctrl.getUserById);

/**
 * @swagger
 * /auth/profile/email/{email}:
 *   get:
 *     summary: Get a user profile by email
 *     tags: [Profile]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profile found
 *       404:
 *         description: User not found
 */
router.get('/profile/email/:email', ctrl.getProfileByEmail);

/**
 * @swagger
 * /auth/profile/{id}:
 *   get:
 *     summary: Get a user profile by ID
 *     tags: [Profile]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profile found
 *       404:
 *         description: User not found
 */
router.get('/profile/:id', ctrl.getProfile);

/**
 * @swagger
 * /auth/profile/{id}:
 *   put:
 *     summary: Update a user profile
 *     tags: [Profile]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Profile updated
 *       404:
 *         description: User not found
 */
router.put('/profile/:id', ctrl.updateProfile);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password]
 *             properties:
 *               username: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               role: { type: string, enum: [USER, ADMIN] }
 *     responses:
 *       201:
 *         description: User created
 *       409:
 *         description: Username or email already in use
 */
router.post('/register', ctrl.register);

module.exports = router;
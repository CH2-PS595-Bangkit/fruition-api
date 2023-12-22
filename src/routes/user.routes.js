const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const UserController = require('../controllers/UserController');
const authenticateToken = require('../middleware/middleware');

// Route untuk mendapatkan semua pengguna
router.get('/users', UserController.getAllUsers);

// Route untuk membuat pengguna baru
router.post(
  '/create',
  [
    body('email').isEmail().withMessage('Invalid email'),
    body('username').notEmpty().withMessage('Username is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  UserController.createUser
);

// Route untuk forgot password
router.post(
  '/forgot-password',
  [
    body('email').isEmail().withMessage('Invalid email'),
  ],
  UserController.forgotPassword
);

router.put('/:id/update-password',authenticateToken.authenticateToken, UserController.updateUserPassword);

module.exports = router;

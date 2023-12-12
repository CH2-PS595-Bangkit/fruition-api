const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const authenticateToken = require('../middleware/middleware');

// Rute untuk login
router.post('/login', AuthController.login);

router.post('/logout', authenticateToken.authenticateToken, AuthController.logout);

module.exports = router;

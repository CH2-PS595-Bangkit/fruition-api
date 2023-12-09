const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

// Rute untuk login
router.post('/login', AuthController.login);

module.exports = router;

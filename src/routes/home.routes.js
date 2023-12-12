const express = require('express');
const router = express.Router();
const HomeController = require('../controllers/HomeController');
const AuthController = require('../controllers/AuthController');
const authenticateToken = require('../middleware/middleware');

router.get('/', authenticateToken.authenticateToken, HomeController.getHomePage);

module.exports = router;

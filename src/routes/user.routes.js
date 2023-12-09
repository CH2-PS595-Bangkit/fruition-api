const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

router.get('/', UserController.getAllUsers);
router.post('/create', UserController.createUser);
// tambahkan rute lainnya jika diperlukan

module.exports = router;

// src/routes/historyRoutes.js
const express = require('express');
const router = express.Router();
const HistoryController = require('../controllers/HistoryController');
const authenticateToken = require('../middleware/middleware');

router.get('/', authenticateToken.authenticateToken, HistoryController.getAllHistories);
router.post('/', authenticateToken.authenticateToken, HistoryController.createHistory);
// tambahkan rute lainnya jika diperlukan

module.exports = router;

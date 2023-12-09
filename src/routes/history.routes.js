// src/routes/historyRoutes.js
const express = require('express');
const router = express.Router();
const HistoryController = require('../controllers/HistoryController');

router.get('/', HistoryController.getAllHistories);
router.post('/', HistoryController.createHistory);
// tambahkan rute lainnya jika diperlukan

module.exports = router;

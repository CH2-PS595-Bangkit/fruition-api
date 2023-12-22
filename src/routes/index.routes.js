// routes/index.js
const express = require('express');
const router = express.Router();
const userRoutes = require('./user.routes');
const historyRoutes = require('./history.routes');
const loginRoutes = require('./login.routes');
const homeRoutes = require('./home.routes');

// Rute untuk tampilan service success pada http://domain.com/
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Service fruition success' });
});

// Gunakan rute-rute untuk entitas User, History, dan Login
router.use('/users', userRoutes);
router.use('/histories', historyRoutes);
router.use('/auth', loginRoutes);
router.use('/home', homeRoutes);
// router.use('/prediction', predictionRoutes); // Gunakan rute prediksi di '/prediction'

module.exports = router;

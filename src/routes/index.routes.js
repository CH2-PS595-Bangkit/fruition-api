const express = require('express');
const router = express.Router();
const userRoutes = require('./user.routes');
const historyRoutes = require('./history.routes');
const loginRoutes = require('./login.routes'); // Import rute login yang telah dibuat sebelumnya

// Gunakan rute-rute untuk entitas User, History, dan Login
router.use('/users', userRoutes);
router.use('/histories', historyRoutes);
router.use('/auth', loginRoutes); // Gunakan rute login di '/auth'

module.exports = router;

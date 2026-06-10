const express = require('express');
const dashboardController = require('./dashboard.controller');
const { authMiddleware, roleMiddleware } = require('../../shared/middlewares/auth.middleware');
const router = express.Router();

router.use(authMiddleware);

router.get('/stats', roleMiddleware(['Super Admin', 'Principal']), dashboardController.getDashboardStats);

module.exports = router;

const express = require('express');
const reportController = require('./report.controller');
const { authMiddleware, roleMiddleware } = require('../../shared/middlewares/auth.middleware');
const router = express.Router();

router.use(authMiddleware);
router.get('/revenue', roleMiddleware(['SUPER_ADMIN', 'MANAGEMENT']), reportController.getRevenueReport);

module.exports = router;

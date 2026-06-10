const express = require('express');
const receiptController = require('./receipt.controller');
const { authMiddleware, roleMiddleware } = require('../../shared/middlewares/auth.middleware');
const router = express.Router();

router.use(authMiddleware);
router.post('/generate/:installmentId', roleMiddleware(['SUPER_ADMIN', 'ACCOUNTS_STAFF']), receiptController.generateReceipt);

module.exports = router;

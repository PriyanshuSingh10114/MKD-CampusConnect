const express = require('express');
const receiptController = require('./receipt.controller');
const { authMiddleware, roleMiddleware } = require('../../shared/middlewares/auth.middleware');
const router = express.Router();

router.use(authMiddleware);

const receiptRoles = ['Super Admin', 'Principal', 'Accounts Staff'];

router.get('/', roleMiddleware(receiptRoles), receiptController.getReceipts);
router.get('/:id', roleMiddleware(receiptRoles), receiptController.getReceiptById);

module.exports = router;

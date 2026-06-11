const express = require('express');
const feeController = require('./fee.controller');
const { authMiddleware, roleMiddleware } = require('../../shared/middlewares/auth.middleware');
const router = express.Router();

router.use(authMiddleware);

// MODULE 2: FEE STRUCTURE
router.get('/structures', roleMiddleware(['Super Admin', 'Principal', 'Accounts Staff']), feeController.getFeeStructures);
router.post('/structures', roleMiddleware(['Super Admin', 'Principal']), feeController.createFeeStructure);
router.put('/structures/:id', roleMiddleware(['Super Admin', 'Principal']), feeController.updateFeeStructure);
router.delete('/structures/:id', roleMiddleware(['Super Admin']), feeController.deleteFeeStructure);

// MODULE 3: FEE COLLECTION
router.get('/student/:studentId', roleMiddleware(['Super Admin', 'Accounts Staff']), feeController.getStudentFeeDetails);
router.post('/collect', roleMiddleware(['Super Admin', 'Accounts Staff']), feeController.collectFee);
router.get('/receipts', roleMiddleware(['Super Admin', 'Principal', 'Accounts Staff']), feeController.getReceipts);
router.get('/receipt/:receiptId', roleMiddleware(['Super Admin', 'Principal', 'Accounts Staff']), feeController.getReceiptById);

router.get('/defaulters', roleMiddleware(['Super Admin', 'Principal', 'Accounts Staff']), feeController.getDefaulters);

module.exports = router;

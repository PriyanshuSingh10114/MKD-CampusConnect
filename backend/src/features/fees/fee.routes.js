const express = require('express');
const feeController = require('./fee.controller');
const { authMiddleware, roleMiddleware } = require('../../shared/middlewares/auth.middleware');
const router = express.Router();

router.use(authMiddleware);

router.get('/structures', roleMiddleware(['Super Admin', 'Principal']), feeController.getFeeStructures);
router.post('/structures', roleMiddleware(['Super Admin']), feeController.createFeeStructure);

router.post('/payments/:studentId', roleMiddleware(['Super Admin', 'Accounts Staff']), feeController.recordPayment);
router.get('/defaulters', roleMiddleware(['Super Admin', 'Principal', 'Accounts Staff']), feeController.getDefaulters);

module.exports = router;

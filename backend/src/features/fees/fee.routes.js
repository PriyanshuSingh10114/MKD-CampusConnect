const express = require('express');
const feeController = require('./fee.controller');
const { authMiddleware, roleMiddleware } = require('../../shared/middlewares/auth.middleware');
const router = express.Router();

router.use(authMiddleware);

router.get('/structures', roleMiddleware(['SUPER_ADMIN', 'MANAGEMENT']), feeController.getFeeStructures);
router.post('/structures', roleMiddleware(['SUPER_ADMIN']), feeController.createFeeStructure);

router.post('/payments/:studentId', roleMiddleware(['SUPER_ADMIN', 'ACCOUNTS_STAFF']), feeController.recordPayment);
router.get('/defaulters', roleMiddleware(['SUPER_ADMIN', 'MANAGEMENT', 'ACCOUNTS_STAFF']), feeController.getDefaulters);

module.exports = router;

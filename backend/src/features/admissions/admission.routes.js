const express = require('express');
const admissionController = require('./admission.controller');
const { authMiddleware, roleMiddleware } = require('../../shared/middlewares/auth.middleware');
const router = express.Router();

router.use(authMiddleware);

router.get('/', roleMiddleware(['SUPER_ADMIN', 'ADMISSION_OFFICER', 'MANAGEMENT']), admissionController.getAdmissions);
router.get('/:id', roleMiddleware(['SUPER_ADMIN', 'ADMISSION_OFFICER', 'MANAGEMENT']), admissionController.getAdmissionById);
router.patch('/:id/status', roleMiddleware(['SUPER_ADMIN', 'ADMISSION_OFFICER']), admissionController.updateAdmissionStatus);

module.exports = router;

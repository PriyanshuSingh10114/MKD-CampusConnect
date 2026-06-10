const express = require('express');
const admissionController = require('./admission.controller');
const { authMiddleware, roleMiddleware } = require('../../shared/middlewares/auth.middleware');
const router = express.Router();

router.use(authMiddleware);

router.get('/', roleMiddleware(['Super Admin', 'Principal', 'Admission Staff']), admissionController.getAdmissions);
router.get('/:id', roleMiddleware(['Super Admin', 'Principal', 'Admission Staff']), admissionController.getAdmissionById);
router.patch('/:id/status', roleMiddleware(['Super Admin', 'Principal', 'Admission Staff']), admissionController.updateAdmissionStatus);

module.exports = router;

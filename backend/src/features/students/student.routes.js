const express = require('express');
const studentController = require('./student.controller');
const { authMiddleware, roleMiddleware } = require('../../shared/middlewares/auth.middleware');
const router = express.Router();

router.use(authMiddleware);

router.get('/', studentController.getStudents);
router.get('/:id', studentController.getStudentById);
router.post('/', roleMiddleware(['SUPER_ADMIN', 'ADMISSION_OFFICER']), studentController.createStudent);

module.exports = router;

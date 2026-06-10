const express = require('express');
const studentController = require('./student.controller');
const { authMiddleware, roleMiddleware } = require('../../shared/middlewares/auth.middleware');
const router = express.Router();

router.use(authMiddleware);

router.get('/', studentController.getStudents);
router.get('/:id', studentController.getStudentById);
router.post('/', roleMiddleware(['Super Admin', 'Principal', 'Admission Staff']), studentController.createStudent);

module.exports = router;

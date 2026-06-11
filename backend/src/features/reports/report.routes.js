const express = require('express');
const reportController = require('./report.controller');
const { authMiddleware, roleMiddleware } = require('../../shared/middlewares/auth.middleware');
const router = express.Router();

router.use(authMiddleware);

// All reports are accessible to Super Admin and Principal (you can adjust roles as needed)
const reportRoles = ['Super Admin', 'Principal'];

router.get('/dashboard', roleMiddleware(reportRoles), reportController.getDashboardStats);
router.get('/daily', roleMiddleware(reportRoles), reportController.getDailyCollection);
router.get('/monthly', roleMiddleware(reportRoles), reportController.getMonthlyCollection);
router.get('/course-revenue', roleMiddleware(reportRoles), reportController.getCourseRevenue);
router.get('/admissions', roleMiddleware(reportRoles), reportController.getAdmissionsReport);
router.get('/student-ledger/:studentId', roleMiddleware(reportRoles), reportController.getStudentLedger);

module.exports = router;

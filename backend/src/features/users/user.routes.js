const express = require('express');
const userController = require('./user.controller');
const { authMiddleware, roleMiddleware } = require('../../shared/middlewares/auth.middleware');
const router = express.Router();

router.use(authMiddleware);

// Super Admin and Principal can manage users
router.get('/', roleMiddleware(['Super Admin', 'Principal']), userController.getUsers);
router.post('/', roleMiddleware(['Super Admin', 'Principal']), userController.createUser);
router.put('/:id', roleMiddleware(['Super Admin', 'Principal']), userController.updateUser);
router.patch('/:id/status', roleMiddleware(['Super Admin', 'Principal']), userController.updateUserStatus);
router.post('/:id/reset-password', roleMiddleware(['Super Admin', 'Principal']), userController.resetUserPassword);

module.exports = router;

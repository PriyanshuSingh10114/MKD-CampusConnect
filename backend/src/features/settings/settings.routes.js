const express = require('express');
const settingsController = require('./settings.controller');
const { authMiddleware, roleMiddleware } = require('../../shared/middlewares/auth.middleware');
const router = express.Router();

router.use(authMiddleware);

// Only Super Admin and Principal can manage settings
router.get('/', roleMiddleware(['Super Admin', 'Principal']), settingsController.getSettings);
router.put('/', roleMiddleware(['Super Admin', 'Principal']), settingsController.updateSettings);

module.exports = router;

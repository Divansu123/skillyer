const express = require('express');
const router = express.Router();
const { adminLogin, getAdminStats, createAdmin, getRecentActivity } = require('../controllers/miscControllers');
const auth = require('../middleware/auth');

router.post('/login', adminLogin);
router.post('/createAdmin', createAdmin);
router.get('/stats', auth, getAdminStats);
router.get('/recent-activity', auth, getRecentActivity);

module.exports = router;

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const verifyToken = require('../middlewares/auth');

router.get('/staff', verifyToken, dashboardController.staffDashboard);
router.get('/supervisor', verifyToken, dashboardController.supervisorDashboard);
router.get('/admin', verifyToken, dashboardController.adminDashboard);

module.exports = router;

const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const verifyToken = require('../middlewares/auth');

// Semua endpoint di-protect dengan token
router.post('/', verifyToken, reportController.createReport);
router.get('/', verifyToken, reportController.getAllReports);
router.get('/user/:userId', verifyToken, reportController.getReportsByUser);
router.put('/:id', verifyToken, reportController.updateReport);
router.delete('/:id', verifyToken, reportController.deleteReport);

module.exports = router;

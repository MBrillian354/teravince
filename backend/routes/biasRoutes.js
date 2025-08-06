const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth');
const {
  submitTaskReviewAndCheckBias,
  submitReportReviewAndCheckBias,
  testBiasDetection
} = require('../controllers/biasController');

router.post('/task/:taskId', verifyToken, submitTaskReviewAndCheckBias);
router.post('/report/:reportId', verifyToken, submitReportReviewAndCheckBias);
router.post('/test', verifyToken, testBiasDetection); // Test endpoint for bias detection

module.exports = router;

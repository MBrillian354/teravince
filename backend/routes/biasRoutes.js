biasRoutes.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth');
const {
  submitTaskReviewAndCheckBias,
  submitReportReviewAndCheckBias
} = require('../controllers/biasController');

router.post('/task/:taskId', verifyToken, submitTaskReviewAndCheckBias);
router.post('/report/:reportId', verifyToken, submitReportReviewAndCheckBias);

module.exports = router;

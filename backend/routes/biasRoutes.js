const express = require('express');
const router = express.Router();
const { checkBias } = require('../controllers/biasController');

router.post('/check-bias/:taskId', checkBias);

module.exports = router;
const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const verifyToken = require('../middlewares/auth');

// CRUD Job
router.post('/', verifyToken, jobController.createJob);       
router.get('/', verifyToken, jobController.getAllJobs);       
router.get('/:id', verifyToken, jobController.getJobById);    
router.put('/:id', verifyToken, jobController.updateJob);     
router.delete('/:id', verifyToken, jobController.deleteJob);  

module.exports = router;

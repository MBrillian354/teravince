const express = require('express');
const router = express.Router();
const {
  getExamples,
  getExampleById,
  createExample,
  updateExample,
  deleteExample
} = require('../controllers/exampleController');

// GET all examples
router.get('/', getExamples);

// GET a single example
router.get('/:id', getExampleById);

// POST a new example
router.post('/', createExample);

// PATCH (update) an example
router.patch('/:id', updateExample);

// DELETE an example
router.delete('/:id', deleteExample);

module.exports = router;
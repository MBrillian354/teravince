// Example in-memory database (replace with real database in production)
let examples = [
  { id: 1, name: 'Example 1', description: 'First example' },
  { id: 2, name: 'Example 2', description: 'Second example' }
];

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getExamples = (req, res) => {
  res.status(200).json(examples);
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getExampleById = (req, res) => {
  const example = examples.find(e => e.id === parseInt(req.params.id));
  
  if (example) {
    res.status(200).json(example);
  } else {
    res.status(404).json({ message: 'Example not found' });
  }
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const createExample = (req, res) => {
  if (!req.body.name || !req.body.description) {
    return res.status(400).json({ message: 'Please include name and description' });
  }
  
  const example = {
    id: examples.length + 1,
    name: req.body.name,
    description: req.body.description
  };
  
  examples.push(example);
  res.status(201).json(example);
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const updateExample = (req, res) => {
  const example = examples.find(e => e.id === parseInt(req.params.id));
  
  if (!example) {
    return res.status(404).json({ message: 'Example not found' });
  }
  
  example.name = req.body.name || example.name;
  example.description = req.body.description || example.description;
  
  res.status(200).json(example);
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const deleteExample = (req, res) => {
  const index = examples.findIndex(e => e.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ message: 'Example not found' });
  }
  
  examples.splice(index, 1);
  res.status(200).json({ message: 'Example removed' });
};

module.exports = {
  getExamples,
  getExampleById,
  createExample,
  updateExample,
  deleteExample
};
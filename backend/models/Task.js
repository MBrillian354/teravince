const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  employee_id: String,
  description: String,
  filename: String,
  submitted_at: Date,
  deadline: Date,
  review: String,
  bias_check: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('Task', taskSchema);
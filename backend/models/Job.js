const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  deadline: Date,
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['DRAFT', 'UNDER REVIEW', 'ONGOING', 'FINISHED'],
    default: 'DRAFT'
  }
});

module.exports = mongoose.model('Job', jobSchema);

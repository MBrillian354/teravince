const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  deadline: Date,
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  }
});

// Virtual field to get all tasks for users assigned to this job
jobSchema.virtual('allTasks', {
  ref: 'Task',
  localField: 'assignedTo',
  foreignField: 'userId'
});

// Virtual field to get count of inProgress tasks
jobSchema.virtual('inProgressTaskCount', {
  ref: 'Task',
  localField: 'assignedTo',
  foreignField: 'userId',
  count: true,
  match: { taskStatus: 'inProgress' }
});

// Virtual field to get count of completed tasks
jobSchema.virtual('completedTaskCount', {
  ref: 'Task',
  localField: 'assignedTo',
  foreignField: 'userId',
  count: true,
  match: { taskStatus: 'completed' }
});

// Ensure virtual fields are included in JSON output
jobSchema.set('toJSON', { virtuals: true });
jobSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Job', jobSchema);

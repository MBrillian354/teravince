const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taskSchema = new Schema({
  staffId: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  activity: [{
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    operator: { type: String, enum: ['lowerThan', 'greaterThan'], required: true }
  }],
  score: { type: Number, required: true },
  evidence: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  taskStatus: { type: String, enum: ['inProgress', 'submitted', 'rejected', 'completed', 'cancelled'], default: 'in-progress' },
  supervisorComment: { type: String, required: false },


});

module.exports = mongoose.model('Task', taskSchema);
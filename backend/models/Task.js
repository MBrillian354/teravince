const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taskSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  kpis: [{
    kpiTitle: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    achievedAmount: { type: Number, required: false, default: 0 },
    operator: { type: String, enum: ['lessThan', 'greaterThan'], required: true }
  }],
  score: { type: Number, required: false },
  evidence: { type: String, required: false },
  createdDate: { type: Date, default: Date.now },
  deadline: { type: Date, required: false },
  startDate: { type: Date, required: false },
  submittedDate: { type: Date, required: false },
  completedDate: { type: Date, required: false },
  taskStatus: { type: String, enum: ['inProgress', 'submissionRejected', 'approvalRejected', 'submittedAndAwaitingReview', 'submittedAndAwaitingApproval', 'completed', 'draft'], default: 'draft' },
  supervisorComment: { type: String, default: '' },
  bias_check: {
    type: Object,
    default: null
  }

});

module.exports = mongoose.model('Task', taskSchema);
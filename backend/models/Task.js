const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taskSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  kpis: [{
    kpiTitle: { type: String, required: true },
    amount: { type: Number, required: true },
    operator: { type: String, enum: ['lessThan', 'greaterThan'], required: true }
  }],
  score: { type: Number, required: false },
  evidence: { type: String, required: false },
  createdDate: { type: Date, default: Date.now },
  deadline: { type: Date, required: false },
  startDate: { type: Date, required: false },
  endDate: { type: Date, required: false },
  approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'draft' },
  taskStatus: { type: String, enum: ['draft', 'inProgress', 'submitted', 'rejected', 'completed', 'cancelled'], default: 'draft' },
  supervisorComment: { type: String, default: '' },
  bias_check: {
    type: Object,
    default: null
  }

});

module.exports = mongoose.model('Task', taskSchema);
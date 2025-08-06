const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  period: {
    type: Date,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['needReview', 'done'],
    default: 'needReview',
  },
  review: {
    type: String,
    default: '',
  },
  bias_check: {
    type: Object,
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);

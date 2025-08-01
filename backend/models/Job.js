const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: String,
  jobDesc: [String],
  status: String
});

module.exports = mongoose.model('Job', jobSchema);

const mongoose = require('mongoose');
const Job = require('../models/Job');
const User = require('../models/User');

// Create a new job
exports.createJob = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { title, description } = req.body;

    const newJob = new Job({
      title,
      description,
      assignedTo: [],
      status: 'draft'
    });

    await newJob.save({ session });

    if (assignedTo) {
      const user = await User.findByIdAndUpdate(
        assignedTo,
        { jobId: newJob._id },
        { session }
      );
      if (!user) throw new Error('Assigned user not found');
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ msg: 'Job created successfully', job: newJob });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// Get all jobs
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('assignedTo', 'firstName lastName email');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// Get job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('assignedTo', 'firstName lastName email');
    if (!job) return res.status(404).json({ msg: 'Job not found' });

    res.json(job);
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// Update job
exports.updateJob = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { title, description, deadline, assignedTo, status } = req.body;

    const jobData = { title, description, deadline, assignedTo, status };

    const updatedJob = await Job.findByIdAndUpdate(id, jobData, {
      new: true,
      session
    });
    if (!updatedJob) throw new Error('Job not found');

    await User.updateMany({ jobId: id }, { $unset: { jobId: "" } }, { session });

    if (assignedTo) {
      const user = await User.findByIdAndUpdate(assignedTo, { jobId: id }, { session });
      if (!user) throw new Error('Assigned user not found');
    }

    await session.commitTransaction();
    session.endSession();

    res.json({ msg: 'Job updated successfully', job: updatedJob });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// Delete job
exports.deleteJob = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const deleted = await Job.findByIdAndDelete(req.params.id, { session });
    if (!deleted) throw new Error('Job not found');

    await session.commitTransaction();
    session.endSession();

    res.json({ msg: 'Job deleted successfully' });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

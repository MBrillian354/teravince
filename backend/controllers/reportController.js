const Report = require('../models/Report');
const User = require('../models/User');
const Task = require('../models/Task');

// Buat laporan
exports.createReport = async (req, res) => {
  try {
    const { userId, period, score, status, review } = req.body;

    const newReport = new Report({ userId, period, score, status, review });
    await newReport.save();

    res.status(201).json({ message: 'Report created', report: newReport });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create report', error });
  }
};

// get report
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().populate({ path: 'userId', select: 'firstName lastName email jobId', populate: { path: 'jobId', select: 'title' } });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reports', error });
  }
};

// get report by userId
exports.getReportsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const reports = await Report.find({ userId }).populate('userId', 'firstName lastName');
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user reports', error });
  }
};

// get single report by ID
exports.getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findById(id).populate({ path: 'userId', select: 'firstName lastName email jobId', populate: { path: 'jobId', select: 'title' } });

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch report', error });
  }
};

// get tasks for a specific report
exports.getReportTasks = async (req, res) => {
  try {
    const { id } = req.params;

    // First get the report to extract userId and period
    const report = await Report.findById(id).populate({ path: 'userId', select: 'firstName lastName email jobId', populate: { path: 'jobId', select: 'title' } });

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Since period is a Date, we need to extract the month and year from it
    const periodDate = new Date(report.period);
    const year = periodDate.getFullYear();
    const month = periodDate.getMonth();
    
    const startDate = new Date(year, month, 1); // Start of the month
    const endDate = new Date(year, month + 1, 0); // End of the month

    // Find tasks created in the report period for the specific user
    const tasks = await Task.find({
      userId: report.userId._id,
      createdDate: {
        $gte: startDate,
        $lte: endDate
      }
    }).populate('userId', 'firstName lastName email jobTitle');

    res.status(200).json({
      success: true,
      report,
      tasks,
      count: tasks.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch report tasks', error });
  }
};

// Update laporan (status dan review)
exports.updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { score, status, review } = req.body;

    const updatedReport = await Report.findByIdAndUpdate(
      id,
      { score, status, review },
      { new: true }
    );

    if (!updatedReport) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.status(200).json({ message: 'Report updated', report: updatedReport });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update report', error });
  }
};

// Delete report
exports.deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Report.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Report not found' });

    res.status(200).json({ message: 'Report deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete report', error });
  }
};

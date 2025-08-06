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

// Generate monthly reports for current month
exports.generateMonthlyReports = async (req, res) => {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed

    // Create a date object for the first day of the current month for consistent period format
    const currentPeriodDate = new Date(currentYear, currentMonth - 1, 1);

    // Find all staff users
    const staffUsers = await User.find({ role: 'staff' });

    // Find staff who already have reports for the current month
    // We need to check for reports with the same year and month
    const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfMonth = new Date(currentYear, currentMonth, 0);

    const existingReports = await Report.find({
      period: {
        $gte: startOfMonth,
        $lte: endOfMonth
      }
    });
    const usersWithReports = new Set(existingReports.map(report => report.userId.toString()));

    // Filter staff who don't have reports for current month
    const staffWithoutReports = staffUsers.filter(staff => !usersWithReports.has(staff._id.toString()));

    const filteredStaffWithoutReports = staffWithoutReports.filter(staff => staff.role !== 'supervisor' && staff.role !== 'admin');

    const generatedReports = [];

    // Generate reports for each staff member without a report
    for (const staff of filteredStaffWithoutReports) {
      try {
        // Get tasks for this staff member in the current month
        const tasks = await Task.find({
          userId: staff._id,
          createdDate: {
            $gte: startOfMonth,
            $lte: endOfMonth
          }
        });

        // Calculate average score from tasks
        let averageScore = 0;
        if (tasks.length > 0) {
          const totalScore = tasks.reduce((sum, task) => sum + (task.score || 0), 0);
          averageScore = Math.round(totalScore / tasks.length);
        }

        // Create new report
        const newReport = new Report({
          userId: staff._id,
          period: currentPeriodDate, // Use Date object instead of string
          score: averageScore,
          status: 'awaitingReview',
          review: '' // Empty review, to be filled by supervisor
        });

        await newReport.save();
        generatedReports.push(newReport);
      } catch (error) {
        console.error(`Failed to generate report for staff ${staff._id}:`, error);
        // Continue with other staff members even if one fails
      }
    }

    res.status(201).json({
      message: `Generated ${generatedReports.length} monthly reports for current month`,
      period: `${currentYear}-${currentMonth.toString().padStart(2, '0')}`,
      generatedCount: generatedReports.length,
      totalStaff: staffUsers.length,
      existingReports: existingReports.length,
      reports: generatedReports
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to generate monthly reports',
      error: error.message
    });
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

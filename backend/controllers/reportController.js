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

// get all reports with pagination, search, and filtering
exports.getAllReports = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      biasStatus,
      staffName,
      sortBy = 'period',
      sortOrder = 'desc',
      month,
      year
    } = req.query;

    // Build query
    let query = {};

    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }

    // Bias status filter
    if (biasStatus && biasStatus !== 'all') {
      if (biasStatus === 'bias-detected') {
        query['bias_check.is_bias'] = true;
      } else if (biasStatus === 'no-bias') {
        query['bias_check.is_bias'] = false;
      } else if (biasStatus === 'pending') {
        query['bias_check'] = { $exists: true, 'is_bias': { $exists: false } };
      } else if (biasStatus === 'not-checked') {
        query['bias_check'] = { $exists: false };
      }
    }

    // Month and year filter
    if (month && year) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0);
      query.period = { $gte: startDate, $lte: endDate };
    } else if (year) {
      const startDate = new Date(parseInt(year), 0, 1);
      const endDate = new Date(parseInt(year), 11, 31);
      query.period = { $gte: startDate, $lte: endDate };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    let reports;
    let totalReports;

    if (search) {
      // Use aggregation for searching in populated user fields
      const pipeline = [
        { $match: query },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $lookup: {
            from: 'jobs',
            localField: 'user.jobId',
            foreignField: '_id',
            as: 'job'
          }
        },
        {
          $unwind: {
            path: '$job',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $match: {
            $or: [
              { 'user.firstName': { $regex: search, $options: 'i' } },
              { 'user.lastName': { $regex: search, $options: 'i' } },
              { 'job.title': { $regex: search, $options: 'i' } },
              { 
                $expr: {
                  $regexMatch: {
                    input: { $concat: ['$user.firstName', ' ', '$user.lastName'] },
                    regex: search,
                    options: 'i'
                  }
                }
              }
            ]
          }
        },
        { $sort: sort },
        {
          $addFields: {
            'userId._id': '$user._id',
            'userId.firstName': '$user.firstName',
            'userId.lastName': '$user.lastName',
            'userId.email': '$user.email',
            'userId.jobId': {
              '_id': '$job._id',
              'title': '$job.title'
            }
          }
        },
        {
          $project: {
            user: 0,
            job: 0
          }
        }
      ];

      // Get total count
      const countPipeline = [...pipeline];
      const countResult = await Report.aggregate([...countPipeline, { $count: 'total' }]);
      totalReports = countResult.length > 0 ? countResult[0].total : 0;

      // Get paginated results
      pipeline.push({ $skip: skip }, { $limit: parseInt(limit) });
      reports = await Report.aggregate(pipeline);
    } else {
      // Simple query without search
      totalReports = await Report.countDocuments(query);
      reports = await Report.find(query)
        .populate({
          path: 'userId',
          select: 'firstName lastName email jobId',
          populate: {
            path: 'jobId',
            select: 'title'
          }
        })
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));
    }

    // Calculate pagination info
    const totalPages = Math.ceil(totalReports / parseInt(limit));
    const currentPage = parseInt(page);

    res.status(200).json({
      success: true,
      data: reports,
      pagination: {
        currentPage,
        totalPages,
        totalReports,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error in getAllReports:', error);
    res.status(500).json({ message: 'Failed to fetch reports', error: error.message });
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
          status: 'needReview', // Default status
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

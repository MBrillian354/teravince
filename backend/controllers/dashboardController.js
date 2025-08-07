const Report = require('../models/Report');
const Task = require('../models/Task');
const User = require('../models/User');
const Job = require('../models/Job');

// Staff Dashboard
exports.staffDashboard = async (req, res) => {
  try {
    const { month, year, userId } = req.query;
    console.log('User ID:', userId);
    const allReports = await Report.find({ userId });

    // Handle period filtering - since period is stored as Date in the model
    let selectedReport = null;
    if (month && year) {
      const startDate = new Date(`${year}-${month.toString().padStart(2, '0')}-01`);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);

      selectedReport = await Report.findOne({
        userId,
        period: { $gte: startDate, $lt: endDate }
      });
    } else {
      // Get the most recent report
      selectedReport = allReports[allReports.length - 1];
    }

    const currentYear = new Date().getFullYear();
    const thisYearReports = allReports.filter(r => new Date(r.period).getFullYear() === currentYear);
    const lastYearReports = allReports.filter(r => new Date(r.period).getFullYear() === currentYear - 1);

    const thisYearAvg = thisYearReports.reduce((s, r) => s + r.score, 0) / (thisYearReports.length || 1);
    const lastYearAvg = lastYearReports.reduce((s, r) => s + r.score, 0) / (lastYearReports.length || 1);
    const growthRate = ((thisYearAvg - lastYearAvg) / (lastYearAvg || 1)) * 100;

    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
    console.log('Tasks:', tasks);
    const activityRecap = await Task.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: '$taskStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      performanceScore: selectedReport?.score || 0,
      performanceFeedback: selectedReport?.review || '',
      growthRate: parseFloat(growthRate.toFixed(1)),
      activityRecap,
      history: tasks.map(task => ({
        title: task.title,
        status: task.taskStatus,
        evidence: task.evidence
      }))
    });
  } catch (error) {
    res.status(500).json({ msg: 'Failed to fetch staff dashboard', error: error.message });
  }
};

// Supervisor Dashboard 
exports.supervisorDashboard = async (req, res) => {
  try {
    const { month, year, startDate, endDate } = req.query;

    const match = {};
    if (month && year) {
      const start = new Date(`${year}-${month}-01`);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      match.createdDate = { $gte: start, $lt: end };
    }

    // Filter staff berdasarkan tanggal kontrak 
    const staffFilter = { role: 'staff' };
    if (startDate && endDate) {
      staffFilter.contractStartDate = { $gte: new Date(startDate) };
      staffFilter.contractEndDate = { $lte: new Date(endDate) };
    }

    const staff = await User.find(staffFilter);
    const staffIds = staff.map(s => s._id);

    const tasks = await Task.find({ userId: { $in: staffIds }, ...match });

    const taskStatusCounts = {
      achieved: tasks.filter(t => t.taskStatus === 'completed').length,
      onProcess: tasks.filter(t => t.taskStatus === 'inProgress').length,
      awaitingReview: tasks.filter(t => t.taskStatus === 'submittedAndAwaitingReview').length,
      awaitingApproval: tasks.filter(t => t.taskStatus === 'submittedAndAwaitingApproval').length,
      notYetStarted: tasks.filter(t => !t.taskStatus || t.taskStatus === 'draft').length,
    };

    res.json({
      totalTasks: tasks.length,
      numberOfStaffs: staff.length,
      avgTasksPerPerson: parseFloat((tasks.length / (staff.length || 1)).toFixed(1)),
      taskStatus: taskStatusCounts,
      staffs: staff.map(s => ({
        id: s._id,
        name: s.name,
        email: s.email,
        jobId: s.jobId,
        contract: {
          start: s.contractStartDate,
          end: s.contractEndDate,
        }
      }))
    });
  } catch (error) {
    res.status(500).json({ msg: 'Failed to fetch supervisor dashboard', error: error.message });
  }
};

// Admin Dashboard
exports.adminDashboard = async (req, res) => {
  try {
    const [supervisors, staffs, admins, jobs] = await Promise.all([
      User.find({ role: 'supervisor' }),
      User.find({ role: 'staff' }),
      User.find({ role: 'admin' }),
      Job.find()
    ]);

    const activeJobTitles = jobs.filter(j => j.status === 'active').length;
    const draftJobTitles = jobs.filter(j => j.status === 'draft').length;
    const unassignedEmployees = staffs.filter(s => !s.jobId).length;

    res.json({
      supervisorsCount: supervisors.length,
      staffsCount: staffs.length,
      adminsCount: admins.length,
      jobTitlesCount: jobs.length,
      activeJobTitles,
      draftJobTitles,
      unassignedEmployees
    });
  } catch (error) {
    res.status(500).json({ msg: 'Failed to fetch admin dashboard', error: error.message });
  }
};

const Report = require('../models/Report');
const User = require('../models/User');

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

// Ambil semua laporan
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().populate('userId', 'firstName lastName email');
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reports', error });
  }
};

// Ambil laporan berdasarkan userId
exports.getReportsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const reports = await Report.find({ userId }).populate('userId', 'firstName lastName');
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user reports', error });
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

// Hapus laporan
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

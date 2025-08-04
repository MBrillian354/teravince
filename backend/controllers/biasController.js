require('dotenv').config();
const Task = require('../models/Task');
const Report = require('../models/Report');
const axios = require('axios');

// kirim ke AI
const sendToBiasAI = async ({ prompt }) => {
  const response = await axios.post(
    'https://mlapi.run/9331793d-efda-4839-8f97-ff66f7eaf605/v1/chat/completions',
    {
      model: 'helpy-v-reasoning-c',
      messages: [
        {
          role: 'user',
          content: [{ type: 'text', text: prompt }]
        }
      ],
      max_tokens: 1024
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.ELICE_API_KEY}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    }
  );

  return response.data;
};

// Task
exports.submitTaskReviewAndCheckBias = async (req, res) => {
  const { taskId } = req.params;
  const { review } = req.body;

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const prompt = `
You are an AI system that detects bias in supervisor reviews of employee task submissions in a professional work setting.

Analyze the following task data and supervisor review. Determine whether the review contains any bias based on gender, race, religion, age, personal preference, or unjustified judgment unrelated to the task itself.

If the supervisor's review is written in Bahasa Indonesia, respond in Bahasa Indonesia.

If the review is written in English, respond in English.

Return: {
- is_bias: true or false,
- bias_label: short label (e.g., gender bias, personal bias, racial bias, etc.),
- bias_reason: explanation about which part of the review is biased and why
}

Employee Task Submission:
- Title: ${task.title}
- Description: ${task.description}
- Score: ${task.score}
- Evidence: ${task.evidence}
- Start Date: ${task.startDate}
- End Date: ${task.endDate}

Supervisor Review:
${review}
`;

    const result = await sendToBiasAI({ prompt });

    task.supervisorComment = review;
    task.bias_check = result;
    await task.save();

    res.json({
      success: true,
      msg: 'Task review submitted and bias checked',
      data: result
    });
  } catch (err) {
    console.error('Bias check error (task):', err.message);
    res.status(500).json({ error: 'Bias check failed', details: err.message });
  }
};

// Report
exports.submitReportReviewAndCheckBias = async (req, res) => {
  const { reportId } = req.params;
  const { review } = req.body;

  try {
    const report = await Report.findById(reportId).populate('userId');
    if (!report) return res.status(404).json({ error: 'Report not found' });

    const prompt = `
You are an AI system that detects bias in supervisor reviews of employee reports in a professional work setting.

Analyze the following monthly report and supervisor review. Determine whether the review contains any bias based on gender, race, religion, age, Personal preferences or stereotypes, Unjustified judgments unrelated to actual performance.

If the supervisor's review is written in Bahasa Indonesia, respond in Bahasa Indonesia.

If the review is written in English, respond in English.

Return: {
- is_bias: true or false,
- bias_label: short label (e.g., gender bias, personal bias, racial bias, etc.),
- bias_reason: explanation about which part of the review is biased and why
}

Employee Monthly Report:
- Period: ${report.period}
- Score: ${report.score}
- User: ${report.userId?.name || 'N/A'}

Supervisor Review:
${review}
`;

    const result = await sendToBiasAI({ prompt });

    report.review = review;
    report.bias_check = result;
    report.status = 'done';
    await report.save();

    res.json({
      success: true,
      msg: 'Report review submitted and bias checked',
      data: result
    });
  } catch (err) {
    console.error('Bias check error (report):', err.message);
    res.status(500).json({ error: 'Bias check failed', details: err.message });
  }
};


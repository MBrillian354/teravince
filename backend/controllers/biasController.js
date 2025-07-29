require('dotenv').config();
const Task = require('../models/Task');
const axios = require('axios');

exports.checkBias = async (req, res) => {
    const { taskId } = req.params;
    const { review } = req.body;
    
    console.log(process.env.ELICE_API_KEY)

    try {
        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ error: 'Task not found' });

        const eliceResponse = await axios.post(
            'https://mlapi.run/9331793d-efda-4839-8f97-ff66f7eaf605/v1/chat/completions',
            {
                model: 'helpy-v-reasoning-c',
                messages: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'text', text: `
You are an AI system that detects bias in supervisor reviews of employee task submissions in a professional work setting.

Analyze the following task data and supervisor review. Determine whether the review contains any bias based on gender, race, religion, age, personal preference, or unjustified judgment unrelated to the task itself.

Return:
- is_bias: true or false
- bias_label: short label (e.g., gender bias, personal bias, racial bias, etc.)
- bias_reason: explanation about which part of the review is biased and why

Employee Task Submission:
- Description: ${task.description}
- Submission Timestamp: ${task.submitted_at}
- Deadline: ${task.deadline}
- File Name: ${task.filename}

Supervisor Review:
- ${review}
              `}
                        ]
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

        const result = eliceResponse.data;

        task.review = review;
        task.bias_check = result;
        await task.save();

        res.json(result);
    } catch (err) {
        console.error('Bias check error:', err);
        res.status(500).json({ error: 'Bias check failed' });
    }
};
require('dotenv').config();
const Task = require('../models/Task');
const Report = require('../models/Report');
const axios = require('axios');

// kirim ke AI - Using DeepSeek API with JSON output support
const sendToBiasAI = async ({ prompt, evidence_files = [] }) => {
    try {
        // Prepare messages array with system prompt for consistent JSON output
        const messages = [
            {
                role: 'system',
                content: `You are an expert AI system specialized in detecting workplace bias in supervisor reviews. 

CRITICAL: You MUST respond with valid JSON only. No markdown, no explanation, no additional text.

Your response must be a valid JSON object with exactly this structure:
{
  "is_bias": boolean,
  "bias_label": "string (e.g., gender bias, racial bias, age bias, personal bias, etc.)",
  "bias_reason": "string explaining which specific part of the review shows bias and why"
}

If no bias is detected, use:
{
  "is_bias": false,
  "bias_label": "no bias detected",
  "bias_reason": "The review focuses on work performance and task completion without discriminatory language or unfair judgments"
}`
            },
            {
                role: 'user',
                content: prompt
            }
        ];

        // Add file evidence information if provided
        if (evidence_files && evidence_files.length > 0) {
            const fileInfo = evidence_files.map(file => `- ${file.filename} (${file.mimetype})`).join('\n');
            messages.push({
                role: 'user',
                content: `Additional context - Evidence files submitted:\n${fileInfo}\n\nNote: Consider that the employee has provided concrete evidence for their work when evaluating if the supervisor's review is fair and unbiased.`
            });
        }

        const response = await axios.post(
            'https://api.deepseek.com/chat/completions',
            {
                model: 'deepseek-chat', // Using chat model for consistent JSON output
                messages: messages,
                max_tokens: 512, // Reduced for focused JSON responses
                temperature: 0.1, // Very low temperature for consistent bias detection
                response_format: { type: "json_object" }, // Ensure JSON output
                top_p: 0.9
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                timeout: 30000 // 30 second timeout
            }
        );

        const aiResponse = response.data.choices[0].message.content;

        // Parse and validate JSON response
        try {
            const parsedResult = JSON.parse(aiResponse);

            // Validate required fields
            if (typeof parsedResult.is_bias !== 'boolean' ||
                typeof parsedResult.bias_label !== 'string' ||
                typeof parsedResult.bias_reason !== 'string') {
                throw new Error('Invalid response structure from AI');
            }

            return parsedResult;
        } catch (parseError) {
            console.error('Failed to parse AI response as JSON:', aiResponse);
            // Return fallback response
            return {
                is_bias: false,
                bias_label: "analysis_error",
                bias_reason: "Unable to properly analyze the review due to technical issues. Please try again."
            };
        }

    } catch (error) {
        console.error('DeepSeek API Error:', error.response?.data || error.message);
        throw new Error(`Bias detection service error: ${error.message}`);
    }
};

// Task
exports.submitTaskReviewAndCheckBias = async (req, res) => {
    const { taskId } = req.params;
    const { review } = req.body;

    try {
        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ error: 'Task not found' });

        // Extract evidence file information if available
        const evidence_files = [];
        if (task.evidence) {
            // If evidence is a file path or multiple files
            const evidenceArray = Array.isArray(task.evidence) ? task.evidence : [task.evidence];
            evidenceArray.forEach(evidence => {
                if (evidence && typeof evidence === 'string') {
                    // Extract filename and assume common file types
                    const filename = evidence.split('/').pop() || evidence;
                    const extension = filename.split('.').pop()?.toLowerCase();
                    let mimetype = 'application/octet-stream';

                    // Determine mimetype based on extension
                    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
                        mimetype = `image/${extension === 'jpg' ? 'jpeg' : extension}`;
                    } else if (['pdf'].includes(extension)) {
                        mimetype = 'application/pdf';
                    } else if (['doc', 'docx'].includes(extension)) {
                        mimetype = 'application/msword';
                    } else if (['txt'].includes(extension)) {
                        mimetype = 'text/plain';
                    }

                    evidence_files.push({ filename, mimetype });
                }
            });
        }

        const prompt = `Analyze this workplace performance review for potential bias.

TASK DETAILS:
- Title: ${task.title || 'N/A'}
- Description: ${task.description || 'N/A'}  
- Employee Score: ${task.score || 'N/A'}
- Task Period: ${task.startDate || 'N/A'} to ${task.endDate || 'N/A'}
- Evidence Provided: ${evidence_files.length > 0 ? 'Yes' : 'No'}

SUPERVISOR REVIEW TO ANALYZE:
"${review}"

ANALYSIS REQUIREMENTS:
1. Detect bias based on: gender, race, religion, age, personal preferences, or unjustified judgments unrelated to work performance
2. If review is in Bahasa Indonesia, respond in Bahasa Indonesia
3. If review is in English, respond in English  
4. Consider whether the review fairly evaluates the task completion and evidence provided
5. Look for discriminatory language, stereotypes, or personal attacks unrelated to work quality

Focus on whether the supervisor's comments are:
- Relevant to the actual task and work quality
- Professional and objective
- Free from personal bias or discriminatory language
- Proportionate to the evidence and work submitted`;

        const result = await sendToBiasAI({ prompt, evidence_files });

        task.supervisorComment = review;
        task.bias_check = result;
        await task.save();

        res.json({
            success: true,
            msg: 'Task review submitted and bias checked',
            data: result,
            evidence_files_analyzed: evidence_files.length
        });
    } catch (err) {
        console.error('Bias check error (task):', err);
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

        // Extract any attached files or evidence from the report
        const evidence_files = [];
        if (report.attachments) {
            const attachmentsArray = Array.isArray(report.attachments) ? report.attachments : [report.attachments];
            attachmentsArray.forEach(attachment => {
                if (attachment && typeof attachment === 'string') {
                    const filename = attachment.split('/').pop() || attachment;
                    const extension = filename.split('.').pop()?.toLowerCase();
                    let mimetype = 'application/octet-stream';

                    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
                        mimetype = `image/${extension === 'jpg' ? 'jpeg' : extension}`;
                    } else if (['pdf'].includes(extension)) {
                        mimetype = 'application/pdf';
                    } else if (['doc', 'docx'].includes(extension)) {
                        mimetype = 'application/msword';
                    } else if (['txt'].includes(extension)) {
                        mimetype = 'text/plain';
                    }

                    evidence_files.push({ filename, mimetype });
                }
            });
        }

        const prompt = `Analyze this workplace monthly performance report review for potential bias.

MONTHLY REPORT DETAILS:
- Reporting Period: ${report.period || 'N/A'}
- Employee Name: ${report.userId?.name || 'N/A'}
- Employee Score: ${report.score || 'N/A'}
- Report Type: Monthly Performance Report
- Supporting Documents: ${evidence_files.length > 0 ? 'Yes' : 'No'}

SUPERVISOR REVIEW TO ANALYZE:
"${review}"

ANALYSIS REQUIREMENTS:
1. Detect bias based on: gender, race, religion, age, personal preferences, stereotypes, or unjustified judgments unrelated to actual work performance
2. If review is in Bahasa Indonesia, respond in Bahasa Indonesia
3. If review is in English, respond in English
4. Consider whether the review fairly evaluates the monthly performance and achievements
5. Look for discriminatory language, personal attacks, or stereotypes unrelated to work quality

Focus on whether the supervisor's comments are:
- Based on measurable work performance and achievements
- Professional and constructive
- Free from personal bias, stereotypes, or discriminatory language  
- Fair considering the reporting period and documented performance
- Relevant to job responsibilities and performance metrics`;

        const result = await sendToBiasAI({ prompt, evidence_files });

        report.review = review;
        report.bias_check = result;
        report.status = 'done';
        await report.save();

        res.json({
            success: true,
            msg: 'Report review submitted and bias checked',
            data: result,
            evidence_files_analyzed: evidence_files.length
        });
    } catch (err) {
        console.error('Bias check error (report):', err.message);
        res.status(500).json({ error: 'Bias check failed', details: err.message });
    }
};

// Utility function to test bias detection (for development/testing)
exports.testBiasDetection = async (req, res) => {
    const { review_text, context = "task" } = req.body;

    if (!review_text) {
        return res.status(400).json({ error: 'review_text is required' });
    }

    try {
        const prompt = `Analyze this workplace review for potential bias.

REVIEW TO ANALYZE:
"${review_text}"

ANALYSIS REQUIREMENTS:
1. Detect bias based on: gender, race, religion, age, personal preferences, stereotypes, or unjustified judgments
2. Respond in the same language as the review
3. Focus on professional vs. unprofessional language and fair evaluation

Context: This is a ${context} review.`;

        const result = await sendToBiasAI({ prompt, evidence_files: [] });

        res.json({
            success: true,
            msg: 'Bias detection test completed',
            input: { review_text, context },
            result: result
        });
    } catch (err) {
        console.error('Test bias detection error:', err);
        res.status(500).json({ error: 'Test failed', details: err.message });
    }
};

require('dotenv').config();
const Task = require('../models/Task');
const Report = require('../models/Report');
const axios = require('axios');

// Enhanced metadata analysis for evidence files
const analyzeEvidenceMetadata = (evidenceFiles, taskDescription = '', taskTitle = '') => {
  if (!evidenceFiles || evidenceFiles.length === 0) {
    return "No evidence files provided for this task.";
  }

  const fileAnalysis = evidenceFiles.map(file => {
    const isImage = file.mimetype.startsWith('image/');
    const isDocument = ['application/pdf', 'application/msword', 'text/plain'].some(type =>
      file.mimetype.includes(type) || file.mimetype.includes('wordprocessingml')
    );

    let relevanceScore = 0;
    let analysisNotes = [];

    // Analyze filename relevance to task
    const filename = file.filename.toLowerCase();
    const combinedTaskText = `${taskTitle} ${taskDescription}`.toLowerCase();

    // Score relevance based on filename content
    const relevantKeywords = ['complete', 'finish', 'done', 'result', 'output', 'proof', 'evidence', 'work', 'task', 'project'];
    relevantKeywords.forEach(keyword => {
      if (filename.includes(keyword)) relevanceScore += 2;
    });

    // Score based on task-specific words
    if (combinedTaskText) {
      const taskWords = combinedTaskText.split(' ').filter(word => word.length > 3);
      taskWords.forEach(word => {
        if (filename.includes(word)) relevanceScore += 1;
      });
    }

    // Analyze file type appropriateness
    if (isImage) {
      analysisNotes.push("Visual evidence - may demonstrate completed work, progress screenshots, or results");
      if (filename.includes('screenshot') || filename.includes('screen')) {
        analysisNotes.push("Screenshot evidence provided");
        relevanceScore += 1;
      }
    }

    if (isDocument) {
      analysisNotes.push("Document evidence - likely contains detailed reports, analysis, or documentation");
      relevanceScore += 1;
    }

    // Detect potential evidence quality indicators from filename
    const qualityIndicators = {
      high: ['final', 'complete', 'finished', 'result', 'deliverable'],
      medium: ['draft', 'progress', 'update', 'partial'],
      low: ['test', 'temp', 'backup', 'old']
    };

    let qualityLevel = 'standard';
    if (qualityIndicators.high.some(indicator => filename.includes(indicator))) {
      qualityLevel = 'high';
      relevanceScore += 1;
    } else if (qualityIndicators.medium.some(indicator => filename.includes(indicator))) {
      qualityLevel = 'medium';
    } else if (qualityIndicators.low.some(indicator => filename.includes(indicator))) {
      qualityLevel = 'low';
      relevanceScore -= 1;
    }

    return {
      filename: file.filename,
      type: isImage ? 'Image' : isDocument ? 'Document' : 'Other',
      relevance_score: Math.max(0, relevanceScore),
      quality_level: qualityLevel,
      notes: analysisNotes.join('. ')
    };
  });

  // Generate overall evidence assessment
  const totalFiles = evidenceFiles.length;
  const imageCount = fileAnalysis.filter(f => f.type === 'Image').length;
  const docCount = fileAnalysis.filter(f => f.type === 'Document').length;
  const avgRelevance = fileAnalysis.reduce((sum, f) => sum + f.relevance_score, 0) / totalFiles;
  const highQualityCount = fileAnalysis.filter(f => f.quality_level === 'high').length;

  let evidenceQuality = 'Basic';
  if (avgRelevance >= 3 && highQualityCount > 0) {
    evidenceQuality = 'Comprehensive';
  } else if (avgRelevance >= 2 || totalFiles >= 3) {
    evidenceQuality = 'Good';
  } else if (avgRelevance >= 1) {
    evidenceQuality = 'Adequate';
  }

  return `EVIDENCE ANALYSIS SUMMARY:
Total Files: ${totalFiles} (${imageCount} images, ${docCount} documents)
Evidence Quality Assessment: ${evidenceQuality}
Average Relevance Score: ${avgRelevance.toFixed(1)}/5

File Details:
${fileAnalysis.map(f =>
    `• ${f.filename} (${f.type}) - Relevance: ${f.relevance_score}, Quality: ${f.quality_level}
    ${f.notes || 'Standard file type'}`
  ).join('\n')}

Assessment Notes:
- Evidence quantity: ${totalFiles >= 3 ? 'Multiple files suggest thorough documentation' : totalFiles === 2 ? 'Dual evidence provided' : 'Single evidence file'}
- File diversity: ${imageCount > 0 && docCount > 0 ? 'Mixed visual and document evidence' : imageCount > 0 ? 'Visual evidence focus' : 'Document-based evidence'}
- Quality indicators: ${highQualityCount > 0 ? `${highQualityCount} files suggest final/completed work` : 'Standard evidence quality indicators'}`;
};

// kirim ke AI - Using Helpy-V API with JSON output support
const sendToBiasAI = async ({ prompt, evidence_files = [], evidence_metadata_analysis = null }) => {
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

    // Add enhanced evidence metadata analysis if available
    if (evidence_metadata_analysis) {
      messages.push({
        role: 'user',
        content: `ENHANCED EVIDENCE ANALYSIS:\n${evidence_metadata_analysis}\n\nUse this analysis to evaluate whether the supervisor's review is proportionate to the evidence quality and quantity. Consider if the review fairly acknowledges the effort and documentation provided by the employee.`
      });
    }

    const response = await axios.post(
      'https://mlapi.run/9331793d-efda-4839-8f97-ff66f7eaf605/v1/chat/completions',
      {
        model: 'helpy-v-reasoning-c', // Using Helpy-V Reasoning model
        messages: messages,
        max_tokens: 512, // Reduced for focused JSON responses
        temperature: 0.1, // Very low temperature for consistent bias detection
        response_format: { type: "json_object" }, // Ensure JSON output
        top_p: 0.9
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.ELICE_API_KEY}`,
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
    console.error('Helpy-V API Error:', error.message || error.response?.data);
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
- Task Deadline: ${task.deadline || 'N/A'}
- Time the staff took to complete the Task: ${task.startDate || 'N/A'} to ${task.completedDate || 'N/A'}
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

    // Generate enhanced evidence metadata analysis
    const evidence_metadata_analysis = analyzeEvidenceMetadata(evidence_files, task.description, task.title);

    const result = await sendToBiasAI({ prompt, evidence_files, evidence_metadata_analysis });

    task.supervisorComment = review;
    task.bias_check = result;
    await task.save();

    res.json({
      success: true,
      msg: 'Task review submitted and bias checked',
      data: result,
      evidence_files_analyzed: evidence_files.length,
      evidence_quality_assessment: evidence_files.length > 0 ? evidence_metadata_analysis.split('\n')[1] : 'No evidence provided'
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

    // Generate enhanced evidence metadata analysis for reports
    const evidence_metadata_analysis = analyzeEvidenceMetadata(evidence_files, `Monthly report for ${report.period}`, 'Monthly Performance Report');

    const result = await sendToBiasAI({ prompt, evidence_files, evidence_metadata_analysis });

    report.review = review;
    report.bias_check = result;
    report.status = 'done';
    await report.save();

    res.json({
      success: true,
      msg: 'Report review submitted and bias checked',
      data: result,
      evidence_files_analyzed: evidence_files.length,
      evidence_quality_assessment: evidence_files.length > 0 ? evidence_metadata_analysis.split('\n')[1] : 'No evidence provided'
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


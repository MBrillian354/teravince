// Shared utilities for submission components

// Handle task submission with status-specific logic
export const handleTaskSubmission = async (task, updateData, tasksAPI, user, dispatch, fetchTasksByUserId) => {
    await tasksAPI.update(task._id, updateData);
    
    // Refresh tasks after submission
    if (user?._id) {
        dispatch(fetchTasksByUserId(user._id));
    }
};

// Handle evidence file upload
export const handleEvidenceUpload = async (file, task, tasksAPI, taskId, dispatch, fetchTaskById) => {
    if (!file || !task) throw new Error('Invalid file or task');

    const formData = new FormData();
    formData.append('evidence', file);

    await tasksAPI.uploadEvidence(task._id, formData);

    // Refresh task data
    if (taskId) {
        dispatch(fetchTaskById(taskId));
    } else {
        dispatch(fetchTaskById(task._id));
    }
};

// Validate KPI achieved amounts
export const validateKpiAmounts = (task, kpiAchievedAmounts) => {
    if (!task?.kpis || task.kpis.length === 0) return { isValid: true, missingKpis: [] };

    const missingKpis = [];
    task.kpis.forEach((kpi, index) => {
        if (!kpiAchievedAmounts[index] || kpiAchievedAmounts[index].toString().trim() === '') {
            missingKpis.push(kpi.kpiTitle);
        }
    });

    return {
        isValid: missingKpis.length === 0,
        missingKpis
    };
};

// Create KPI fields for editing (both components allow KPI editing)
export const createEditableKpiFields = (task, kpiAchievedAmounts, handleKpiAchievedAmountChange) => {
    if (!task?.kpis || task.kpis.length === 0) {
        return [{
            type: 'textarea',
            name: 'kpis',
            label: 'Key Performance Indicators (KPIs)',
            rows: 3,
            defaultValue: 'No KPIs defined for this task',
            disabled: true
        }];
    }

    return task.kpis.map((kpi, index) => ([
        {
            type: 'text',
            name: `kpi_title_${index}`,
            label: `KPI ${index + 1}: ${kpi.kpiTitle}`,
            defaultValue: `Target: ${kpi.targetAmount} (${kpi.operator})`,
            disabled: true,
            group: 'kpis',
            isDynamic: false,
            position: 'top'
        },
        {
            type: 'number',
            name: `kpi_achieved_${index}`,
            label: 'Achieved Amount',
            defaultValue: kpiAchievedAmounts[index] || '',
            disabled: false,
            required: true,
            placeholder: 'Enter achieved amount',
            group: 'kpis',
            isDynamic: false,
            position: 'bottom',
            min: 0,
            onChange: (value) => handleKpiAchievedAmountChange(index, value)
        }
    ])).flat();
};

// Initialize KPI achieved amounts from task data
export const initializeKpiAmounts = (task) => {
    if (!task?.kpis || task.kpis.length === 0) return {};
    
    const initialKpiAmounts = {};
    task.kpis.forEach((kpi, index) => {
        initialKpiAmounts[index] = kpi.achievedAmount || '';
    });
    return initialKpiAmounts;
};

// Update KPI data in task update payload
export const updateKpiData = (task, kpiAchievedAmounts, updateData) => {
    if (task?.kpis && task.kpis.length > 0) {
        const updatedKpis = task.kpis.map((kpi, index) => ({
            ...kpi,
            achievedAmount: parseFloat(kpiAchievedAmounts[index]) || 0
        }));
        updateData.kpis = updatedKpis;
    }
    return updateData;
};

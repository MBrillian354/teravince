import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    dashboardData: [
        { label: "Supervisors", value: 85 },
        { label: "Staffs", value: 31 },
        { label: "Admins", value: 31 },
        { label: "Active Job Titles", value: 7 },
        { label: "Draft Job Titles", value: 2 },
        { label: "Unassigned Employees", value: 2 }
    ],
    accountsData: [
        { id: 1, name: 'Mei Tanaka', jobTitle: 'Admin', position: 'Admin', status: 'Full Time' },
        { id: 2, name: 'Kenji Sato', jobTitle: 'Supervisor', position: 'Supervisor', status: 'Contract' },
        { id: 3, name: 'Akihiro Nakamura', jobTitle: 'Staff', position: 'Staff', status: 'PIP' },
        { id: 4, name: 'Sakura Yamamoto', jobTitle: '', position: '', status: 'Contract' },
        { id: 5, name: 'Ren Tanaka', jobTitle: '', position: '', status: 'Contract' },
        { id: 6, name: 'Ayumi Watanabe', jobTitle: '', position: '', status: 'Contract' },
    ],
    jobsData: [
        { id: 1, title: 'Software Engineer', description: 'Develop applications', employees: 5, status: 'Active' },
        { id: 2, title: 'Product Manager', description: 'Oversee product roadmap', employees: 3, status: 'Draft' }
    ]
};

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        addJob: (state, action) => {
            state.jobsData.push(action.payload);
            console.log('Job added:', action.payload);
        },
        updateJob: (state, action) => {
            const updated = action.payload;
            state.jobsData = state.jobsData.map(job =>
                job.id === updated.id ? { ...job, ...updated } : job
            );
            console.log('Job updated:', updated);
        },
        deleteJob: (state, action) => {
            const id = action.payload;
            state.jobsData = state.jobsData.filter(job => job.id !== id);
            console.log('Job deleted:', id);
        }
    }
});

export const { addJob, updateJob, deleteJob } = adminSlice.actions;

export default adminSlice.reducer;
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
        { id: 1, firstName: 'Mei',lastName: 'Tanaka', jobTitle: 'Admin', position: 'Admin', status: 'Full Time' },
        { id: 2, firstName: 'Kenji',lastName: 'Sato', jobTitle: 'Supervisor', position: 'Supervisor', status: 'Contract' },
        { id: 3, firstName: 'Akihiro',lastName: 'Nakamura', jobTitle: 'Staff', position: 'Staff', status: 'PIP' },
        { id: 4, firstName: 'Sakura',lastName: 'Yamamoto', jobTitle: '', position: '', status: 'Contract' },
        { id: 5, firstName: 'Ren',lastName: 'Tanaka', jobTitle: '', position: '', status: 'Contract' },
        { id: 6, firstName: 'Ayumi',lastName: 'Watanabe', jobTitle: '', position: '', status: 'Contract' },
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
        },
        addAccount: (state, action) => {
            const newAccount = {
                id: Date.now(), // Temporary ID generation
                ...action.payload,
                status: 'Full Time' // Default status
            };
            state.accountsData.push(newAccount);
            console.log('Account added:', newAccount);
        },
        updateAccount: (state, action) => {
            const updated = action.payload;
            state.accountsData = state.accountsData.map(account =>
                account.id === updated.id ? { ...account, ...updated } : account
            );
            console.log('Account updated:', updated);
        },
        deleteAccount: (state, action) => {
            const id = action.payload;
            state.accountsData = state.accountsData.filter(account => account.id !== id);
            console.log('Account deleted:', id);
        }

    }
});

export const { addJob, updateJob, deleteJob, addAccount, updateAccount, deleteAccount } = adminSlice.actions;

export default adminSlice.reducer;
import StatsCard from '../components/StatsCard'
import DataTable from '../components/DataTable'
import { Link } from 'react-router-dom';

const ManageJobs = () => {
    const jobStats = [
        { label: "Active Titles", value: 3 },
        { label: "Drafts", value: 2 }
    ];

    // Define sample table data
    const jobData = [
        { id: 1, title: 'Software Engineer', description: 'Develop applications', employees: 5, status: 'Active' },
        { id: 2, title: 'Product Manager', description: 'Oversee product roadmap', employees: 3, status: 'Draft' }
    ];

    // Define table columns configuration
    const columns = [
        { header: 'Job Title', accessor: 'title' },
        { header: 'Job Description', accessor: 'description' },
        { header: 'Number of Employees', accessor: 'employees' },
        { header: 'Status', accessor: 'status' }
    ];

    return (
        <>
            <div className="flex justify-between items-center">
                <div className='page-title my-4'>Manage Jobs</div>
                <Link to="/admin-jobs/new" className="btn-primary">Create New Job</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                {jobStats.map((stat, index) => (
                    <StatsCard key={index} label={stat.label} value={stat.value} />
                ))}
            </div>
            <div>
                <DataTable
                    columns={columns}
                    data={jobData}
                    rowKey="id"
                    onRowClick={(row) => console.log('Row clicked:', row)}
                />
            </div>
        </>
    )
}

export default ManageJobs
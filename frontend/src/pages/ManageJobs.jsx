import StatsCard from '../components/StatsCard'
import DataTable from '../components/DataTable'
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ManageJobs = () => {
    // Define sample table data
    const jobData = useSelector((state) => state.admin.jobsData);

    const jobStats = [
        { label: "Active Jobs", value: jobData.filter(job => job.status === 'Active').length },
        { label: "Drafts", value: jobData.filter(job => job.status === 'Draft').length }
    ];

    // Define table columns configuration
    const columns = [
        { header: 'Job Title', accessor: 'title' },
        { header: 'Job Description', accessor: 'description' },
        { header: 'Number of Employees', accessor: 'employees' },
        { header: 'Status', accessor: 'status' },
        { header: 'Actions', render: row => <button onClick={(e) => { console.log('Action on', row); e.stopPropagation(); }}>Edit</button> }
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
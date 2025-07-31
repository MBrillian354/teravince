import StatsCard from '../components/StatsCard'

const JobsView = () => {
    const jobStats = [
        { label: "Active Titles", value: 3 },
        { label: "Drafts", value: 2 }
    ];

    return (
        <>
            <div className='page-title my-4'>Manage Jobs</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                {jobStats.map((stat, index) => (
                    <StatsCard key={index} label={stat.label} value={stat.value} />
                ))}
            </div>
            <div>
                <p>Table here</p>
            </div>
        </>
    )
}

export default JobsView
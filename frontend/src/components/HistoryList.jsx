const HistoryList = ({ data = [] }) => {

  // Status mapping function
  const mapStatus = (status) => {
    const statusMap = {
      'draft': 'DRAFT',
      'inProgress': 'ONGOING',
      'submittedAndAwaitingReview': 'UNDER REVIEW',
      'submittedAndAwaitingApproval': 'AWAITING APPROVAL',
      'completed': 'FINISHED',
      'submissionRejected': 'REJECTED',
      'approvalRejected': 'APPROVAL REJECTED'
    };
    return statusMap[status] || status?.toUpperCase() || 'UNKNOWN';
  };

  const history = data.map(item => ({
    task: item.title || 'Untitled Task',
    status: mapStatus(item.status),
    file: item.evidence || null
  }));

  return (
    <div className="card-static border">
      <h2 className="text-lg font-semibold mb-4">History</h2>
      {history.length === 0 ? (
        <div className="text-gray-500 text-center py-6">No history available.</div>
      ) : (
        <ul className="space-y-3">
          {history.map((item, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 hover:shadow-sm transition"
            >
              <div className="font-medium">{item.task}</div>
              <div className="text-sm flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 text-xs font-semibold">
                  {item.status}
                </span>
                {item.file && (
                  <a
                    href={`${import.meta.env.VITE_API_BASE_URL}/${item.file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium no-underline"
                  >
                    📄 {item.file}
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HistoryList;

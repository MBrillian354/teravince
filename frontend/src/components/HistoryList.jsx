import React from 'react';

const HistoryList = () => {
  const history = [
    { task: 'Monthly Report', status: 'DRAFT', file: 'report.pdf' },
    { task: 'Contact Client', status: 'ONGOING', file: null },
    { task: 'Contract Extending', status: 'FINISHED', file: 'proof.pdf' },
  ];

  return (
    <div className="bg-[#F8F8F8] p-4 rounded-lg shadow">
      <div className="text-lg font-semibold mb-2">History</div>
      <ul className="text-sm">
        {history.map((item, idx) => (
          <li key={idx} className="flex justify-between py-1 border-b last:border-none">
            <span>– {item.task}</span>
            <span className="text-gray-600">
              {item.status}
              {item.file && (
                <a
                  href={`/${item.file}`}
                  className="ml-2 underline text-blue-600"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.file}
                </a>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistoryList;

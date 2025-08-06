import React from 'react';

const HistoryList = () => {
  const history = [
    { task: 'Monthly Report', status: 'DRAFT', file: 'report.pdf' },
    { task: 'Contact Client', status: 'ONGOING', file: null },
    { task: 'Contract Extending', status: 'FINISHED', file: 'proof.pdf' },
  ];

  return (
    <div className="">
      <h2 className="text-lg font-semibold mb-4">History</h2>
      <ul className="space-y-3">
        {history.map((item, idx) => (
          <li
            key={idx}
            className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 bg-accent hover:shadow-sm transition"
          >
            <div className="text-[#1B1717] font-medium">{item.task}</div>
            <div className="text-sm text-gray-700 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 text-xs font-semibold">
                {item.status}
              </span>
              {item.file && (
                <a
                  href={`/${item.file}`}
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
    </div>
  );
};

export default HistoryList;

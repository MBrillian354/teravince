import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  // build pages array: 1…5, …, last
  const pages = [];
  for (let i = 1; i <= Math.min(5, totalPages); i++) pages.push(i);
  if (totalPages > 5) pages.push('...', totalPages);

  return (
    <div className="flex justify-center items-center space-x-4 py-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
      >
        ← Previous
      </button>

      <nav className="flex space-x-1">
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={i} className="px-3 py-1">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`px-3 py-1 rounded ${
                p === currentPage
                  ? 'bg-indigo-500 text-white'
                  : 'hover:bg-gray-200'
              }`}
            >
              {p}
            </button>
          )
        )}
      </nav>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
      >
        Next →
      </button>
    </div>
  );
}

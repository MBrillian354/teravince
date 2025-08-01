import React from 'react';

export default function DataTable({
  columns,
  data,
  rowKey = 'id',
  onRowClick,
  containerClass = 'bg-white rounded shadow overflow-x-auto mb-6'
}) {
  return (
    <div className={containerClass}>
      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th
                key={col.header}
                className={`p-3 text-${col.align || 'left'}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row[rowKey]}
              className={`border-t cursor-pointer ${
                onRowClick ? 'hover:bg-gray-50' : ''
              }`}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((col) => (
                <td
                  key={col.header}
                  className={`p-3 text-${col.align || 'left'}`}
                >
                  {col.render
                    ? col.render(row)
                    : /* fallback to simple accessor */ row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

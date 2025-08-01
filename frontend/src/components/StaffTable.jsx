import React from 'react';

export default function StaffTable({ staffList, selectedId, onSelect }) {
  return (
    <div className="bg-white rounded shadow overflow-x-auto mb-6">
      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left"><input type="checkbox" /></th>
            <th className="p-3 text-left">Employee Name</th>
            <th className="p-3 text-left">Employee ID</th>
            <th className="p-3 text-left">Job Title</th>
            <th className="p-3 text-left">Contract Term</th>
            <th className="p-3 text-right">•••</th>
          </tr>
        </thead>
        <tbody>
          {staffList.map((s) => (
            <tr
              key={s.id}
              className={`border-t cursor-pointer ${s.id === selectedId ? 'bg-gray-50' : ''}`}
              onClick={() => onSelect(s.id)}
            >
              <td className="p-3">
                <input type="checkbox" checked={s.id === selectedId} readOnly />
              </td>
              <td className="p-3">{s.name}</td>
              <td className="p-3">{s.id}</td>
              <td className="p-3">{s.title}</td>
              <td className="p-3">{s.contract}</td>
              <td className="p-3 text-right">•••</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

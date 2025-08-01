import React from 'react';
import { NavLink } from 'react-router-dom';

const tabs = [
  { path: '/spv-reports',          label: 'Reports'          },
  { path: '/spv-jobs',  label: 'Job Description' },
  { path: '/spv-tasks',            label: 'Tasks', badge: 2  },
];

export default function TasksReportsTabs() {
  return (
    <nav className="flex space-x-6 border-b border-gray-200 mb-6">
      {tabs.map(({ path, label, badge }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            `pb-2 ${
              isActive
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-gray-800'
            }`
          }
        >
          {label}
          {badge != null && (
            <span className="ml-1 inline-block bg-gray-200 text-gray-700 text-xs px-1 rounded-full">
              {badge}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

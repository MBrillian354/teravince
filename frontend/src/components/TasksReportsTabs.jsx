import { NavLink } from 'react-router-dom';

const tabs = [
  { path: '/reports/', label: 'Reports', end: true },
  { path: '/reports/job-description', label: 'Job Description' },
  { path: '/reports/tasks', label: 'Tasks'},
  // { path: '/reports/tasks', label: 'Tasks', badge: 2 },
];

export default function TasksReportsTabs() {
  return (
    <nav className="flex space-x-6 border-b border-gray-300 mb-6">
      {tabs.map(({ path, label, badge }) => (
        <NavLink
          key={path}
          to={path}
          end={path.endsWith('/')}
          className={({ isActive }) => `
            pb-2 ${isActive
              ? 'text-indigo-600 border-b-3 border-indigo-600'
              : 'text-gray-600 hover:text-gray-800'
            }`
          }
        >
          {label}
          {badge != null && (
            <span className="ml-1 inline-block bg-muted text-gray-700 text-xs px-1 rounded-full">
              {badge}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

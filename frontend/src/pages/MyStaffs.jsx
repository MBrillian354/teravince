import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import DataTable from '../components/DataTable';

export default function MyStaffs() {
const navigate = useNavigate();
const today    = new Date().toISOString().slice(0, 10);

// date‐range state
const [startDate, setStartDate] = useState('');
const [endDate,   setEndDate]   = useState('');

// dummy columns
const staffColumns = [
  {
    header: '',
    render: (s) => (
      <input
        type="checkbox"
        checked={s.id === selectedId}
        readOnly
      />
    ),
    align: 'center'
  },
  { header: 'Employee Name', accessor: 'name' },
  { header: 'Employee ID',   accessor: 'id'   },
  { header: 'Job Title',     accessor: 'title'},
  { header: 'Contract Term', accessor: 'contract' },
];

// dummy staff data
const staffList = [
 {
   id:       '3210001',
   name:     'Jane Doe',
   title:    'Social Media Trainee',
   contract: '12/01/2025 – 12/01/2026',
   email:    'jane@teravince.com',
   phone:    '+62 8123 4567 8901',
   address:  'Jl. Jababeka Jauh Disana XII, Kab. Bekasi, Jawa Barat 12345',
 },
 {
   id:       '3210002',
   name:     'Mark Wiens',
   title:    'Marketing Specialist',
   contract: '12/01/2025 – 12/01/2026',
   email:    'mark@teravince.com',
   phone:    '+62 8123 4567 8902',
   address:  'Jl. Jababeka Jauh Disana XII, Kab. Bekasi, Jawa Barat',
 },
 {
   id:       '3210003',
   name:     'Max Verstappen',
   title:    'Communications Officer',
   contract: '12/01/2025 – 12/01/2026',
   email:    'max@teravince.com',
   phone:    '+62 8123 4567 8903',
   address:  'Jl. Jababeka Jauh Disana XII, Kab. Bekasi, Jawa Barat',
 },
];

const [selectedId, setSelectedId] = useState(staffList[0].id);
const selected = staffList.find((s) => s.id === selectedId);

return (
    <div className="container mx-auto px-4">
      {/* Big header */}
      <h1 className="text-3xl font-bold mb-6">
        Welcome back, <span className="underline">Supervisor</span>.
      </h1>
      
      {/* 1. Underline-only tab bar */}
      <nav className="flex space-x-6 border-b border-gray-200 mb-4">
        <NavLink
          to="/spv-dashboard"
          end
          className={({ isActive }) =>
            `pb-2 ${
              isActive
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-gray-800'
            }`
          }
        >
          Overview
        </NavLink>
        <NavLink
          to="/spv-staffs"
          className={({ isActive }) =>
            `pb-2 ${
              isActive
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-gray-800'
            }`
          }
        >
          My Staffs
        </NavLink>
      </nav>

      {/* 2–4. Sleek date‐range row (no shadows, white inputs, gray borders, right-aligned) */}
      {/* My Staff’s Profile + Labeled Date Range */}
<div className="flex justify-between items-end mb-4">
  {/* Left label */}
  <div className="text-lg font-medium text-gray-700">
    My Staff’s Profile
  </div>

  {/* Right: two date inputs, each with its own label */}
  <div className="flex space-x-6">
    {/* Start Date */}
    <div className="flex flex-col">
      <label htmlFor="start-date" className="text-sm text-gray-600 mb-1">
        Start Date
      </label>
      <input
        id="start-date"
        type="date"
        value={startDate}
        onChange={e => setStartDate(e.target.value)}
        className="w-36 px-2 py-1 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
    {/* End Date */}
    <div className="flex flex-col">
      <label htmlFor="end-date" className="text-sm text-gray-600 mb-1">
        End Date
      </label>
      <input
        id="end-date"
        type="date"
        value={endDate}
        onChange={e => setEndDate(e.target.value)}
        max={today}
        className="w-36 px-2 py-1 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  </div>
</div>


   {/* Staff Table */}
     <DataTable
      columns={staffColumns}
      data={staffList}
      rowKey="id"
      onRowClick={({ id })=> setSelectedId(id)}
     />
   {/* Selected Staff Profile */}
   {selected && (
     <div className="bg-white rounded shadow p-6 flex items-center space-x-6">
       <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
         {/* avatar placeholder */}
         <span className="text-gray-400 text-2xl">👤</span>
       </div>
       <div>
         <h3 className="text-xl font-semibold">{selected.name}</h3>
         <p className="text-gray-600">{selected.title}</p>
         <p className="text-gray-500 mt-1">{selected.email}</p>
         <p className="text-gray-500">{selected.address}</p>
         <p className="text-gray-500">{selected.phone}</p>
       </div>
     </div>
   )}
 </div>
);
}
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function MyStaffs() {
const navigate = useNavigate();
const today    = new Date().toISOString().slice(0, 10);

// date‐range state
const [startDate, setStartDate] = useState('');
const [endDate,   setEndDate]   = useState('');

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
   <h2 className="text-3xl font-bold mb-6">
     Welcome back, <span className="underline">Supervisor</span>.
   </h2>

   {/* Tabs with underline only */}
      <nav className="flex space-x-6 border-b border-gray-200 mb-4">
        <NavLink
          to="/"
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
          to="/staffs"
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


     {/* Separate Date‐picker, no colored card, white inputs */}
    <div className="rounded shadow px-4 py-3 mb-6 flex justify-end items-center space-x-3">
        <div className="rounded p-2 shadow-inner">
         <input
           type="date"
           value={startDate}
           onChange={e=>setStartDate(e.target.value)}
           className="bg-white text-sm focus:outline-none rounded"
           placeholder="Start date"
         />
       </div>
       <span className="text-gray-500">→</span>
       <div className="flex items-center bg-gray-50 rounded p-2">
         <input
           type="date"
           value={endDate}
           onChange={e=>setEndDate(e.target.value)}
           className="bg-white text-sm focus:outline-none rounded"
           max={today}
           placeholder="End date"
         />
       </div>
     </div>

   {/* Staff Table */}
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
             onClick={() => setSelectedId(s.id)}
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
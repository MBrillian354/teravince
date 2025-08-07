import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import DataTable from '../../components/DataTable';
import { accountsAPI } from '../../utils/api';

export default function MyStaffs() {
  const navigate = useNavigate();
  const today = new Date().toISOString().slice(0, 10);

  // State for data and UI
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState('');

  // date‐range state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Staff columns configuration
  const staffColumns = [
    { header: 'Staff Name', accessor: 'name' },
    { header: 'Staff ID', accessor: '_id' },
    { header: 'Job Title', accessor: 'jobTitle' },
    {
      header: 'Actions',
      render: (staff) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/dashboard/staffs/${staff._id}`);
          }}
          className="btn-secondary text-xs"
        >
          View Details
        </button>
      ),
      align: 'center'
    }
  ];

  // Fetch staff data from backend
  const fetchStaffData = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await accountsAPI.getAll();
      const allUsers = response.data;

      // Filter for staff members only and format the data
      const staffMembers = allUsers
        .filter(user => user.role === 'staff')
        .map(user => ({
          _id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          contactInfo: user.contactInfo || '',
          address: user.address || '',
          jobTitle: user.jobId?.title || 'Unassigned',
          position: user.position || '',
          profilePicture: user.profilePicture || '',
          contractStartDate: user.contractStartDate,
          contractEndDate: user.contractEndDate,
          status: user.status.toUpperCase()
        }));

      setStaffList(staffMembers);

      // Set first staff member as selected if available
      if (staffMembers.length > 0) {
        setSelectedId(staffMembers[0]._id);
      }

    } catch (err) {
      console.error('Error fetching staff data:', err);
      setError('Failed to load staff data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchStaffData();
  }, []);

  // Filter staff based on date range
  const filteredStaffList = React.useMemo(() => {
    if (!startDate && !endDate) return staffList;

    return staffList.filter(staff => {
      const contractStart = staff.contractStartDate ? new Date(staff.contractStartDate) : null;
      const contractEnd = staff.contractEndDate ? new Date(staff.contractEndDate) : null;

      let passesFilter = true;

      if (startDate) {
        const filterStart = new Date(startDate);
        passesFilter = passesFilter && contractStart && contractStart >= filterStart;
      }

      if (endDate) {
        const filterEnd = new Date(endDate);
        passesFilter = passesFilter && contractEnd && contractEnd <= filterEnd;
      }

      return passesFilter;
    });
  }, [staffList, startDate, endDate]);

  return (
    <div className="container mx-auto px-4">
      {/* Big header */}
      <h1 className="page-title mb-6">
        Welcome back, <span className="underline">Supervisor</span>.
      </h1>

      {/* 1. Underline-only tab bar */}
      <nav className="flex space-x-6 border-b border-gray-200 mb-4">
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            `pb-2 ${isActive
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-600 hover:text-gray-800'
            }`
          }
        >
          Overview
        </NavLink>
        <NavLink
          to="/dashboard/staffs"
          className={({ isActive }) =>
            `pb-2 ${isActive
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-600 hover:text-gray-800'
            }`
          }
        >
          My Staffs
        </NavLink>
      </nav>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-danger rounded">
          {error}
        </div>
      )}

      {/* 2–4. Sleek date‐range row (no shadows, white inputs, gray borders, right-aligned) */}
      {/* My Staff's List + Labeled Date Range */}
      <div className="flex justify-between items-end mb-4">
        {/* Left label */}
        <div className="text-lg font-medium text-gray-700">
          My Staff's List
        </div>



        {/* Right: two date inputs, each with its own label */}
        {/* <div className="flex space-x-6">
          <div className="flex flex-col">
            <label htmlFor="start-date" className="text-sm text-gray-600 mb-1">
              Contract Start Date
            </label>
            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-36 px-2 py-1 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="end-date" className="text-sm text-gray-600 mb-1">
              Contract End Date
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
        </div> */}


        
      </div>



      {/* Loading state */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">Loading staff data...</p>
        </div>
      ) : (
        <>
          {/* Staff Table */}
          <DataTable
            title="Staff Members"
            columns={staffColumns}
            data={filteredStaffList}
            rowKey="_id"
            onRowClick={({ _id }) => setSelectedId(_id)}
            variant='gradient'
          />

          {/* No staff message */}
          {!loading && filteredStaffList.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {staffList.length === 0
                ? "No staff members found."
                : "No staff members match the selected date range."
              }
            </div>
          )}
        </>
      )}
    </div>
  );
}

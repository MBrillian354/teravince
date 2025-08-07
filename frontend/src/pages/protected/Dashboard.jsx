import React from 'react';
import { RoleBasedContent } from '../../components/navigation/RoleBasedRoute';
import AdminDashboard from '../admin/AdminDashboard';
import SPVDashboard from '../supervisor/SPVDashboard';
import StaffDashboard from '../staff/StaffDashboard';

const Dashboard = () => {
  return (
    <RoleBasedContent
      adminContent={<AdminDashboard />}
      supervisorContent={<SPVDashboard />}
      staffContent={<StaffDashboard />}
    />
  );
};

export default Dashboard;

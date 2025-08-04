import React from 'react';
import { RoleBasedContent } from '../components/RoleBasedRoute';
import AdminDashboard from './AdminDashboard';
import SPVDashboard from './SPVDashboard';
import StaffDashboard from './StaffDashboard';

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

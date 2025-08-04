import React from 'react';
import { RoleBasedContent } from '../components/RoleBasedRoute';
import Tasks from './Tasks';
import StaffTasks from './StaffTasks';

const TasksPage = () => {
  return (
    <RoleBasedContent
      supervisorContent={<Tasks />}
      staffContent={<StaffTasks />}
    />
  );
};

export default TasksPage;

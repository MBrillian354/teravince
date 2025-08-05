import React from 'react';
import { RoleBasedContent } from '../components/RoleBasedRoute';
import Tasks from './TeamTasks';
import ManageTasks from './ManageTasks';

const TasksPage = () => {
  return (
    <RoleBasedContent
      supervisorContent={<Tasks />}
      staffContent={<ManageTasks />}
    />
  );
};

export default TasksPage;

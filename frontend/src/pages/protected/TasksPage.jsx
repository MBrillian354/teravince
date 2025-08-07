import { RoleBasedContent } from '../../components/RoleBasedRoute';
import Tasks from '../supervisor/TeamTasks';
import ManageTasks from '../staff/ManageTasks';

const TasksPage = () => {
  return (
    <RoleBasedContent
      supervisorContent={<Tasks />}
      staffContent={<ManageTasks />}
    />
  );
};

export default TasksPage;

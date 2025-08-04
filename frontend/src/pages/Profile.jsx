import React from 'react';
import { RoleBasedContent } from '../components/RoleBasedRoute';
import MyProfile from './MyProfile';
import StaffMyProfile from './StaffMyProfile';

const Profile = () => {
  return (
    <RoleBasedContent
      adminContent={<MyProfile />}
      supervisorContent={<MyProfile />}
      staffContent={<StaffMyProfile />}
    />
  );
};

export default Profile;

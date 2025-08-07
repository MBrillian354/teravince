import { useState, useEffect, useMemo } from 'react';
import { accountsAPI } from '../utils/api';
import { authService } from '../utils/authService';
import DynamicForm from '../components/DynamicForm';

export default function MyProfile() {
  const [user, setUser] = useState(null);
  const [profilePicture, setPhoto] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load user data when component mounts
  useEffect(() => {
    console.log('MyProfile: Loading user data...');

    const userData = authService.getStoredUser();
    console.log('MyProfile: user object:', userData);

    if (userData) {
      setUser(userData);
      // Load existing profilePicture if available
      if (userData.profilePicture) {
        console.log('MyProfile: Setting profile picture:', userData.profilePicture);
        setPhoto(`http://localhost:5000/${userData.profilePicture}`);
      }
    } else {
      console.log('MyProfile: No user data available');
    }
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError('Image size should be less than 2MB');
        return;
      }

      // Check image dimensions (min 400x400)
      const img = new Image();
      img.onload = () => {
        if (img.width < 400 || img.height < 400) {
          setError('Image should be at least 400×400 pixels');
          return;
        }
        setPhoto(URL.createObjectURL(file));
        setSelectedFile(file);
        setError('');
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const handlePhotoUpload = async () => {
    if (!selectedFile) {
      setError('Please select a profilePicture first');
      return;
    }

    const userId = user.id || user._id;
    if (!userId) {
      setError('User not found');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('profilePicture', selectedFile);

      const response = await accountsAPI.uploadPhoto(userId, formData);

      // Update user data in localStorage and state
      const updatedUser = { ...user, profilePicture: response.data.user.profilePicture };
      setUser(updatedUser);
      authService.storeAuthData(authService.getToken(), updatedUser);

      // Update the displayed profilePicture
      setPhoto(`http://localhost:5000/${response.data.user.profilePicture}`);
      setSelectedFile(null);
      setSuccess('Photo uploaded successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);

    } catch (error) {
      console.error('Photo upload error:', error);
      setError(error.response?.data?.msg || 'Failed to upload profilePicture. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setSelectedFile(null);
  };

  // Generate form fields with current user data
  const userDetailsFields = useMemo(() => [
    {
      type: 'text',
      name: 'firstName',
      label: 'First Name',
      defaultValue: user ? user.firstName : '',
      required: true,
      group: 'name'
    },
    {
      type: 'text',
      name: 'lastName',
      label: 'Last Name',
      defaultValue: user ? user.lastName : '',
      required: true,
      group: 'name'
    },
    {
      type: 'text',
      name: 'jobId',
      label: 'Job Title',
      defaultValue: user ? user.jobId?.title : 'Unassigned',
      disabled: true, // Assuming job title is not editable
    },
    {
      type: 'text',
      name: 'address',
      label: 'Address',
      defaultValue: user ? user.address : ''
    },
    {
      type: 'number',
      name: 'contactInfo',
      label: 'Contact Info',
      defaultValue: user ? user?.contactInfo : ''
    }
  ], [user]);


  // Show loading while user data is being loaded
  if (!user) {
    return (
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading profile...</div>
        </div>
      </div>
    );
  }

  const handleProfileUpdate = async (updatedFormData) => {
    console.log('Profile update initiated with data:', updatedFormData);
    console.log('Current user object:', user);

    const userId = user?.id || user?._id;
    if (!userId) {
      console.error('No user ID found. User object:', user);
      setError('User not found');
      return;
    }

    console.log('Using user ID:', userId);
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Remove jobId from the data before sending to backend
      const { jobId, ...dataToSend } = updatedFormData;

      // Update user profile via API
      const response = await accountsAPI.update(userId, dataToSend);
      console.log('API update response:', response);

      // Update local state and localStorage
      const updatedUser = { ...user, ...updatedFormData };
      setUser(updatedUser);
      authService.storeAuthData(authService.getToken(), updatedUser);

      setSuccess('Profile updated successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);

    } catch (error) {
      console.error('Profile update error:', error);
      setError(error.response?.data?.msg || 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4">
      {/* Page title */}
      <h1 className="page-title mb-6">My Profile</h1>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-danger px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-success-light border border-green-400 text-success px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {!user ? null : (



        <div className="card-static mb-6 space-y-6">
          {/* Profile Photo + Requirements */}
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-12">
            {/* Avatar + Upload/Remove */}
            <div className="flex-shrink-0 flex items-center space-x-6">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                {profilePicture
                  ? <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  : <span className="text-gray-300 text-4xl">👤</span>}
              </div>
              <div className="flex flex-col">
                {!selectedFile && (
                  <label
                    htmlFor="profilePicture-upload"
                    className="btn-secondary cursor-pointer"
                  >
                    Upload Photo
                  </label>
                )}
                <input
                  id="profilePicture-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
                {selectedFile && (
                  <button
                    type="button"
                    className="mt-2 btn-primary"
                    onClick={handlePhotoUpload}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save'}
                  </button>
                )}
                <button
                  type="button"
                  className="mt-2 text-sm text-indigo-600 hover:underline disabled:text-gray-400 hover:cursor-pointer disabled:cursor-not-allowed"
                  onClick={handleRemovePhoto}
                  disabled={!profilePicture}
                >
                  remove
                </button>
              </div>
            </div>

            {/* Divider then Requirements */}
            <div className="border-t md:border-t-0 md:border-l border-gray-200 pt-6 md:pt-0 md:pl-8 flex-1 text-sm text-gray-700 space-y-2">
              <p className="font-medium">Image requirements:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Min. 400 × 400 px</li>
                <li>Max. 2 MB</li>
                <li>A picture of yourself</li>
              </ol>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* User Details Form */}
          <div className="space-y-4">
            <p className="font-medium text-gray-800">User Details</p>

            <DynamicForm
              fields={userDetailsFields}
              onSubmit={handleProfileUpdate}
              submitButtonText="Update My Profile"
              showSubmitButton={true}
              className="space-y-4"
            />
          </div>
        </div>

      )}
    </div>
  );
}

import React, { useState } from 'react';
import DynamicForm from '../components/DynamicForm';

export default function MyProfile() {
  const [photo, setPhoto] = useState(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) setPhoto(URL.createObjectURL(file));
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
  };

  const userDetailsFields = [
    {
      type: 'text',
      name: 'firstName',
      label: 'First Name',
      placeholder: 'Placeholder',
      group: 'name'
    },
    {
      type: 'text',
      name: 'lastName',
      label: 'Last Name',
      placeholder: 'Placeholder',
      group: 'name'
    },
    {
      type: 'text',
      name: 'jobTitle',
      label: 'Job Title',
      placeholder: 'Placeholder'
    },
    {
      type: 'text',
      name: 'address',
      label: 'Address',
      placeholder: 'Placeholder'
    },
    {
      type: 'text',
      name: 'contactInfo',
      label: 'Contact Info',
      placeholder: 'Placeholder'
    }
  ];

  const handleProfileUpdate = (formData) => {
    console.log('Profile update:', formData);
    // Handle profile update logic here
  };

  return (
    <div className="container mx-auto px-4">
      {/* Page title */}
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <div className="bg-white rounded p-6 mb-6 space-y-6">
        {/* Profile Photo + Requirements */}
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-12">
          {/* Avatar + Upload/Remove */}
          <div className="flex-shrink-0 flex items-center space-x-6">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
              {photo
                ? <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                : <span className="text-gray-300 text-4xl">👤</span>}
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="photo-upload"
                className="btn-secondary"
              >
                Upload Photo
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
              <button
                type="button"
                className="mt-2 text-sm text-indigo-600 hover:underline"
                onClick={handleRemovePhoto}
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
            showSubmitButton={false}
            className="space-y-4"
          />
          
          {/* Custom Update Button */}
          <div className="flex justify-end">
            <button 
              className="btn-secondary"
              onClick={() => {
                // You can trigger form submission here if needed
                console.log('Update profile clicked');
              }}
            >
              Update My Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

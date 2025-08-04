import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DynamicForm from '../components/DynamicForm';

export default function MyProfile() {
  const navigate = useNavigate();
  const [profilePicture, setPhoto] = useState(null);
  
  // Complete mock user data
  const mockUserData = {
    firstName: 'John',
    lastName: 'Doe',
    jobTitle: 'Senior Developer',
    address: '123 Tech Street, Silicon Valley',
    contactInfo: '+1 555 123 4567',
    email: 'john.doe@teravince.com'
  };

  // Initialize formData with mock data directly
  const [formData, setFormData] = useState({
    firstName: mockUserData.firstName,
    lastName: mockUserData.lastName,
    jobTitle: mockUserData.jobTitle,
    address: mockUserData.address,
    contactInfo: mockUserData.contactInfo
  });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size should be less than 2MB');
        return;
      }
      setPhoto(URL.createObjectURL(file));
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
  };

  // Form fields configuration
  const userDetailsFields = [
    {
      type: 'text',
      name: 'firstName',
      label: 'First Name',
      defaultValue: formData.firstName,  // Use defaultValue instead of value
      required: true
    },
    {
      type: 'text',
      name: 'lastName',
      label: 'Last Name',
      defaultValue: formData.lastName,
      required: true
    },
    {
      type: 'text',
      name: 'jobTitle',
      label: 'Job Title',
      defaultValue: formData.jobTitle
    },
    {
      type: 'text',
      name: 'address',
      label: 'Address',
      defaultValue: formData.address
    },
    {
      type: 'text',
      name: 'contactInfo',
      label: 'Contact Info',
      defaultValue: formData.contactInfo
    }
  ];

  const handleProfileUpdate = (updatedData) => {
    setFormData(updatedData);
    alert('✅ Profile successfully updated!');
    navigate('/dashboard');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-[#1B1717]">My Profile</h1>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Photo Upload Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-12">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
              {profilePicture ? (
                <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-300 text-4xl">👤</span>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="profilePicture-upload"
                className="px-4 py-2 bg-[#CE1212] text-white rounded cursor-pointer hover:bg-[#810000] transition text-center"
              >
                Upload Photo
              </label>
              <input
                id="profilePicture-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
              {profilePicture && (
                <button
                  type="button"
                  className="text-sm text-[#CE1212] hover:underline"
                  onClick={handleRemovePhoto}
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          <div className="border-t md:border-t-0 md:border-l border-gray-200 pt-6 md:pt-0 md:pl-8 text-sm text-gray-700">
            <p className="font-medium">Image Requirements:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Minimum 400×400 px</li>
              <li>Max. 2 MB</li>
              <li>A picture of yourself</li>
            </ol>
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Form Section */}
        <div className="space-y-4">
          <p className="font-medium text-gray-800">User Details</p>

          <DynamicForm
            fields={userDetailsFields}
            onSubmit={handleProfileUpdate}
            showSubmitButton={false}
            className="space-y-4"
            initialValues={formData} // Pass initial values separately
          />

          <div className="flex justify-end">
            <button
              className="px-4 py-2 bg-[#CE1212] text-white rounded hover:bg-[#810000] transition"
              onClick={() => handleProfileUpdate(formData)}
            >
              Update My Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
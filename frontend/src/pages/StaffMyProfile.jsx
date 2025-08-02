import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DynamicForm from '../components/DynamicForm';

export default function MyProfile() {
  const navigate = useNavigate();
  const staff = { firstName: 'Dadia', lastName: 'Yasuarini' };

  const [photo, setPhoto] = useState(null);
  const [formData, setFormData] = useState({
    firstName: staff.firstName,
    lastName: staff.lastName,
    jobTitle: 'Software Engineer',
    address: '1234 Main Street, City, Country',
    contactInfo: '+62 812 3456 7890',
  });

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
      placeholder: 'Enter first name',
      group: 'name',
      value: formData.firstName,
    },
    {
      type: 'text',
      name: 'lastName',
      label: 'Last Name',
      placeholder: 'Enter last name',
      group: 'name',
      value: formData.lastName,
    },
    {
      type: 'text',
      name: 'jobTitle',
      label: 'Job Title',
      placeholder: 'Enter job title',
      value: formData.jobTitle,
    },
    {
      type: 'text',
      name: 'address',
      label: 'Address',
      placeholder: 'Enter address',
      value: formData.address,
    },
    {
      type: 'text',
      name: 'contactInfo',
      label: 'Contact Info',
      placeholder: 'Enter contact info',
      value: formData.contactInfo,
    },
  ];

  const handleProfileUpdate = (data) => {
    setFormData(data);
    alert('✅ Profile successfully updated!');
    navigate('/staff-dashboard');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-[#1B1717]">My Profile</h1>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Photo Upload */}
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-12">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
              {photo ? (
                <img src={photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-300 text-4xl">👤</span>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="photo-upload"
                className="px-4 py-2 bg-[#CE1212] text-white rounded cursor-pointer hover:bg-[#810000] transition"
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
              {photo && (
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

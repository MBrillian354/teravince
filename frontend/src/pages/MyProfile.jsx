import React, { useState } from 'react';

export default function MyProfile() {
  const [photo, setPhoto] = useState(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) setPhoto(URL.createObjectURL(file));
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
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
                className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded cursor-pointer hover:bg-indigo-50 text-sm"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">First Name</label>
              <input
                type="text"
                placeholder="Placeholder"
                className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            {/* Last Name */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Last Name</label>
              <input
                type="text"
                placeholder="Placeholder"
                className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Job Title */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Job Title</label>
            <input
              type="text"
              placeholder="Placeholder"
              className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Address</label>
            <input
              type="text"
              placeholder="Placeholder"
              className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Contact Info */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Contact Info</label>
            <input
              type="text"
              placeholder="Placeholder"
              className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Update Button */}
        <div className="flex justify-end">
          <button className="bg-indigo-600 text-white px-5 py-2 rounded text-sm hover:bg-indigo-700">
            Update My Profile
          </button>
        </div>
      </div>
    </div>
  );
}

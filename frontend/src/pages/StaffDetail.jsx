import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { accountsAPI } from '../utils/api';

export default function StaffDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    // State for staff data
    const [staff, setStaff] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch staff data from backend
    const fetchStaffData = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await accountsAPI.getAll();
            const allUsers = response.data;

            // Find the specific staff member
            const staffMember = allUsers
                .filter(user => user.role === 'staff')
                .find(user => user._id === id);

            if (staffMember) {
                const formattedStaff = {
                    _id: staffMember._id,
                    name: `${staffMember.firstName} ${staffMember.lastName}`,
                    firstName: staffMember.firstName,
                    lastName: staffMember.lastName,
                    email: staffMember.email,
                    contactInfo: staffMember.contactInfo || '',
                    address: staffMember.address || '',
                    jobTitle: staffMember.jobId?.title || 'Unassigned',
                    position: staffMember.position || '',
                    profilePicture: staffMember.profilePicture || '',
                    contractStartDate: staffMember.contractStartDate,
                    contractEndDate: staffMember.contractEndDate,
                    status: staffMember.status,
                    jobId: staffMember.jobId,
                    role: staffMember.role
                };
                setStaff(formattedStaff);
            } else {
                setError('Staff member not found.');
            }

        } catch (err) {
            console.error('Error fetching staff data:', err);
            setError('Failed to load staff data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        if (id) {
            fetchStaffData();
        }
    }, [id]);

    const handleGoBack = () => {
        navigate('/dashboard/staffs');
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4">
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <p className="mt-2 text-gray-600">Loading staff details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4">
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
                <button
                    onClick={handleGoBack}
                    className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    <span>Back to My Staffs</span>
                </button>
            </div>
        );
    }

    if (!staff) {
        return (
            <div className="container mx-auto px-4">
                <div className="text-center py-8 text-gray-500">
                    Staff member not found.
                </div>
                <button
                    onClick={handleGoBack}
                    className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    <span>Back to My Staffs</span>
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4">
            {/* Header with Back Button */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Staff Details</h1>
                <button
                    onClick={handleGoBack}
                    className="btn-outline flex flex-row items-center gap-2 "
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    <span>Back to My Staffs</span>
                </button>
            </div>

            {/* Staff Profile Card */}
            <div className="bg-white rounded-lg shadow-lg p-8">
                {/* Profile Header */}
                <div className="flex items-center space-x-8 mb-8">
                    <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                        {staff.profilePicture ? (
                            <img
                                src={`/api/${staff.profilePicture}`}
                                alt={staff.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-gray-400 text-4xl">👤</span>
                        )}
                    </div>
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{staff.name}</h2>
                        <p className="text-xl text-gray-600 mb-2">{staff.jobTitle}</p>
                        {staff.position && (
                            <p className="text-lg text-gray-600 mb-2">{staff.position}</p>
                        )}
                        <p className="text-lg text-gray-500">{staff.email}</p>
                        {staff.status && (
                            <p className="mt-2 text-sm">
                                Status: <span className="capitalize font-medium text-indigo-600">{staff.status}</span>
                            </p>
                        )}
                    </div>
                </div>

                {/* Detailed Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Personal Information */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                            Personal Information
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">First Name</label>
                                <p className="text-gray-900">{staff.firstName}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Last Name</label>
                                <p className="text-gray-900">{staff.lastName}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                                <p className="text-gray-900">{staff.email}</p>
                            </div>
                            {staff.contactInfo && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Contact Information</label>
                                    <p className="text-gray-900">{staff.contactInfo}</p>
                                </div>
                            )}
                            {staff.address && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
                                    <p className="text-gray-900">{staff.address}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Work Information */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                            Work Information
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Employee ID</label>
                                <p className="text-gray-900 font-mono">{staff._id}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Job Title</label>
                                <p className="text-gray-900">{staff.jobTitle}</p>
                            </div>
                            {staff.position && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Position</label>
                                    <p className="text-gray-900">{staff.position}</p>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Role</label>
                                <p className="text-gray-900 capitalize">{staff.role}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                                <p className="text-gray-900 capitalize">{staff.status || 'Active'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contract Information */}
                {(staff.contractStartDate || staff.contractEndDate) && (
                    <div className="mt-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                            Contract Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {staff.contractStartDate && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Contract Start Date</label>
                                    <p className="text-gray-900">{new Date(staff.contractStartDate).toLocaleDateString()}</p>
                                </div>
                            )}
                            {staff.contractEndDate && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Contract End Date</label>
                                    <p className="text-gray-900">{new Date(staff.contractEndDate).toLocaleDateString()}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

import React, { useState } from 'react';
import DynamicForm from '../components/DynamicForm';
import { createAccount } from '@/store/adminSlice';
import { useModal } from '../hooks/useModal';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const NewAccountForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.admin);
  const { showError } = useModal();

  const formFields = [
    {
      type: 'text',
      name: 'firstName',
      label: 'First Name',
      placeholder: 'Enter first name',
      required: true,
      group: 'name',
    },
    {
      type: 'text',
      name: 'lastName',
      label: 'Last Name',
      placeholder: 'Enter last name',
      required: true,
      group: 'name',
    },
    {
      type: 'email',
      name: 'email',
      label: 'Email Address',
      placeholder: 'Enter email address',
      required: true,
    },
    {
      type: 'password',
      name: 'password',
      label: 'Password',
      placeholder: 'Enter password',
      required: true,
    },
    {
      type: 'select',
      name: 'role',
      label: 'User Role',
      placeholder: 'Select user role',
      required: true,
      options: [
        { value: 'admin', label: 'Administrator' },
        { value: 'supervisor', label: 'Supervisor' },
        { value: 'staff', label: 'Staff' },
      ],
    },
    {
      type: 'select',
      name: 'status',
      label: 'Employment Status',
      placeholder: 'Select employment status',
      required: false,
      options: [
        { value: 'continue', label: 'Continue' },
        { value: 'terminated', label: 'Terminated' },
        { value: 'pip', label: 'Under Performance Improvement' },
      ],
    },
  ];

  const startCountdown = () => {
    setShowSuccessModal(true);
    setCountdown(3);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        const next = prev - 1;
        if (next === 0) {
          clearInterval(interval);
          setShowSuccessModal(false);
          navigate('/accounts');
        }
        return next;
      });
    }, 1000);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate('/accounts');
  };

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const result = await dispatch(createAccount(formData));

      if (createAccount.fulfilled.match(result)) {
        startCountdown();
      } else {
        showError(
          'Creation Failed',
          result.payload || 'Failed to create user account. Please try again.'
        );
      }
    } catch (err) {
      showError('Creation Failed', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      <DynamicForm
        title="Create New User Account"
        subtitle="Fill in the details below to create a new user account"
        fields={formFields}
        onSubmit={handleSubmit}
        submitButtonText={isSubmitting || loading ? "Creating..." : "Create Account"}
        disabled={isSubmitting || loading}
        className="space-y-6"
      />

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex items-center space-x-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Account Created Successfully!</h2>
                <p className="text-sm text-gray-600 mt-1">
                  The user account has been created. Redirecting in <span className="font-bold text-blue-600">{countdown}</span> second(s)...
                </p>
              </div>
            </div>
            <div className="mt-4 text-right">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none"
              >
                Go to Accounts Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewAccountForm;

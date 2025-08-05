import React, { useState, useRef, useEffect } from 'react';
import DynamicForm from '../components/DynamicForm';
import { createAccount } from '@/store/adminSlice';
import { useModal } from '../hooks/useModal';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const NewAccountForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.admin);
  const { showSuccess, showError } = useModal();
  const timeoutRef = useRef(null); // simpan timeout ID

  // Cleanup timeout jika komponen di-unmount (navigasi ke halaman lain)
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

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

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      const result = await dispatch(createAccount(formData));

      if (createAccount.fulfilled.match(result)) {
        // Tampilkan modal sukses
        showSuccess(
          'Account Created Successfully!',
          'The user account has been created and is ready to use.',
          {
            onConfirm: () => {
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current); 
              }
              navigate('/accounts'); 
            },
            autoClose: true,
            timeout: 3000,
          }
        );

        timeoutRef.current = setTimeout(() => {
          navigate('/accounts');
        }, 3000);
      } else {
        showError(
          'Creation Failed',
          result.payload || 'Failed to create user account. Please try again.'
        );
      }

    } catch (err) {
      showError(
        'Creation Failed',
        'An unexpected error occurred. Please try again.'
      );
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
    </div>
  );
};

export default NewAccountForm;

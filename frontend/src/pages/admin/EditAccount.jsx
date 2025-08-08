import React, { useState, useEffect } from 'react';
import DynamicForm from '../../components/ui/DynamicForm';
import { updateAccount } from '@/store/adminSlice';
import { useModal } from '../../hooks/useModal';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { accountsAPI } from '../../utils/api';

const EditAccount = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accountData, setAccountData] = useState(null);
  const [loadingAccount, setLoadingAccount] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { loading, error } = useSelector((state) => state.admin);
  const { showSuccess, showError } = useModal();

  // Load account data
  useEffect(() => {
    const loadAccount = async () => {
      try {
        setLoadingAccount(true);
        const response = await accountsAPI.getById(id);
        console.log('Loaded account:', response.data);
        setAccountData(response.data);

      } catch (error) {
        console.error('Error loading account:', error);
        showError(
          'Loading Failed',
          'Failed to load account data. Please try again.'
        );
      } finally {
        setLoadingAccount(false);
      }
    };

    if (id) {
      loadAccount();
    }
  }, [id, dispatch]);

  const formFields = [
    {
      type: 'text',
      name: 'firstName',
      label: 'First Name',
      placeholder: 'Enter first name',
      required: true,
      group: 'name',
      defaultValue: accountData?.firstName || '',
    },
    {
      type: 'text',
      name: 'lastName',
      label: 'Last Name',
      placeholder: 'Enter last name',
      required: true,
      group: 'name',
      defaultValue: accountData?.lastName || '',
    },
    {
      type: 'email',
      name: 'email',
      label: 'Email Address',
      placeholder: 'Enter email address',
      required: true,
      defaultValue: accountData?.email || '',
    },
    {
      type: 'text',
      name: 'password',
      label: 'New Password',
      placeholder: 'Enter New password',
      required: true,
      defaultValue: accountData?.password || '',
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
      defaultValue: accountData?.role || '',
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
      defaultValue: accountData?.status || '',
    },
  ];

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      const result = await dispatch(updateAccount({ id, ...formData }));

      if (updateAccount.fulfilled.match(result)) {
        // Show success modal
        showSuccess(
          'Account Updated Successfully!',
          'The user account has been updated successfully.',
          {
            onConfirm: () => {
              navigate('/accounts');
            },
            autoClose: true,
            timeout: 3000
          },
        );

      } else {
        // Show error modal
        showError(
          'Update Failed',
          result.payload || 'Failed to update user account. Please try again.'
        );
      }

    } catch (err) {
      // Show generic error modal
      showError(
        'Update Failed',
        'An unexpected error occurred. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingAccount) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading account...</div>
      </div>
    );
  }

  if (!accountData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">Account not found</div>
        <button
          onClick={() => navigate('/accounts')}
          className="ml-4 btn btn-primary"
        >
          Back to Accounts
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      <DynamicForm
        title="Edit User Account"
        subtitle="Update the account details below"
        fields={formFields}
        onSubmit={handleSubmit}
        submitButtonText={isSubmitting || loading ? "Updating..." : "Update Account"}
        disabled={isSubmitting || loading}
        className="space-y-6"
      />
    </div>
  );
};

export default EditAccount;

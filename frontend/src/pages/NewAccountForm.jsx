import React, { useState } from 'react';
import DynamicForm from '../components/DynamicForm';
import { addAccount } from '@/store/adminSlice';
import { openModal } from '@/store/modalSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const NewAccountForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      name: 'jobTitle',
      label: 'Job Title',
      placeholder: 'Select job title',
      required: true,
      options: [
        { value: 'forest_research_gis', label: 'Forest Research & GIS' },
        { value: 'forest_restoration_protection', label: 'Forest Restoration & Protection' },
      ],
    },
  ];

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API call
      console.log('Account form data:', formData);

      // Simulate API call
      dispatch(addAccount(formData));

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success modal
      dispatch(openModal({
        type: 'SUCCESS',
        data: {
          message: 'Account Created Successfully!',
          description: 'The user account has been created and is ready to use.'
        }
      }));

      // Navigate back after showing success
      setTimeout(() => {
        navigate(-1);
      }, 2000);

    } catch (err) {
      // Show error modal
      dispatch(openModal({
        type: 'ERROR',
        data: {
          message: 'Creation Failed',
          description: 'Failed to create user account. Please try again.'
        }
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <DynamicForm
        title="Create New User Account"
        subtitle="Fill in the details below to create a new user account"
        fields={formFields}
        onSubmit={handleSubmit}
        submitButtonText={isSubmitting ? "Creating..." : "Create Account"}
        className="space-y-6"
      />
    </div>
  );
};

export default NewAccountForm;
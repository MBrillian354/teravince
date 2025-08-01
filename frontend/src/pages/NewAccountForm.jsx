import React, { useState } from 'react';
import DynamicForm from '../components/DynamicForm';

const NewAccountForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
        { value: 'staff', label: 'Staff' },
        { value: 'supervisor', label: 'Supervisor' },
        { value: 'admin', label: 'Administrator' },
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
    setError('');
    setSuccess('');

    try {
      // TODO: Replace with actual API call
      console.log('Account form data:', formData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccess('User account created successfully!');

      // TODO: Redirect to users list or show success message
    } catch (err) {
      setError('Failed to create user account. Please try again.');
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
        error={error}
        success={success}
        className="space-y-6"
      />
    </div>
  );
};

export default NewAccountForm;
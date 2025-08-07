import { useState, useEffect } from 'react';
import DynamicForm from '../../components/DynamicForm';
import { updateJob, fetchJobs } from '../../store/adminSlice';
import { useModal } from '../../hooks/useModal';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

const EditJobForm = () => {
  const { id } = useParams();
  const job = useSelector(state => state.admin.jobsData.find(j => j.id === id));
  console.log('Editing job:', job);
  const { isLoading } = useSelector(state => state.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showSuccess, showError } = useModal();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch jobs if not loaded
  useEffect(() => {
    if (!job && !isLoading) {
      dispatch(fetchJobs());
    }
  }, [dispatch, job, isLoading]);

  useEffect(() => {
    if (!isLoading && !job) {
      showError(
        'Job Not Found',
        'The job you are trying to edit could not be found.',
        'Error',
        { timeout: 5000, autoClose: false }
      );
    }
  }, [job, isLoading, showError]);

  const formFields = [
    {
      type: 'text',
      name: 'jobTitle',
      label: 'Job Title',
      placeholder: 'Enter job title',
      required: true,
      defaultValue: job ? job.title : ''
    },
    {
      type: 'textarea',
      name: 'description',
      label: 'Job Description',
      placeholder: 'Enter job description',
      required: true,
      rows: 4,
      defaultValue: job ? job.description : ''
    },
    {
      type: 'select',
      name: 'status',
      label: 'Job Status',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'draft', label: 'Draft' }
      ],
      required: true,
      defaultValue: job ? job.status : ''
    }
  ];

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      const jobData = {
        title: formData.jobTitle,
        description: formData.description,
        status: formData.status
      };

      await dispatch(updateJob({ id, ...jobData })).unwrap();

      // Show success modal
      showSuccess(
        'Job Updated Successfully!',
        'The job posting has been updated with the new information.',
        {
          onConfirm: () => {
            navigate('/jobs');
          },
          autoClose: true,
          timeout: 3000
        },
      );
      

    } catch (error) {
      console.error('Job update failed:', error);
      // Show error modal
      showError(
        'Update Failed',
        error || 'Failed to update job posting. Please try again.',
        'Error',
        { timeout: 5000, autoClose: false }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading job...</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">Job not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <DynamicForm
        title="Edit Job Posting"
        subtitle="Update the details below"
        fields={formFields}
        onSubmit={handleSubmit}
        submitButtonText={isSubmitting ? 'Updating...' : 'Update Job'}
      />
    </div>
  );
};

export default EditJobForm;

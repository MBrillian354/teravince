import { useState, useEffect } from 'react';
import DynamicForm from '../components/DynamicForm';
import { updateJob } from '../store/adminSlice';
import { openModal } from '../store/modalSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

const EditJobForm = () => {
  const { id } = useParams();
  const jobId = Number(id);
  const job = useSelector(state => state.admin.jobsData.find(j => j.id === jobId));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!job) {
      dispatch(openModal({
        type: 'ERROR',
        data: {
          message: 'Job Not Found',
          description: 'The job you are trying to edit could not be found.'
        }
      }));
    }
  }, [job, dispatch]);

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
    }
  ];

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      const updatedJob = {
        id: jobId,
        title: formData.jobTitle,
        description: formData.description
      };

      dispatch(updateJob(updatedJob));
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Show success modal
      dispatch(openModal({
        type: 'SUCCESS',
        data: {
          message: 'Job Updated Successfully!',
          description: 'The job posting has been updated with the new information.'
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
          message: 'Update Failed',
          description: 'Failed to update job posting. Please try again.'
        }
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!job) {
    return <p className="text-red-500">Job not found.</p>;
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

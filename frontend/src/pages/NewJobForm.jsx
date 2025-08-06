import { useState } from 'react';
import DynamicForm from '../components/DynamicForm';
import { createJob } from '@/store/adminSlice';
import { useModal } from '../hooks/useModal';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const NewJobForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { showSuccess, showError } = useModal();


    const formFields = [
        {
            type: 'text',
            name: 'jobTitle',
            label: 'Job Title',
            placeholder: 'Enter job title',
            required: true,
        },
        {
            type: 'textarea',
            name: 'description',
            label: 'Job Description',
            placeholder: 'Enter job description',
            required: true,
            rows: 4,
        }
    ];

    const handleSubmit = async (formData) => {
        setIsSubmitting(true);

        try {
            const jobData = {
                title: formData.jobTitle,
                description: formData.description
            };

            await dispatch(createJob(jobData)).unwrap();

            // Show success modal
            showSuccess(
                'Job Created Successfully!',
                'The job posting has been created and saved as draft.',
                {
                    onConfirm: () => {
                        navigate('/jobs');
                    },
                    autoClose: true,
                    timeout: 3000
                }
            );

        } catch (error) {
            console.error('Job creation failed:', error);
            // Show error modal
            showError(
                'Creation Failed',
                error || 'Failed to create job posting. Please try again.',
                'Error',
                { timeout: 5000, autoClose: false }
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-surface rounded-lg shadow-md">
            <DynamicForm
                title="Create New Job Posting"
                subtitle="Fill in the details below to create a new job posting"
                fields={formFields}
                onSubmit={handleSubmit}
                submitButtonText={isSubmitting ? "Creating..." : "Create Job"}
            />
        </div>
    );
};

export default NewJobForm;
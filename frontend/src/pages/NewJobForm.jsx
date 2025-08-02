import { useState } from 'react';
import DynamicForm from '../components/DynamicForm';
import { addJob } from '@/store/adminSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const NewJobForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const dispatch = useDispatch();


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
        setError('');
        setSuccess('');

        try {
            // TODO: Replace with actual API call
            console.log('Job form data:', formData);
            const newJob = {
                id: Date.now(), // Temporary ID generation
                title: formData.jobTitle,
                description: formData.description,
                employees: 0, // Default to 0 employees
                status: 'Draft' // Default status
            };

            dispatch(addJob(newJob));

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSuccess('Job posting created successfully!');
            await new Promise(resolve => setTimeout(resolve, 1000));
            navigate(-1); // Navigate to previous page


            // TODO: Redirect to jobs list or show success message
        } catch (err) {
            setError('Failed to create job posting. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <DynamicForm
                title="Create New Job Posting"
                subtitle="Fill in the details below to create a new job posting"
                fields={formFields}
                onSubmit={handleSubmit}
                submitButtonText={isSubmitting ? "Creating..." : "Create Job"}
                error={error}
                success={success}
            />
        </div>
    );
};

export default NewJobForm;
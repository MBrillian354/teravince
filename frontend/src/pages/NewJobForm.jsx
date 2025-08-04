import { useState } from 'react';
import DynamicForm from '../components/DynamicForm';
import { addJob } from '@/store/adminSlice';
import { openModal } from '@/store/modalSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const NewJobForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
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
            
            // Show success modal
            dispatch(openModal({
                type: 'SUCCESS',
                data: {
                    message: 'Job Created Successfully!',
                    description: 'The job posting has been created and saved as draft.'
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
                    description: 'Failed to create job posting. Please try again.'
                }
            }));
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
            />
        </div>
    );
};

export default NewJobForm;
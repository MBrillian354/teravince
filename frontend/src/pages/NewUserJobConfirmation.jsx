import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../contexts/AuthContext";
import { fetchJobs } from "../store/adminSlice";
import { updateCurrentUser } from "../store/userSlice";

export default function NewUserJobConfirmation() {
  const [selectedJobId, setSelectedJobId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  console.log("NewUserJobConfirmation: Current user:", user);

  const { jobsData, isLoading: jobsLoading } = useSelector((state) => state.admin);

  useEffect(() => {
    // Fetch jobs when component mounts
    dispatch(fetchJobs());
  }, [dispatch]);

  const handleJobChange = (e) => {
    setSelectedJobId(e.target.value);
  };

  const handleSubmit = async () => {
    if (!selectedJobId) {
      alert("Please select a job title");
      return;
    }

    setIsLoading(true);

    try {
      // Update user job in backend
      await dispatch(updateCurrentUser({ jobId: selectedJobId })).unwrap();

      // Navigate to dashboard after successful update
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to update job:", error);
      alert("Failed to update job. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (jobsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="text-lg text-gray-600">Loading job titles...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-2xl font-semibold mb-4 text-gray-900">
        What is Your Job Title?
      </h1>
      
      {user?.role && (
        <p className="text-lg text-gray-700 mb-6">
          Selected Role: <span className="font-medium capitalize">{user.role}</span>
        </p>
      )}

      <div className="flex flex-col items-center space-y-4">
        <select
          onChange={handleJobChange}
          value={selectedJobId}
          className="border border-gray-300 rounded px-4 py-2 min-w-[200px]"
          disabled={isLoading}
        >
          <option disabled value="">
            Choose one...
          </option>
          {jobsData.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title}
            </option>
          ))}
        </select>

        <button
          onClick={handleSubmit}
          disabled={isLoading || !selectedJobId}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Updating..." : "Complete Setup"}
        </button>
      </div>
    </div>
  );
}

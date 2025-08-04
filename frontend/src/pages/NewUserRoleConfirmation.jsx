import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateCurrentUser } from "../store/userSlice";

export default function NewUserRoleConfirmation() {
  const [selectedRole, setSelectedRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSelectRole = async (role) => {
    setSelectedRole(role);
    setIsLoading(true);
    
    try {
      // Update user role in backend
      await dispatch(updateCurrentUser({ role: role.toLowerCase() })).unwrap();
      
      // Navigate to job confirmation
      navigate("/job-confirm");
    } catch (error) {
      console.error("Failed to update role:", error);
      // Still navigate on error for now, but you could show an error message
      navigate("/job-confirm");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-2xl font-semibold mb-6 text-gray-900">
        What is Your Role?
      </h1>
      <div className="flex space-x-4">
        <button
          onClick={() => handleSelectRole("supervisor")}
          disabled={isLoading}
          className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading && selectedRole === "supervisor" ? "Updating..." : "SUPERVISOR"}
        </button>
        <button
          onClick={() => handleSelectRole("staff")}
          disabled={isLoading}
          className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading && selectedRole === "staff" ? "Updating..." : "STAFF"}
        </button>
      </div>
    </div>
  );
}

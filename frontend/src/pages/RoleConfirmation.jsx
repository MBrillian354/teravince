import { useNavigate } from "react-router-dom";

export default function RoleConfirmation() {
  const navigate = useNavigate();

  const handleSelectRole = (role) => {
    localStorage.setItem("role", role);
    navigate("/job-title");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-2xl font-semibold mb-6 text-gray-900">
        What is Your Role?
      </h1>
      <div className="flex space-x-4">
        <button
          onClick={() => handleSelectRole("Supervisor")}
          className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
        >
          SUPERVISOR
        </button>
        <button
          onClick={() => handleSelectRole("Staff")}
          className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
        >
          STAFF
        </button>
      </div>
    </div>
  );
}

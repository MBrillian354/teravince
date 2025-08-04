import { useEffect, useState } from "react";

export default function JobTitleConfirmation() {
  const [role, setRole] = useState("");
  const [selectedJob, setSelectedJob] = useState("");

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    setRole(savedRole || "Unknown");
  }, []);

  const handleChange = (e) => {
    setSelectedJob(e.target.value);
    console.log("Role:", role, "| Selected Job Title:", e.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-2xl font-semibold mb-4 text-gray-900">
        What is Your Job Title?
      </h1>
      <select
        onChange={handleChange}
        value={selectedJob}
        className="border border-gray-300 rounded px-4 py-2 min-w-[200px]"
      >
        <option disabled value="">
          Choose one...
        </option>
        <option value="IT">IT</option>
        <option value="Finance">Finance</option>
        <option value="Engineer">Engineer</option>
        <option value="Assistant">Assistant</option>
      </select>
    </div>
  );
}

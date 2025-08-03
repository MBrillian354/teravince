import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ViewTask() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [task, setTask] = useState({
    taskId: "",
    taskTitle: "",
    taskDescription: "",
    jobTitle: "",
    startDate: "",
    endDate: "",
    status: "",
    amountType: "",
    customAmountType: "",
    minAmount: "",
    maxAmount: "",
    document: null,
  });

  useEffect(() => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const taskToView = tasks.find((t) => t.taskId === id);
    if (taskToView) {
      setTask(taskToView);
    }
  }, [id]);

  const displayAmountLabel =
    task.amountType === "Other" && task.customAmountType
      ? task.customAmountType
      : task.amountType || "Amount";

  return (
    <div className="bg-[#EEEBDD] min-h-screen px-4 py-6 text-[#1B1717]">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md border border-[#CE1212] p-6">
        {/* Announcement for Under Review Status */}
        {task.status === "Under Review" && (
          <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-800">
                  Task is being Reviewed. Please kindly wait.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Rest of the task details display */}
        <div className="space-y-4">
          {/* Task Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Task Title</label>
            <div className="w-full border border-[#1B1717] rounded px-3 py-2 text-sm bg-gray-50">
              {task.taskTitle}
            </div>
          </div>
          
          {/* Task Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Task Description</label>
            <div className="w-full border border-[#1B1717] rounded px-3 py-2 text-sm bg-gray-50 min-h-[100px]">
              {task.taskDescription}
            </div>
          </div>
          
          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Job Title</label>
            <div className="w-full border border-[#1B1717] rounded px-3 py-2 text-sm bg-gray-50">
              {task.jobTitle}
            </div>
          </div>
          
          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">From</label>
              <div className="w-full border border-[#1B1717] rounded px-3 py-2 text-sm bg-gray-50">
                {task.startDate}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">To</label>
              <div className="w-full border border-[#1B1717] rounded px-3 py-2 text-sm bg-gray-50">
                {task.endDate}
              </div>
            </div>
          </div>
          
          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <div className="w-full border border-[#1B1717] rounded px-3 py-2 text-sm bg-gray-50">
              {task.status}
            </div>
          </div>
          
          {/* Amount Type */}
          <div>
            <label className="block text-sm font-medium mb-1">Amount Type</label>
            <div className="w-full border border-[#1B1717] rounded px-3 py-2 text-sm bg-gray-50">
              {displayAmountLabel}
            </div>
          </div>
          
          {/* Min/Max Amount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Min {displayAmountLabel}</label>
              <div className="w-full border border-[#1B1717] rounded px-3 py-2 text-sm bg-gray-50">
                {task.minAmount}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max {displayAmountLabel}</label>
              <div className="w-full border border-[#1B1717] rounded px-3 py-2 text-sm bg-gray-50">
                {task.maxAmount}
              </div>
            </div>
          </div>

          {/* Document View Section */}
          <div>
            <label className="block text-sm font-medium mb-1">Supported Document</label>
            {task.document ? (
              <div className="flex items-center gap-2 p-2 border border-[#1B1717] rounded bg-gray-50">
                <span>📄</span>
                <span className="text-sm">{task.document.name}</span>
              </div>
            ) : (
              <div className="text-sm text-gray-500 italic">No document uploaded</div>
            )}
          </div>

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="mt-4 bg-[#5A0000] hover:bg-[#400000] text-white text-sm px-4 py-2 rounded shadow-sm transition"
          >
            Back to Tasks
          </button>
        </div>
      </div>
    </div>
  );
}
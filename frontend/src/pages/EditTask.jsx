import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditTask() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
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
  });

  const [document, setDocument] = useState(null);

  useEffect(() => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const taskToEdit = tasks.find((task) => task.taskId === id);
    if (taskToEdit) {
      setForm(taskToEdit);
    }
  }, [id]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const updatedTasks = tasks.map((task) =>
      task.taskId === id
        ? {
            ...form,
            amountType:
              form.amountType === "Other"
                ? form.customAmountType
                : form.amountType,
          }
        : task
    );
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));

    alert("Task updated successfully!");
    navigate("/staff-tasks");
  };

  const displayAmountLabel =
    form.amountType === "Other" && form.customAmountType
      ? form.customAmountType
      : form.amountType || "Amount";

  return (
    <div className="bg-[#EEEBDD] min-h-screen px-4 py-6 text-[#1B1717]">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md border border-[#CE1212] p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Task Title</label>
            <input
              type="text"
              value={form.taskTitle}
              onChange={(e) => handleChange("taskTitle", e.target.value)}
              className="w-full border border-[#1B1717] rounded px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Task Description</label>
            <textarea
              value={form.taskDescription}
              onChange={(e) =>
                handleChange("taskDescription", e.target.value)
              }
              className="w-full border border-[#1B1717] rounded px-3 py-2 text-sm"
              rows="3"
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-sm mb-1">Job Title</label>
            <input
              type="text"
              value={form.jobTitle}
              onChange={(e) => handleChange("jobTitle", e.target.value)}
              className="w-full border border-[#1B1717] rounded px-3 py-2 text-sm"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">From</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                className="w-full border border-[#1B1717] rounded px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">To</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
                className="w-full border border-[#1B1717] rounded px-3 py-2 text-sm"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className="w-full border border-[#1B1717] rounded px-3 py-2 text-sm"
              required
            >
              <option value="" disabled>
                Select status
              </option>
              <option value="Draft">Draft</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Under Review">Under Review</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Amount Type</label>
            <select
              value={form.amountType}
              onChange={(e) => handleChange("amountType", e.target.value)}
              className="w-full border border-[#1B1717] rounded px-3 py-2 text-sm"
            >
              <option value="">Select amount type</option>
              <option value="Leads">Leads</option>
              <option value="Products">Products</option>
              <option value="Reports">Reports</option>
              <option value="Other">Other</option>
            </select>
          </div>
          {form.amountType === "Other" && (
            <div>
              <label className="block text-sm mb-1">Specify Custom Type</label>
              <input
                type="text"
                value={form.customAmountType}
                onChange={(e) =>
                  handleChange("customAmountType", e.target.value)
                }
                className="w-full border border-[#1B1717] rounded px-3 py-2 text-sm"
                placeholder="e.g., Deliverables"
                required
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">
                Min {displayAmountLabel}
              </label>
              <input
                type="number"
                value={form.minAmount}
                onChange={(e) => handleChange("minAmount", e.target.value)}
                className="w-full border border-[#1B1717] rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">
                Max {displayAmountLabel}
              </label>
              <input
                type="number"
                value={form.maxAmount}
                onChange={(e) => handleChange("maxAmount", e.target.value)}
                className="w-full border border-[#1B1717] rounded px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* ========== Enhanced Supported Document Upload with Left Icon ========== */}
          <div>
            <label className="block text-sm mb-1">Supported Document</label>
            <div className="relative">
              <input
                type="file"
                id="document-upload"
                accept=".pdf,.doc,.docx,.jpg,.png"
                onChange={(e) => setDocument(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <label
                htmlFor="document-upload"
                className="flex items-center gap-2 w-full border border-[#1B1717] rounded px-3 py-2 text-sm bg-white cursor-pointer"
              >
                <span className="text-gray-500">📁</span>
                <span className="text-gray-400 flex-1">
                  {document ? document.name : "Choose file..."}
                </span>
              </label>
            </div>
            {document && (
              <p className="text-xs mt-1 text-green-700">
                {document.name}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="mt-4 bg-[#5A0000] hover:bg-[#400000] text-white text-sm px-4 py-2 rounded shadow-sm transition"
          >
            Update Task
          </button>
        </form>
      </div>
    </div>
  );
}
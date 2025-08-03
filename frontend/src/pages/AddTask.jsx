import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddTask() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
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

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const existingTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const maxId = Math.max(
      ...existingTasks.map((task) => parseInt(task.taskId)).filter(Boolean),
      4
    );
    const newId = String(maxId + 1).padStart(3, "0");

    const newTask = {
      ...form,
      taskId: newId,
      amountType:
        form.amountType === "Other" ? form.customAmountType : form.amountType,
    };

    const updatedTasks = [...existingTasks, newTask];
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));

    alert("Task added successfully!");
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
          <button
            type="submit"
            className="mt-4 bg-[#5A0000] hover:bg-[#400000] text-white text-sm px-4 py-2 rounded shadow-sm transition"
          >
            Add Task
          </button>
        </form>
      </div>
    </div>
  );
}

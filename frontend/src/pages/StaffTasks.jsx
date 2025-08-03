import React, { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";

const mockTasks = [
  {
    taskId: "001",
    taskTitle: "UI Update",
    taskDescription: "Redesign staff dashboard",
    jobTitle: "Frontend Developer",
    deadline: "2025-08-10",
    status: "Ongoing",
    submitted: false,
    score: "N/A",
  },
  {
    taskId: "002",
    taskTitle: "Bug Fixing",
    taskDescription: "Resolve login issue",
    jobTitle: "Fullstack Developer",
    deadline: "2025-08-12",
    status: "Completed",
    submitted: true,
    score: "90",
  },
  {
    taskId: "003",
    taskTitle: "Content Review",
    taskDescription: "Proofread marketing copy",
    jobTitle: "Content Strategist",
    deadline: "2025-08-15",
    status: "Draft",
    submitted: false,
    score: "N/A",
  },
  {
    taskId: "004",
    taskTitle: "Data Sync",
    taskDescription: "Integrate new API",
    jobTitle: "Backend Developer",
    deadline: "2025-08-20",
    status: "Under Review",
    submitted: true,
    score: "N/A",
  },
];

export default function StaffTask() {
  const [dateRanges, setDateRanges] = useState(
    mockTasks.reduce((acc, task) => {
      acc[task.taskId] = { from: "", to: "" };
      return acc;
    }, {})
  );

  const handleChange = (taskId, field, value) => {
    setDateRanges((prev) => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        [field]: value,
      },
    }));
  };

  const handleEdit = (id) => alert(`Edit task ${id}`);
  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete task ${id}?`)) {
      alert(`Task ${id} deleted`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "text-green-700 bg-green-100 border-green-400";
      case "Ongoing":
        return "text-yellow-700 bg-yellow-100 border-yellow-400";
      case "Draft":
        return "text-gray-700 bg-gray-100 border-gray-400";
      case "Under Review":
        return "text-blue-600 bg-blue-100 border-blue-300";
      default:
        return "text-neutral-700 bg-neutral-100 border-neutral-400";
    }
  };

  return (
    <div className="min-h-screen bg-[#EEEBDD] text-[#1B1717] flex flex-col">
      <main className="flex-1 w-full mx-auto px-4 py-4">
        {/* Summary Cards */}
        <div className="mb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "Total Tasks", count: mockTasks.length, color: "text-[#810000]" },
              { title: "Draft", count: mockTasks.filter((t) => t.status === "Draft").length, color: "text-[#1B1717]" },
              { title: "Ongoing", count: mockTasks.filter((t) => t.status === "Ongoing").length, color: "text-[#CE1212]" },
              { title: "Completed", count: mockTasks.filter((t) => t.status === "Completed").length, color: "text-[#810000]" },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-[#EEEBDD] rounded-lg p-4 shadow-sm border border-[#1B1717] transition-transform hover:scale-105 hover:shadow-md"
              >
                <h3 className="text-xs font-medium text-[#1B1717] opacity-75">{card.title}</h3>
                <p className={`text-xl font-bold mt-1 ${card.color}`}>{card.count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-md border border-[#CE1212] overflow-hidden flex flex-col mb-4">
          <div className="bg-gradient-to-r from-[#810000] to-[#1B1717] px-5 py-3">
            <h2 className="text-lg font-semibold text-[#EEEBDD]">Task Management Recap</h2>
          </div>

          <div className="w-full">
            <table className="w-full text-sm">
              <thead className="bg-[#1B1717] text-[#EEEBDD]">
                <tr>
                  {["Task ID", "Title", "Description", "Job Title", "Deadline", "Status", "Manage", "Action", "Score"].map(
                    (label, idx) => (
                      <th key={idx} className="px-4 py-2 text-left font-medium whitespace-nowrap">
                        {label}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B1717]">
                {mockTasks.map((task) => (
                  <tr key={task.taskId} className="hover:bg-[#F7F6F2] transition">
                    <td className="px-4 py-2 font-mono text-[#810000] font-semibold whitespace-nowrap">{task.taskId}</td>
                    <td className="px-4 py-2 font-medium">{task.taskTitle}</td>
                    <td className="px-4 py-2 text-[#1B1717]">{task.taskDescription}</td>
                    <td className="px-4 py-2">
                      <span className="inline-block px-3 py-1 text-xs whitespace-nowrap bg-[#EEEBDD] text-[#810000] border border-[#CE1212] rounded-full">
                        {task.jobTitle}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex flex-col gap-1">
                        <div className="flex flex-col">
                          <label className="text-[10px] opacity-60">From</label>
                          <input
                            type="date"
                            value={dateRanges[task.taskId].from}
                            onChange={(e) => handleChange(task.taskId, "from", e.target.value)}
                            className="border border-[#1B1717] rounded px-2 py-1 text-xs"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-[10px] opacity-60">To</label>
                          <input
                            type="date"
                            value={dateRanges[task.taskId].to}
                            onChange={(e) => handleChange(task.taskId, "to", e.target.value)}
                            className="border border-[#1B1717] rounded px-2 py-1 text-xs"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <span className={`inline-block whitespace-nowrap text-xs font-medium px-3 py-1 rounded-full border ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        {task.status !== "Completed" && (
                          <button
                            onClick={() => handleEdit(task.taskId)}
                            className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-[#1B1717] px-2 py-1 rounded text-xs border border-[#1B1717]"
                          >
                            <Edit2 className="w-3 h-3" /> Edit
                          </button>
                        )}
                        {task.status !== "Completed" && (
                          <button
                            onClick={() => handleDelete(task.taskId)}
                            className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-[#1B1717] px-2 py-1 rounded text-xs border border-[#1B1717]"
                          >
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-xs">
                      {task.submitted ? (
                        <span className="bg-[#5A0000] hover:bg-[#400000] text-white px-3 py-1 rounded text-xs">Submitted</span>
                      ) : (
                        <button className="bg-[#5A0000] hover:bg-[#400000] text-white px-3 py-1 rounded text-xs">
                          Submit
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <span className={`font-bold ${task.score !== "N/A" ? "text-[#1B1717]" : "text-gray-400"}`}>
                        {task.score}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Score Availability Note */}
        <div className="bg-[#EEEBDD] p-3 rounded-lg border border-[#CE1212] text-sm text-[#1B1717]">
          <p><span className="font-semibold">Note:</span> Scores will be available once tasks are marked as Completed.</p>
        </div>
      </main>
    </div>
  );
}
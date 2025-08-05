import React, { useState, useEffect } from "react";
import { Edit2, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const initialMockTasks = [
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
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [dateRanges, setDateRanges] = useState({});

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

    const formatted = storedTasks.map((task, idx) => ({
      taskId: String(initialMockTasks.length + idx + 1).padStart(3, "0"),
      taskTitle: task.taskTitle,
      taskDescription: task.taskDescription,
      jobTitle: task.jobTitle,
      deadline: task.endDate || new Date().toISOString().split("T")[0],
      status: task.status || "Draft",
      submitted: false,
      score: "N/A",
      startDate: task.startDate || "",
      endDate: task.endDate || "",
      document: task.document || null,
    }));

    const allTasks = [...initialMockTasks, ...formatted];
    setTasks(allTasks);

    const dateObj = allTasks.reduce((acc, task) => {
      acc[task.taskId] = {
        from: task.startDate || "",
        to: task.endDate || "",
      };
      return acc;
    }, {});

    const storedRanges = JSON.parse(localStorage.getItem("dateRanges")) || {};
    const merged = { ...dateObj, ...storedRanges };
    setDateRanges(merged);
  }, []);

  const handleChange = (taskId, field, value) => {
    setDateRanges((prev) => {
      const updated = {
        ...prev,
        [taskId]: {
          ...prev[taskId],
          [field]: value,
        },
      };
      localStorage.setItem("dateRanges", JSON.stringify(updated));
      return updated;
    });
  };

  const handleEdit = (id) => {
    navigate(`/edit-task/${id}`);
  };

  const handleView = (id) => {
  const task = tasks.find((t) => t.taskId === id);
  if (task?.status === "Under Review") {
    alert("Your task is currently being reviewed. Please kindly wait.");
  }
  navigate(`/view-task/${id}`);
};


  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete task ${id}?`)) {
      const updatedTasks = tasks.filter((task) => task.taskId !== id);
      setTasks(updatedTasks);

      const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
      const newStored = storedTasks.filter(
        (task, index) => String(initialMockTasks.length + index + 1).padStart(3, "0") !== id
      );
      localStorage.setItem("tasks", JSON.stringify(newStored));

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
              { title: "Total Tasks", count: tasks.length, color: "text-[#810000]" },
              { title: "Draft", count: tasks.filter((t) => t.status === "Draft").length, color: "text-[#1B1717]" },
              { title: "Ongoing", count: tasks.filter((t) => t.status === "Ongoing").length, color: "text-[#CE1212]" },
              { title: "Completed", count: tasks.filter((t) => t.status === "Completed").length, color: "text-[#810000]" },
            ].map((card, i) => (
              <div key={i} className="card-outline">
                <h3 className="text-xs font-medium text-[#1B1717] opacity-75">{card.title}</h3>
                <p className={`text-xl font-bold mt-1 ${card.color}`}>{card.count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Add Task Button */}
        <div className="flex justify-end mb-2">
          <button
            onClick={() => navigate("/tasks/new")}
            className="btn-primary"
          >
            + Add Task
          </button>
        </div>

        {/* Task Table */}
        <div className="bg-white rounded-lg shadow-md border border-[#CE1212] overflow-hidden flex flex-col mb-4">
          <div className="bg-gradient-to-r from-[#810000] to-[#1B1717] px-5 py-3">
            <h2 className="text-lg font-semibold text-[#EEEBDD]">Task Management Recap</h2>
          </div>

          <div className="w-full overflow-x-auto">
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
                {tasks.map((task) => (
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
                            value={dateRanges[task.taskId]?.from || ""}
                            onChange={(e) => handleChange(task.taskId, "from", e.target.value)}
                            className="border border-[#1B1717] rounded px-2 py-1 text-xs"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-[10px] opacity-60">To</label>
                          <input
                            type="date"
                            value={dateRanges[task.taskId]?.to || ""}
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
                        {task.status !== "Completed" && !task.submitted && (
                          <>
                            <button
                              onClick={() => handleEdit(task.taskId)}
                              className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-[#1B1717] px-2 py-1 rounded text-xs border border-[#1B1717]"
                            >
                              <Edit2 className="w-3 h-3" /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(task.taskId)}
                              className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-[#1B1717] px-2 py-1 rounded text-xs border border-[#1B1717]"
                            >
                              <Trash2 className="w-3 h-3" /> Delete
                            </button>
                          </>
                        )}
                        {task.submitted && (
                          <button
                            onClick={() => handleView(task.taskId)}
                            className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-[#1B1717] px-2 py-1 rounded text-xs border border-[#1B1717]"
                          >
                            <Eye className="w-3 h-3" /> View
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

        {/* Note Section */}
        <div className="bg-[#EEEBDD] p-3 rounded-lg border border-[#CE1212] text-sm text-[#1B1717]">
          <p><span className="font-semibold">Note:</span> Scores will be available once tasks are marked as Completed.</p>
        </div>
      </main>
    </div>
  );
}
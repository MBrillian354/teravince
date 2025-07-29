const API_BASE = 'http://localhost:5000/api';

export async function checkBias(taskId, review) {
  const res = await fetch(`${API_BASE}/check-bias/${taskId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ review })
  });
  return await res.json();
}

export async function getTask(taskId) {
  const res = await fetch(`${API_BASE}/get-task/${taskId}`);
  return await res.json();
}
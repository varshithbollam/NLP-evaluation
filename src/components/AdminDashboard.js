import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { useParams } from "react-router-dom";

const AdminDashboard = () => {
  const { projectId } = useParams();
  const [file, setFile] = useState(null);
  const [taskName, setTaskName] = useState("");
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [userProgress, setUserProgress] = useState({});

  const fetchTasksAndUsers = async () => {
    try {
      const tasksResponse = await axios.get(`http://localhost:5001/api/projects/${projectId}`);
      setTasks(tasksResponse.data.tasks);

      const usersResponse = await axios.get("http://localhost:5001/api/users");
      setUsers(usersResponse.data);
    } catch (error) {
      console.error("Error fetching tasks or users:", error);
    }
  };

  useEffect(() => {
    fetchTasksAndUsers();
  }, [projectId]);

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAssignUser = async (taskId, userId) => {
    try {
      await axios.put(`http://localhost:5001/api/tasks/${taskId}`, {
        userId,
      });
      fetchTasksAndUsers();
    } catch (error) {
      console.error("Error assigning user:", error);
    }
  };

  const handleTaskName = (e) => {
    setTaskName(e.target.value);
  };

  const handleUpload = async () => {
    if (file && taskName) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const extractedData = jsonData.slice(1).map((row) => ({
          index: row["S.NO."],
          english: row["English Sentence"],
          hindi: row["Hindi MT Outputs"],
        }));

        await axios.post("http://localhost:5001/api/upload", {
          data: extractedData,
          task_name: taskName,
          projectId: projectId,
        });
        alert("File uploaded successfully");
        fetchTasksAndUsers();
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Please select a file and provide a task name.");
    }
  };

  const handleDownloadReport = async (userId, taskId) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/downloadReport/${userId}/${taskId}`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_${userId}_${taskId}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div>
        <h3>Existing Tasks</h3>
        {tasks.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Items</th>
                <th>Assignee</th>
                <th>Progress</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr key={index}>
                  <td>{task.task_name}</td>
                  <td>{task.data.length}</td>
                  <td>
                    <select value={task.assignee} onChange={(e) => {
                      handleAssignUser(task._id, e.target.value)
                    }}>
                      <option value="">Select User</option>
                      {users.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.username}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    {task.taskProgress !== undefined ? `${task.completedSentences.length}/${task.data.length} (${task.taskProgress}%)` : 'N/A'}
                  </td>
                  <td>
                    <button onClick={() => handleDownloadReport(task.assignee, task._id)}>Download Report</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No tasks available</p>
        )}
      </div>
      <div>
        <h3>Create New Task</h3>
        <input type="file" onChange={handleFileUpload} />
        <input
          type="text"
          placeholder="Task Name"
          value={taskName}
          onChange={handleTaskName}
        />
        <button onClick={handleUpload}>Upload</button>
      </div>
    </div>
  );
};

export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const UserLandingPage = () => {
    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate();
    const { userId } = useParams()

    useEffect(() => {
        const fetchAssignedTasks = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/sentences/${userId}`);
                setTasks(response.data);
            } catch (error) {
                console.error('Error fetching sentences:', error);
            }
        };
        fetchAssignedTasks();
    
    }, [userId]);


    return (
        <div>
            <h1>User Dashboard</h1>
            <h2>Assigned Tasks</h2>
            <div>
                {tasks.map((task) => (
                    <div key={task._id}>
                        <h3>{task.task_name}</h3>
                        <button onClick={() => navigate(`/user/${userId}/task/${task._id}`)}>Start Task</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserLandingPage;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLandingPage = () => {
    const userId = 'user1';
    const [projects, setProjects] = useState([]);
    const [projectName, setProjectName] = useState('');
    const [projectDomain, setProjectDomain] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/projects');
                setProjects(response.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };
        fetchProjects();
    }, [userId]);

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5001/api/createProject', { name: projectName, domain: projectDomain });
            // Redirect to the admin dashboard for the new project
            navigate(`/admin/dashboard/${response.data.projectId}`);
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <form onSubmit={handleCreateProject}>
                <div>
                    <label>Project Name:</label>
                    <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} required />
                </div>
                <div>
                    <label>Project Domain:</label>
                    <input type="text" value={projectDomain} onChange={(e) => setProjectDomain(e.target.value)} required />
                </div>
                <button type="submit">Create Project</button>
            </form>
            <h2>Existing Projects</h2>
            <div>
                {projects.map((project) => (
                    <div key={project._id} className="project-card">
                        <h3>{project.project_name}</h3>
                        <p>{project.project_type}</p>
                        <button onClick={() => navigate(`/admin/dashboard/${project._id}`)}>Go to Dashboard</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminLandingPage;

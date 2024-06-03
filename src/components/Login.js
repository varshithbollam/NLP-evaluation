// src/components/Login.js
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try{
            const response = await axios.post('http://localhost:5001/api/login', {
                username,
                password
            });
            if (response.data.role === 'admin') {
                setUser('admin');
                navigate('/admin');
            } else {
                setUser('user');
                navigate(`/user/${response.data._id}`);
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>

            <div>
                Don't have an account? <a href="/signup">SignUp</a>
            </div>
        </div>
    );
};

export default Login;

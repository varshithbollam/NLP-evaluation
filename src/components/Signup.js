// src/components/Login.js
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = ({ setUser }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('user');
    const navigate = useNavigate();

    const handleSignUp = async () => {
        try{
            const response = await axios.post('http://localhost:5001/api/signup', {
                username,
                password,
                email,
                role
            });

            setUser(response.data);
            if (role === 'admin') {
                navigate('/admin');
            } else {
                navigate(`/user/${response.data._id}`);
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (
        <div>
            <h2>SignUp</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
            </select>
            <button onClick={handleSignUp}>SignUp</button>

            <div>
                Already have an account? <a href="/">Login</a>
            </div>
        </div>
    );
};

export default SignUp;

// client/src/components/Login.js

import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:3000/login', {
                username,
                password,
            });

            const token = response.headers.authorization;
            localStorage.setItem('token', token);

            onLogin();
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Control
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" onClick={handleLogin}>
                    Login
                </Button>
            </Form>
        </div>
    );
};

export default Login;

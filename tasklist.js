// client/src/components/TaskList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, ListGroup } from 'react-bootstrap';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/tasks', {
                    headers: { Authorization: token },
                });
                setTasks(response.data);
            } catch (error) {
                console.error('Failed to fetch tasks:', error);
            }
        };

        fetchTasks();
    }, []);

    const handleAddTask = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:3000/tasks',
                { title: newTask },
                { headers: { Authorization: token } }
            );
            setNewTask('');
            fetchTasks();
        } catch (error) {
            console.error('Failed to add task:', error);
        }
    };

    // ... (rest of the code remains the same)

    return (
        <div>
            <h2>Task List</h2>
            <Form.Group className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="New Task"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                />
                <Button variant="primary" onClick={handleAddTask}>
                    Add Task
                </Button>
            </Form.Group>
            <ListGroup>
                {tasks.map((task) => (
                    <ListGroup.Item key={task._id}>
                        {/* ... (rest of the code remains the same) */}
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
};

export default TaskList;

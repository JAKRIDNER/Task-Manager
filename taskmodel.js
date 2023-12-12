// server/models/TaskModel.js

const mongoose = require('mongoose');

const Task = mongoose.model('Task', {
    userId: mongoose.Types.ObjectId,
    title: String,
    description: String,
    dueDate: Date,
    completed: Boolean,
});

module.exports = Task;

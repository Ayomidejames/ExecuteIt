const express = require('express')
const { addTask, viewTasks, updateTask, deleteTask, viewTask } = require('../controllers/taskContrroller')
const authMiddleware = require('../middlewares/authMiddleware')
const taskRouter = express.Router()

taskRouter
    .post('/addTask', authMiddleware, addTask)
    .get('/getTasks', authMiddleware, viewTasks)
    .get('/getTask/:id', authMiddleware, viewTask)
    .put('/updateTask/:id', authMiddleware, updateTask)
    .delete('/removeTask/:id', authMiddleware, deleteTask)

module.exports = taskRouter
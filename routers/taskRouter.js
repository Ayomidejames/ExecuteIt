const express = require('express')
const { addTask, viewTasks } = require('../controllers/taskContrroller')
const authMiddleware = require('../middlewares/authMiddleware')
const taskRouter = express.Router()

taskRouter
    .post('/addTask', authMiddleware, addTask)
    .get('/getTasks', authMiddleware, viewTasks)

module.exports = taskRouter
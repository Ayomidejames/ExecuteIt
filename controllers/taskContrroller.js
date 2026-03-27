const Task = require("../schema/taskSchema");

const addTask = async(req, res) => {
    try {
        const { title, description, status } = req.body
        const user = req.user
        if ( !title || !description ) return res.status(400).json({msg: 'Enter all fields to add task'})
        const existingTask = await Task.findOne({
            title: title,
            userId: user._id,
            status: 'pending'
        })
        if (existingTask) return res.status(400).json({msg: 'Task already exist. Please complete task.'})
        const newTask = new Task({
            ...req.body, userId: user._id, status: status
        })
        await newTask.save()
        return res.status(200).json({message: 'You have added a new task.'})
    } catch (error) {
        return res.status(500).json({msg: error.message})
    }
}

const viewTasks = async(req, res) => {
    try {
        const user = req.user
        const tasks = await Task.find({ userId: user._id})
        if (!tasks) return res.status(404).json({msg: 'No tasks found.'})
        return res.status(200).json({
            count: tasks.length,
            tasks
        })
    } catch (error) {
        return res.status(500).json({msg: error.message})
    }
}

module.exports = {
    addTask,
    viewTasks
}
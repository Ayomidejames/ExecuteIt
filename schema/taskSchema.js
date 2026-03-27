const mongoose = require("mongoose")

const taskSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: ['pending', 'in-rogress', 'completed']
})

// tasks should be independent of individuals
const Task = mongoose.model('Task', taskSchema)
module.exports = Task
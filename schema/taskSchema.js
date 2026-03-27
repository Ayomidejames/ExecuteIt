const mongoose = require("mongoose")

const taskSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum : ['pending', 'in-progress', 'completed'],
        default: 'pending'
    }
})

// tasks should be independent of individuals
const Task = mongoose.model('Task', taskSchema)
module.exports = Task
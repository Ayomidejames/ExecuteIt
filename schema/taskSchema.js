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
    },
    category: {
        type: String,
        enum: ['Work', 'Personal', 'Finance', 'Health', 'Other'],
        default: 'other'
    },
    deadline: Date,
    due: {
        type: Boolean,
        default: false
    }
})

// tasks should be independent of individuals
const Task = mongoose.model('Task', taskSchema)
module.exports = Task
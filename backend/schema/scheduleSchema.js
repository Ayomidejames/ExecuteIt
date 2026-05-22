const mongoose = require('mongoose')

const scheduleSchema = mongoose.Schema({
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    reminderMessage: {
        type: String,
        required: true
    },
    scheduledAt: {
        type: Date,
        required: true
    },
    
    status: {
        type: String,
        enum : ['pending', 'in-progress', 'completed'],
        default: 'pending'
    },
}, { timestamps: true});

const Schedule = mongoose.model("Schedule", scheduleSchema)

module.exports = Schedule
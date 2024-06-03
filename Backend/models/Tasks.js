const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    task_name: {
        type: String,
        required: true
    },
    project_id: {
        type: mongoose.Types.ObjectId,
        ref: "Project",
        required: true
    },
    assigne: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    data: [{
        type: mongoose.Types.ObjectId,
        ref: "SentencePair"
    }],

    completedSentences: [{ type: mongoose.Types.ObjectId, ref: 'SentencePair' }], // Add this line
    taskProgress: { type: Number, default: 0 }
});

const TaskModel = mongoose.model('Task', TaskSchema);

module.exports = TaskModel;
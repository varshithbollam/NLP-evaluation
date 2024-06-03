// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const SentencePairModel = require('./models/SentencePair');
const ProjectModel = require('./models/Projects');
const TaskModel = require('./models/Tasks');
const UserModel = require('./models/Users');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://root:root@cluster0.cupznfi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('Failed to connect to MongoDB', err));

app.post('/api/signup', async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        const user = new UserModel({
            username,
            email,
            password,
            role
        });
        await user.save();
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'Error signing up', error });
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await UserModel.findOne({ username, password });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error logging in' });
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const users = await UserModel.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
});

// Route to fetch all projects
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await ProjectModel.find({});
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching projects' });
    }
});

// Endpoint to fetch project details by projectId
app.get('/api/projects/:projectId', async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await ProjectModel.findById(projectId).populate({
            path: 'tasks',
            populate: {
                path: 'data'
            }
        });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching project', error });
    }
});

// Route to create a new project
app.post('/api/createProject', async (req, res) => {
    try {
        const { name, domain } = req.body;
        const newProject = new ProjectModel({ project_name: name, project_type: domain });
        await newProject.save();
        res.json({ projectId: newProject._id });
    } catch (error) {
        res.status(500).json({ error: 'Error creating project' });
    }
});

app.post('/api/upload', async (req, res) => {
    const { data, task_name, projectId } = req.body;

    try {
        // Find the project by its ID
        const project = await ProjectModel.findById(projectId);

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const newTask = new TaskModel({
            task_name,
            project_id: projectId,
        });
        await newTask.save();

        project.tasks.push(newTask._id);
        await project.save();

        const sentencePairs = data.map(pair => ({
            english: pair.english,
            hindi: pair.hindi,
            task: newTask._id,
            user: null,
            index: pair.index
        }));

        const insertedPairs = await SentencePairModel.insertMany(sentencePairs);

        const sentencePairIds = insertedPairs.map(pair => pair._id);
        newTask.data.push(...sentencePairIds);
        await newTask.save();

        res.send('Data uploaded');
    } catch (error) {
        console.error(error);
        res.status(400).send('Validation failed');
    }
});

// Route to assign a user to a task
app.put('/api/tasks/:taskId', async (req, res) => {
    const { taskId } = req.params;
    const { userId } = req.body;

    try {
        const task = await TaskModel.findById(taskId);
        task.assigne = userId;
        await task.save();
        res.json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get sentences for a specific user
app.get('/api/sentences/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const tasks = await TaskModel.find({ assigne: userId }).populate('data');
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get sentences for a specific task
app.get('/api/tasks/:taskId', async (req, res) => {
    const taskId = req.params.taskId;
    try {
        const task = await TaskModel.findById(taskId).populate('data');
        res.json(task.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update answers for a specific sentence
app.post('/api/updateAnswers', async (req, res) => {
    const { userId, sentenceId, answers } = req.body;
    console.log(userId, sentenceId, answers)
    try {
        await SentencePairModel.findByIdAndUpdate(sentenceId, { $set: { ...answers }, done: true });
        res.status(200).json({ message: 'Answers updated successfully' });
    } catch (error) {
        console.error('Error updating answers:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// Save progress for a specific task
// Other imports and app configuration...

app.post('/api/saveProgress', async (req, res) => {
    const { userId, taskId, completedSentences, taskProgress } = req.body;
    console.log('Saving progress:', { userId, taskId, completedSentences, taskProgress });

    try {
        const task = await TaskModel.findOneAndUpdate(
            { assigne: userId, _id: taskId },
            { completedSentences, taskProgress },
            { new: true }
        );
        if (!task) {
            console.error('Task not found for saving progress');
            return res.status(404).json({ message: 'Task not found' });
        }
        console.log('Progress saved successfully:', task);
        res.json(task);
    } catch (error) {
        console.error('Error saving progress:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get progress for a specific user and task
app.get('/api/progress/:userId/:taskId', async (req, res) => {
    const { userId, taskId } = req.params;
    try {
        const task = await TaskModel.findOne({ assigne: userId, _id: taskId });
        if (task) {
            res.json({ completedSentences: task.completedSentences, taskProgress: task.taskProgress });
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        console.error('Error fetching progress:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Generate and download task report
// Route to download task report based on user ID and task ID
app.get('/api/downloadReport/:userId/:taskId', async (req, res) => {
    const { userId, taskId } = req.params;
    try {
        // Fetch task data and user details
        const task = await TaskModel.findById(taskId).populate('data');
        const user = await UserModel.findById(userId);

        // Generate report data (dummy example)
        const reportData = task.data.map(sentence => ({
            English: sentence.english,
            Hindi: sentence.hindi,
            // Add more fields as needed
        }));

        // Convert report data to Excel file using XLSX library
        const XLSX = require('xlsx');
        const ws = XLSX.utils.json_to_sheet(reportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Report');
        const reportBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

        // Set response headers for file download
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=report_${userId}_${taskId}.xlsx`);

        // Send the report file as response
        res.send(reportBuffer);
    } catch (error) {
        console.error('Error downloading report:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
const port = 5001;
app.listen(port, () => console.log(`Server running on port ${port}`));

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const taskRoutes = require('./routes/taskRoutes');
const biasRoutes = require('./routes/biasRoutes');
const exampleRoutes = require('./routes/exampleRoutes');
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const reportRoutes = require('./routes/reportRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection string
// const MONGO_URI = 'mongodb://127.0.0.1:27017/teravince';
const MONGO_URI = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-shard-00-00.eupjv.mongodb.net:27017,cluster0-shard-00-01.eupjv.mongodb.net:27017,cluster0-shard-00-02.eupjv.mongodb.net:27017/${process.env.DB_NAME}?ssl=true&replicaSet=atlas-cph2wz-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0`;
// Determine if the DB connection is local or Atlas
const isLocalDB = MONGO_URI.includes('127.0.0.1') || MONGO_URI.includes('localhost');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log('Received URL:', req.originalUrl);
    next();
});

// Default route
app.get('/', (req, res) => {
    res.send('Server is running...');
});

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/bias-check', biasRoutes);
app.use('/api/examples', exampleRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).send('Something broke!');
});

// Connect and start server
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log(`Connected to MongoDB (${isLocalDB ? 'Local' : 'Atlas'})`);
        app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

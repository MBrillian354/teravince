require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const taskRoutes = require('./routes/taskRoutes');
const biasRoutes = require('./routes/biasRoutes');
const exampleRoutes = require('./routes/exampleRoutes'); 

const app = express();
const PORT = process.env.PORT || 5000;

const MONGO_URI = 'mongodb://127.0.0.1:27017/teravince';

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
app.use('/api/bias', biasRoutes);
app.use('/api/examples', exampleRoutes); 

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).send('Something broke!');
});

// Connect and start server
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log(`Connected to MongoDB`);
        app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

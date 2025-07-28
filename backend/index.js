// index.js
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables
const cors = require('cors');



const exampleRoutes = require('./routes/exampleRoutes');


const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection string
const MONGO_URI = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-shard-00-00.eupjv.mongodb.net:27017,cluster0-shard-00-01.eupjv.mongodb.net:27017,cluster0-shard-00-02.eupjv.mongodb.net:27017/${process.env.DB_NAME}?ssl=true&replicaSet=atlas-cph2wz-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0`;
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data

// Middleware
app.use((req, res, next) => {
    console.log('Received URL:', req.originalUrl);
    next();
});

// CORS handling
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

    next();
});




// Routes
app.use('/api/examples', exampleRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('server Server is Running');
});




// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Connect to MongoDB and start the server
mongoose.connect(MONGO_URI, clientOptions)
  .then(() => {
    console.log(`Connected to MongoDB -> ${process.env.DB_NAME}`);
    app.listen(process.env.PORT || PORT, () => {
      console.log(`Server is running on http://localhost:${process.env.PORT || PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
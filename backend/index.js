const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config(); 
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./utils/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
//connectDB();

// Middleware
app.use(express.json());

//cors
app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials: true
}))

// Routes
app.use('/api', authRoutes);

// Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
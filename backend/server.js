require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const requirementsRoutes = require('./routes/requirements');
app.use('/api/requirements', requirementsRoutes);

const PORT = process.env.PORT || 5000;
// Database Connection
const startDB = async () => {
  let uri = process.env.MONGO_URI;
  if (!uri) {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create();
    uri = mongoServer.getUri();
  }
  
  mongoose.connect(uri)
    .then(() => {
      console.log('Connected to MongoDB at ' + uri);
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Database connection error:', err);
    });
};

startDB();

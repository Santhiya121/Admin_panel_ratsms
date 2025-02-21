const express = require('express');
const cors = require('cors');
const fileRoutes = require('./routes/fileRoutes');
const { connectDB } = require('./config/db');
const { Link } = require('./models/urlData'); 

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/file', fileRoutes);

// Async function to handle DB connection and server startup
const startServer = async () => {
  try {
    // Sync the Link model (create table if not exists)
    await Link.sync({ force: false });

    // Connect to DB
    await connectDB();

    // Start the server after successful DB connection
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error:', error);
  }
};

// Start the server
startServer();

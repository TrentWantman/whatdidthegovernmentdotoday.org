require('dotenv').config();
const express = require('express');
const cors = require('cors');
const congressRoutes = require('./routes/congressRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Allow React dev server on localhost:3000
app.use(cors({ origin: 'http://localhost:3000' }));

// Simple welcome route
app.get('/', (req, res) => {
  res.send('Welcome to the What Did The Government Do? API');
});

// Use our congress routes
app.use('/api/congress', congressRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Backend server running on http://localhost:${PORT}`);
});

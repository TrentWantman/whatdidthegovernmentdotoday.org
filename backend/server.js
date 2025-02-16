const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Log API Key for confirmation
console.log('Using CONGRESS_API_KEY:', process.env.CONGRESS_API_KEY);

app.use(cors());

// Default Route
app.get('/', (req, res) => {
  res.send('Welcome to the Congress.gov API Proxy');
});

// Congress Actions Proxy (Sorted by Most Recent Date)
app.get('/api/congress/latest', async (req, res) => {
  const apiKey = process.env.CONGRESS_API_KEY;

  if (!apiKey) {
    console.error('CONGRESS_API_KEY is missing');
    return res.status(500).json({ error: 'Congress API key is missing' });
  }

  try {
    const response = await axios.get('https://api.congress.gov/v3/bill', {
      headers: {
        'X-API-Key': apiKey,
      },
      params: {
        format: 'json',
        limit: 20, // Increase limit to see more actions
      },
    });

    // Sort bills by most recent action date (descending)
    const sortedBills = response.data.bills.sort((a, b) => {
      const dateA = new Date(a.latestActionDate || a.introducedDate);
      const dateB = new Date(b.latestActionDate || b.introducedDate);
      return dateB - dateA; // Sort descending
    });

    console.log('Sorted Congress API Response:', sortedBills);
    res.json({ bills: sortedBills });
  } catch (error) {
    console.error('Congress API Error:', error.response ? error.response.data : error.message);
    res.status(500).json({
      error: 'Failed to fetch congressional actions',
      details: error.response ? error.response.data : error.message,
    });
  }
});

// Start Server
app.listen(PORT, () => console.log(`Proxy server running on http://localhost:${PORT}`));

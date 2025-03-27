
import axios from 'axios';
import jsonpAdapter from 'axios-jsonp';

// import express from 'express';
// import Cors from 'cors';
// import fetch from 'node-fetch';  // Use node-fetch for API calls
/*
const cors = Cors({
    methods: ['GET', 'HEAD'],  // Allow only GET and HEAD requests
    allowedHeaders: ['Content-Type'], // Allow specific headers
    origin: 'https://media-sphere.vercel.app', // Allow only your frontend app's origin
});

const app = express();

// Enable CORS for a specific origin (e.g., 'https://media-sphere.vercel.app')
app.use(cors({
    origin: 'https://media-sphere.vercel.app'
}));*/

export default async function handler(req, res) {
// app.get('/api/suggestions', async (req, res) => {
// const handler = async (req, res) => {
    /*
    await new Promise((resolve, reject) => cors(req, res, (result) => {
        if (result instanceof Error) {
        reject(result);
        } else {
        resolve();
        }
    }));*/

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'https://media-sphere.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { term } = req.query;

  if (!term) {
    return res.status(400).json({ error: 'Search term is required' });
  }

  const GOOGLE_AC_URL = 'https://clients1.google.com/complete/search';

  // Check if we are in a browser environment
  const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

  try {
    let response;

    // If in a browser, use jsonpAdapter
    if (isBrowser) {
      response = await axios({
        url: GOOGLE_AC_URL,
        adapter: jsonpAdapter,
        params: {
          client: 'youtube',  // YouTube-specific client
          hl: 'en',           // Language parameter
          ds: 'yt',           // Data source parameter (YouTube)
          q: term,            // Search term
        },
      });
    } else {
      // Use regular Axios if on the server-side
      response = await axios.get(GOOGLE_AC_URL, {
        params: {
          client: 'youtube',
          hl: 'en',
          ds: 'yt',
          q: term,
        },
      });
    }

    // Log the entire response data for debugging
    console.log('Response Data:', response.data);

    // The response is wrapped in a function call, so we need to remove the function and extract the actual data
    const rawData = response.data;
    const jsonData = rawData.substring(rawData.indexOf('(') + 1, rawData.lastIndexOf(')')); // Extract the JSON part
    const parsedData = JSON.parse(jsonData);  // Parse the JSON string into an object

    // Check if the second element of the array exists and is an array
    if (Array.isArray(parsedData[1])) {
      const suggestions = parsedData[1].map((item) => item[0]);
      // console.log(res.status(200).json(suggestions));
      return res.status(200).json(suggestions);
    } else {
      console.error('Invalid response structure:', parsedData);
      return res.status(500).json({ error: 'Invalid response structure from Google Suggest API' });
    }

  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return res.status(500).json({ error: 'Error fetching suggestions' });
  }
}

// export default handler;
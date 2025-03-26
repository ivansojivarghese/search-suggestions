
import axios from 'axios';
import jsonpAdapter from 'axios-jsonp';

export default async function handler(req, res) {
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

    // Respond with the suggestions (second array in the response)
    /*
    const suggestions = response.data[1].map((item) => item[0]);
    return res.status(200).json(suggestions);
    */

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

/*

import axios from 'axios';
import jsonpAdapter from 'axios-jsonp';
// import jsonp from 'jsonp';  // Import the jsonp package
// import fetchJsonp from 'fetch-jsonp';

export default async function handler(req, res) {
  const { term } = req.query;

  if (!term) {
    return res.status(400).json({ error: 'Search term is required' });
  }

  const GOOGLE_AC_URL = 'https://clients1.google.com/complete/search';
  
  try {
    // Make the request to the Google Suggest API using axios with jsonpAdapter
    const response = await axios({
      url: GOOGLE_AC_URL,
      adapter: jsonpAdapter,
      params: {
        client: 'youtube',  // YouTube-specific client
        hl: 'en',           // Language parameter
        ds: 'yt',           // Data source parameter (YouTube)
        q: term,            // Search term
      },
    });

    // Respond with the suggestions (second array in the response)
    const suggestions = response.data[1].map((item) => item[0]);
    return res.status(200).json(suggestions);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return res.status(500).json({ error: 'Error fetching suggestions' });
  }
}

*/

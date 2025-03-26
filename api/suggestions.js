
// api/suggestions.js
import axios from 'axios';
import jsonpAdapter from 'axios-jsonp';

export default async function handler(req, res) {
  const { term } = req.query;

  if (!term) {
    return res.status(400).json({ error: 'Search term is required' });
  }

  const GOOGLE_AC_URL = 'https://clients1.google.com/complete/search';
  
  try {
    const response = await axios({
      url: GOOGLE_AC_URL,
      adapter: jsonpAdapter,
      params: {
        client: 'youtube',
        hl: 'en',
        ds: 'yt',
        q: term,
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

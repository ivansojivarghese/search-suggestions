
# Search Suggestions API

This project provides an API to fetch search suggestions using the Google Suggest API. The API handles requests from both browser and server environments, manages CORS (Cross-Origin Resource Sharing) issues, and parses the response data to return relevant search suggestions based on the provided term.

## Technologies Used

- **Node.js**: Server-side JavaScript runtime.
- **Express.js**: Web framework to handle API requests.
- **Axios**: Promise-based HTTP client to make requests.
- **CORS**: Middleware to manage cross-origin requests and security.
- **Google Suggest API**: API for fetching search suggestions from Google.

## Setup and Installation

### Prerequisites
To run this project locally, you need the following installed:
- [Node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/ivansojivarghese/search-suggestions.git
   cd search-suggestions
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

   This will start the Express server on `http://localhost:3000`.

## API Endpoints

### `/api/suggestions`

- **Method**: `GET`
- **Query Parameters**: 
  - `term` (required): The search term to get suggestions for.

#### Example Request:

```bash
GET http://localhost:3000/api/suggestions?term=trump
```

#### Example Response:

```json
[
  "trump news",
  "trump 2024",
  "trump rally",
  "trump impeachment",
  "trump speech"
]
```

### Error Handling

- If the `term` parameter is missing:
  ```json
  {
    "error": "Search term is required"
  }
  ```

- If an error occurs while fetching suggestions (e.g., network error):
  ```json
  {
    "error": "Error fetching suggestions"
  }
  ```

## Features

- **CORS Handling**: The server uses the `cors` middleware to allow cross-origin requests from specified domains, such as `https://media-sphere.vercel.app`. You can modify the allowed origins based on your needs.
  
- **Browser and Server-Side Support**: The API distinguishes between browser and server environments and adjusts its request handling accordingly:
  - In the browser, it uses a JSONP adapter to bypass CORS restrictions.
  - On the server, it uses a regular Axios GET request.

- **Search Term Suggestions**: The API communicates with the Google Suggest API (`https://clients1.google.com/complete/search`) to retrieve relevant search suggestions for a given search term. It extracts and returns the suggestions in a clean format.

- **Error Handling**: The API includes robust error handling, ensuring meaningful responses are sent if the request is invalid or if there is an issue with fetching suggestions.

## Code Overview

### Server Setup

The server is built with **Express.js** and uses **Axios** to fetch search suggestions. CORS is handled using the `cors` middleware, which allows cross-origin requests from specific domains.

```js
import express from 'express';
import axios from 'axios';
import cors from 'cors';
import jsonpAdapter from 'axios-jsonp';

const app = express();

// CORS Configuration to allow a specific origin
app.use(cors({ origin: 'https://media-sphere.vercel.app' }));

// Endpoint to handle search suggestions
app.get('/api/suggestions', async (req, res) => {
  const { term } = req.query;

  if (!term) {
    return res.status(400).json({ error: 'Search term is required' });
  }

  const GOOGLE_AC_URL = 'https://clients1.google.com/complete/search';

  // Detect if we are in a browser environment
  const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

  try {
    let response;

    // If in a browser, use jsonpAdapter for handling CORS
    if (isBrowser) {
      response = await axios({
        url: GOOGLE_AC_URL,
        adapter: jsonpAdapter,
        params: { client: 'youtube', hl: 'en', ds: 'yt', q: term },
      });
    } else {
      // Server-side request
      response = await axios.get(GOOGLE_AC_URL, {
        params: { client: 'youtube', hl: 'en', ds: 'yt', q: term },
      });
    }

    // Parse the response and extract suggestions
    const rawData = response.data;
    const jsonData = rawData.substring(rawData.indexOf('(') + 1, rawData.lastIndexOf(')'));
    const parsedData = JSON.parse(jsonData);

    if (Array.isArray(parsedData[1])) {
      const suggestions = parsedData[1].map(item => item[0]);
      return res.status(200).json(suggestions);
    } else {
      return res.status(500).json({ error: 'Invalid response structure from Google Suggest API' });
    }

  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return res.status(500).json({ error: 'Error fetching suggestions' });
  }
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
```

## Deployment

To deploy this API to platforms like **Vercel** or **Heroku**, follow their respective guides for deploying Node.js applications.

For **Vercel**:
1. Install Vercel CLI: `npm install -g vercel`
2. Deploy with: `vercel deploy`

For **Heroku**:
1. Create a Heroku app: `heroku create`
2. Push the code: `git push heroku main`

## Conclusion

This project demonstrates how to create a simple API to fetch search suggestions using Google Suggest and handle CORS issues. It also handles both client-side and server-side environments, providing a smooth experience for various platforms.

// api/trending.js
export default async function handler(req, res) {
  const response = await fetch("https://trends.google.com/trends/api/dailytrends?hl=en-US&geo=US&ns=15&tz=-480", {
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  });

  const text = await response.text();

  // Google Trends API returns malformed JSON, we need to clean it
  const cleaned = text.replace(")]}',", "");

  const data = JSON.parse(cleaned);
  const trendingSearches = data.default.trendingSearchesDays[0].trendingSearches.map(entry => entry.title.query);

  res.status(200).json({ trending: trendingSearches });
}

// src/components/OfficialInfo.jsx

import { useState, useEffect } from 'react';

// --- Pre-generated AI Content for Demo Reliability ---
const preGeneratedArticles = [
    {
        "title": "Hyderabad Rains: City on Yellow Alert, IMD Predicts More Showers",
        "summary": "The IMD has issued a yellow alert for Hyderabad, forecasting continued rainfall and potential thunderstorms over the next 24 hours.",
        "link": "https://timesofindia.indiatimes.com/city/hyderabad/hyderabad-rains-city-on-yellow-alert-imd-predicts-more-showers/articleshow/104169554.cms",
        "imageUrl": "https://static.toiimg.com/thumb/msid-104169555,width-1280,height-720,resizemode-75/104169555.jpg"
    },
    {
        "title": "Waterlogging in Several Areas After Overnight Rain, GHMC Teams on Ground",
        "summary": "Low-lying areas in Kukatpally, Miyapur, and LB Nagar have reported significant waterlogging, prompting GHMC to deploy disaster response teams.",
        "link": "https://www.thehindu.com/news/cities/Hyderabad/waterlogging-in-several-areas-of-hyderabad-after-overnight-rain/article6738437.ece",
        "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYi5hrMM16aHVrEfKD_ifUKGUKm1ejQmoXYA&s"
    },
    {
        "title": "Traffic Slows Down in Hyderabad Amidst Incessant Rains",
        "summary": "Major junctions and IT corridors are facing traffic snarls due to waterlogging and ongoing showers, with traffic police issuing advisories.",
        "link": "https://www.deccanchronicle.com/nation/in-other-news/051025/hyderabad-traffic-slows-down-amidst-incessant-rains.html",
        "imageUrl": "https://www.hindustantimes.com/ht-img/img/2025/08/04/1600x900/hyderabad_rains_1754309673971_1754309677685.png"
    }
];

const OfficialInfo = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(null);
  
  // State for the live text summary
  const [newsSummary, setNewsSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState(null);

  useEffect(() => {
    // 1. Fetch Weather Data (existing logic)
    const fetchWeatherData = (latitude, longitude) => {
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
      fetch(apiUrl)
        .then(response => { if (!response.ok) throw new Error('Failed to fetch weather data.'); return response.json(); })
        .then(data => setWeatherData(data))
        .catch(err => setWeatherError(err.message))
        .finally(() => setWeatherLoading(false));
    };

    if (!navigator.geolocation) {
      setWeatherError("Geolocation is not supported by your browser.");
      setWeatherLoading(false);
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => fetchWeatherData(position.coords.latitude, position.coords.longitude),
        (err) => { setWeatherError(`Error getting location: ${err.message}`); setWeatherLoading(false); }
      );
    }

    // 2. Fetch Live Text News Summary
    const fetchNewsSummary = async () => {
      const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!geminiApiKey) { setSummaryError("Gemini API key not configured."); setSummaryLoading(false); return; }
      
      const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${geminiApiKey}`;
      const systemPrompt = "You are a helpful local news assistant. Provide a clear, concise, factual summary of the latest weather-related news in India. Use markdown for formatting, with bolding for headings (e.g., **Affected Areas:**).";
      const userQuery = "Summarize the latest news regarding heavy rains, waterlogging, or flooding in Hyderabad, Telangana, India for today.";

      try {
        const response = await fetch(GEMINI_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userQuery }] }],
            tools: [{ "google_search": {} }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
          })
        });
        if (!response.ok) throw new Error(`API responded with status ${response.status}`);
        const result = await response.json();
        const rawSummary = result.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawSummary) {
          const formattedSummary = rawSummary.replace(/\*\*(.*?)\*\*/g, '<h3>$1</h3>').replace(/\*/g, '').replace(/\n/g, '<br />');
          setNewsSummary(formattedSummary);
        } else {
          throw new Error("No summary was generated.");
        }
      } catch (err) {
        setSummaryError("Could not fetch the latest news summary.");
      } finally {
        setSummaryLoading(false);
      }
    };

    fetchNewsSummary();
  }, []);

  return (
    <div className="page-container">
      <h2>Official Info & Alerts</h2>
      
      {/* Weather Section */}
      <div className="weather-section">
        {weatherLoading && <div className="loading-spinner"></div>}
        {weatherError && <p className="error-message">{weatherError}</p>}
        {weatherData && (
          <div className="weather-card">
            <h3>Current Weather in {weatherData.name}</h3>
            <div className="weather-main">
              <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} alt={weatherData.weather[0].description} className="weather-icon"/>
              <div className="weather-temp">{Math.round(weatherData.main.temp)}°C</div>
              <div className="weather-desc">{weatherData.weather[0].description}</div>
            </div>
            <div className="weather-details">
              <p>Feels like: {Math.round(weatherData.main.feels_like)}°C</p>
              <p>Humidity: {weatherData.main.humidity}%</p>
              <p>Wind: {weatherData.wind.speed} m/s</p>
            </div>
          </div>
        )}
      </div>

      {/* Live Gemini News Summary Section */}
      <div className="news-summary-section">
        <h3>Today's Live Weather News</h3>
        {summaryLoading && <p>Generating news summary with AI...</p>}
        {summaryError && <p className="error-message">{summaryError}</p>}
        {newsSummary && (
          <div className="news-summary-card">
            <div dangerouslySetInnerHTML={{ __html: newsSummary }} />
          </div>
        )}
      </div>

      {/* In-Depth Articles Section (using reliable dummy data) */}
      <div className="news-articles-section">
        <h3>In-Depth Articles</h3>
        <div className="news-grid">
          {preGeneratedArticles.map((article, index) => (
            <a href={article.link} target="_blank" rel="noopener noreferrer" key={index} className="news-card">
              <img 
                src={article.imageUrl} 
                alt={article.title} 
                className="news-card-image"
                onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/ecf0f1/7f8c8d?text=Image+Not+Found' }}
              />
              <div className="news-card-content">
                <h4>{article.title}</h4>
                <p>{article.summary}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OfficialInfo;


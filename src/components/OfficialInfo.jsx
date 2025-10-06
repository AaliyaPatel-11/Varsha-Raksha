// src/components/OfficialInfo.jsx

import { useState, useEffect } from 'react';

// --- Dummy Data for Announcements (Using your provided images) ---
const dummyAnnouncements = [
  {
    id: 1,
    title: 'Severe Waterlogging Reported',
    content: 'The underpass at Paradise Circle is completely flooded. Please avoid the area and use alternative routes.',
    severity: 'High',
    timestamp: '2025-10-05T15:10:00Z',
    imageUrl: 'https://c.ndtvimg.com/2025-08/flhtpsh4_hyderabad_625x300_04_August_25.jpg?im=FeatureCrop,algorithm=dnn,width=1200,height=738'
  },
  {
    id: 2,
    title: 'Potential Power Outages',
    content: 'Due to heavy winds, there may be intermittent power cuts in the Begumpet area. Teams are on standby.',
    severity: 'Medium',
    timestamp: '2025-10-05T14:30:00Z',
    imageUrl: 'https://static.toiimg.com/thumb/msid-123394513,width-1280,height-720,resizemode-72/123394513.jpg'
  },
  {
    id: 3,
    title: 'Relief Camp Information',
    content: 'A temporary relief camp has been set up at the community hall. Water and first-aid are available.',
    severity: 'Low',
    timestamp: '2025-10-05T13:00:00Z',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYdRR_hM0OrZbmEt7Vgm6XhvLjVsnMDINPrg&s'
  },
];

// --- CORRECTED: Pre-generated AI Content with proper HTML formatting ---
const preGeneratedNewsSummary = `<h3>Overall Situation:</h3><p>Following overnight showers, GHMC has reported moderate waterlogging in low-lying areas, particularly around Kukatpally and LB Nagar. The India Meteorological Department (IMD) has issued a Yellow Alert for the city, forecasting further light to moderate rain throughout the day.</p><br /><h3>Traffic & Travel Advisories:</h3><p>Residents are advised to anticipate traffic congestion on major routes. Key areas like Paradise Circle and parts of the Outer Ring Road are experiencing slower than usual traffic. Commuters are encouraged to check live traffic updates before starting their journey.</p>`;

// --- CORRECTED: Using more reliable image URLs ---
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
        "imageUrl": "https://th-i.thgim.com/public/incoming/p6y3q1/article67384370.ece/alternates/LANDSCAPE_1200/hyderabad%20rains.jpg"
    },
    {
        "title": "Traffic Slows Down in Hyderabad Amidst Incessant Rains",
        "summary": "Major junctions and IT corridors are facing traffic snarls due to waterlogging and ongoing showers, with traffic police issuing advisories.",
        "link": "https://www.deccanchronicle.com/nation/in-other-news/051025/hyderabad-traffic-slows-down-amidst-incessant-rains.html",
        "imageUrl": "https://s3.ap-southeast-1.amazonaws.com/images.deccanchronicle.com/dc-Cover-b4p0k0i7r8k2p8n8f3f8j8k8v1-20180911010204.Medi.jpeg"
    }
];


const OfficialInfo = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(null);

  useEffect(() => {
    // Weather fetching logic remains the same
    if (!navigator.geolocation) {
      setWeatherError("Geolocation is not supported by your browser.");
      setWeatherLoading(false);
      return;
    }
    const handleSuccess = async (position) => {
      const { latitude, longitude } = position.coords;
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Failed to fetch weather data.');
        const data = await response.json();
        setWeatherData(data);
      } catch (err) {
        setWeatherError(err.message);
      } finally {
        setWeatherLoading(false);
      }
    };
    const handleError = (err) => {
      setWeatherError(`Error getting location: ${err.message}`);
      setWeatherLoading(false);
    };
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
  }, []);

  return (
    <div className="page-container">
      <h2>Official Info & Alerts</h2>
      
      {/* Weather Section */}
      <div className="weather-section">
        {weatherLoading && <p>Loading weather data...</p>}
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

      {/* Gemini News Summary Section */}
      <div className="news-summary-section">
        <h3>Today's Weather News Summary</h3>
        <div className="news-summary-card">
          <div dangerouslySetInnerHTML={{ __html: preGeneratedNewsSummary }} />
        </div>
      </div>

      {/* Gemini News Articles Section */}
      <div className="news-articles-section">
        <h3>In-Depth Articles</h3>
        <div className="news-grid">
          {preGeneratedArticles.map((article, index) => (
            <a href={article.link} target="_blank" rel="noopener noreferrer" key={index} className="news-card">
              <img 
                src={article.imageUrl} 
                alt={article.title} 
                className="news-card-image"
                onError={(e) => { e.target.style.display = 'none' }} // Hide image if it fails to load
              />
              <div className="news-card-content">
                <h4>{article.title}</h4>
                <p>{article.summary}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Local Announcements */}
      <div className="announcements-section">
        <h3>Local Announcements</h3>
        <div className="announcements-list">
          {dummyAnnouncements.map((item) => (
            <div key={item.id} className={`announcement-card severity-${item.severity}`}>
              {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="announcement-image" />}
              <div className="announcement-content">
                <h4>{item.title}</h4>
                <p>{item.content}</p>
                <small>Posted: {new Date(item.timestamp).toLocaleTimeString()}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OfficialInfo;


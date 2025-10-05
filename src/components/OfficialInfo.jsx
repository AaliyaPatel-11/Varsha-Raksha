// src/components/OfficialInfo.jsx

import { useState, useEffect } from 'react';

// --- Updated Dummy Data with Images ---
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

const OfficialInfo = () => {
  // Weather state and useEffect logic remains the same...
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This logic is unchanged
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }
    const handleSuccess = async (position) => {
      const { latitude, longitude } = position.coords;
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Failed to fetch weather data. The API key may still be activating.');
        const data = await response.json();
        setWeatherData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    const handleError = (err) => {
      setError(`Error getting location: ${err.message}`);
      setLoading(false);
    };
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
  }, []);

  return (
    <div className="page-container">
      <h2>Official Info & Alerts</h2>
      
      <div className="weather-section">
        {loading && <p>Loading weather data...</p>}
        {error && <p className="error-message">{error}</p>}
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

      <div className="announcements-section">
        <h3>Official Announcements</h3>
        <div className="announcements-list">
          {dummyAnnouncements.map((item) => (
            <div key={item.id} className={`announcement-card severity-${item.severity}`}>
              {/* NEW: Conditionally render the image if the URL exists */}
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
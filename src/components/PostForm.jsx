// src/components/PostForm.jsx

import { useState } from 'react';
import { db, auth, storage } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const PostForm = () => {
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('');
  const [manualLocation, setManualLocation] = useState('');

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.');
      return;
    }
    setLocationStatus('Getting location...');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setLocationStatus('Fetching address...');
        const { latitude, longitude } = position.coords;
        const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
        const reverseGeocodeUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`;

        try {
          const response = await fetch(reverseGeocodeUrl);
          if (!response.ok) throw new Error('Failed to fetch address.');
          const data = await response.json();
          const locationName = data[0] ? `${data[0].name}, ${data[0].state}` : 'Unknown Location';
          
          setLocation({
            lat: latitude,
            lon: longitude,
            name: locationName,
          });
          setManualLocation(locationName);
          setLocationStatus(`Location attached: ${locationName}`);
        } catch (err) {
          setLocationStatus('Could not fetch address. Coordinates saved.');
          setLocation({ lat: latitude, lon: longitude, name: 'Coordinates Only' });
        }
      },
      () => {
        setLocationStatus('Unable to retrieve location.');
      }
    );
  };

  const handleSubmit = async (e, category) => {
    e.preventDefault();
    if (!content.trim() || !auth.currentUser) return;
    
    setIsUploading(true);
    setError('');
    let finalLocation = null;

    if (manualLocation.trim() && (!location || manualLocation.trim() !== location.name)) {
      setLocationStatus(`Geocoding "${manualLocation.trim()}"...`);
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
      const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(manualLocation.trim())}&limit=1&appid=${apiKey}`;
      
      try {
        const response = await fetch(geocodeUrl);
        if (!response.ok) throw new Error('API request failed');
        const data = await response.json();
        if (data && data.length > 0) {
          finalLocation = { name: data[0].name, lat: data[0].lat, lon: data[0].lon };
        } else {
          finalLocation = { name: manualLocation.trim(), lat: null, lon: null };
        }
      } catch (err) {
        console.error("Geocoding failed:", err);
        finalLocation = { name: manualLocation.trim(), lat: null, lon: null };
      }
    } else {
      finalLocation = location;
    }

    const { uid, displayName, photoURL } = auth.currentUser;
    let imageUrl = '';
    try {
      if (imageFile) {
        const imageRef = ref(storage, `posts/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }
      await addDoc(collection(db, 'posts'), {
        authorId: uid,
        authorName: displayName,
        authorPhotoURL: photoURL,
        content: content.trim(),
        category: category,
        imageUrl: imageUrl,
        location: finalLocation,
        createdAt: serverTimestamp(),
      });
      
      setContent('');
      setImageFile(null);
      setLocation(null);
      setLocationStatus('');
      setManualLocation('');
      if(document.getElementById('fileInput')) {
        document.getElementById('fileInput').value = '';
      }
    } catch (err) {
      console.error('Error creating post: ', err);
      setError('Failed to create post. Please try again.');
    } finally {
      setIsUploading(false);
      setLocationStatus('');
    }
  };

  return (
    <form className="post-form">
      {error && <p className="error-message">{error}</p>}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's happening in your area?"
        rows="3"
        disabled={isUploading}
      ></textarea>
      <div className="form-footer">
        <div className="form-attachments">
          <input type="file" id="fileInput" onChange={handleImageChange} accept="image/*" disabled={isUploading} />
          <input
            type="text"
            className="location-input"
            placeholder="Or type area name..."
            value={manualLocation}
            onChange={(e) => setManualLocation(e.target.value)}
            disabled={isUploading}
          />
          <button type="button" onClick={handleGetLocation} className="location-btn" disabled={isUploading}>
            📍Location
          </button>
        </div>
        <div className="form-actions">
          <button type="submit" onClick={(e) => handleSubmit(e, 'Alert')} className="btn alert" disabled={!content.trim() || isUploading}>
            {isUploading ? 'Posting...' : 'Post Alert'}
          </button>
          <button type="submit" onClick={(e) => handleSubmit(e, 'Request')} className="btn request" disabled={!content.trim() || isUploading}>
            {isUploading ? 'Posting...' : 'Post Request'}
          </button>
          <button type="submit" onClick={(e) => handleSubmit(e, 'Offer')} className="btn offer" disabled={!content.trim() || isUploading}>
            {isUploading ? 'Posting...' : 'Post Offer'}
          </button>
        </div>
      </div>
      {locationStatus && <p className="location-status">{locationStatus}</p>}
    </form>
  );
};

export default PostForm;


// src/components/MapView.jsx

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { db } from '../firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import L from 'leaflet'; // Import the main Leaflet library

// Define a new custom red icon using a reliable URL
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const MapView = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'posts'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsData = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.location && data.location.lat && data.location.lon) {
          postsData.push({ ...data, id: doc.id });
        }
      });
      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const hyderabadPosition = [17.3850, 78.4867];

  if (loading) {
    return <p>Loading map and posts...</p>;
  }

  return (
    <div className="map-page-container">
      <div className="map-description">
        <h3>Live Community Reports</h3>
        <p>This map shows real-time alerts, requests, and offers from your community. Click a pin to see the details.</p>
      </div>
      <MapContainer center={hyderabadPosition} zoom={12} className="map-container">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {posts.map(post => (
          // Use the new redIcon for the Marker
          <Marker key={post.id} position={[post.location.lat, post.location.lon]} icon={redIcon}>
            <Popup>
              <div className="map-popup">
                <h4>{post.category}: {post.location.name}</h4>
                <p>{post.content}</p>
                {post.imageUrl && <img src={post.imageUrl} alt="Post" />}
                <small>By: {post.authorName}</small>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;


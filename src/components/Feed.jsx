// src/components/Feed.jsx

import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper function to format the timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate();
    const now = new Date();
    const diffSeconds = Math.round((now - date) / 1000);

    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    const diffMinutes = Math.round(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const timeFormat = { hour: 'numeric', minute: 'numeric' };
    const dateFormat = { month: 'short', day: 'numeric' };

    return `${date.toLocaleDateString([], dateFormat)} at ${date.toLocaleTimeString([], timeFormat)}`;
  };

  useEffect(() => {
    // --- UPDATED: Calculate the timestamp from exactly 24 hours ago ---
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // --- UPDATED: Query for posts created in the last 24 hours ---
    const q = query(
      collection(db, 'posts'),
      where('createdAt', '>=', twentyFourHoursAgo),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsData = [];
      querySnapshot.forEach((doc) => {
        postsData.push({ ...doc.data(), id: doc.id });
      });
      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getCategoryClass = (category) => {
    switch (category) {
      case 'Alert': return 'category-alert';
      case 'Request': return 'category-request';
      case 'Offer': return 'category-offer';
      default: return '';
    }
  };

  if (loading) {
    return <div className="loading-spinner"></div>;
  }

  return (
    <div className="feed-container">
      {posts.length === 0 ? (
        <div className="empty-feed-message">
          <h3>No community posts in the last 24 hours.</h3>
          <p>Be the first to share an update!</p>
        </div>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <img src={post.authorPhotoURL} alt={post.authorName} className="profile-pic-small" />
              <div className="author-details">
                <span className="author-name">{post.authorName}</span>
                <span className="post-timestamp">{formatTimestamp(post.createdAt)}</span>
              </div>
            </div>
            {post.imageUrl && (
              <img src={post.imageUrl} alt="User upload" className="post-image" />
            )}
            <p className="post-content">{post.content}</p>
            <div className="post-footer">
              <div className={`post-category ${getCategoryClass(post.category)}`}>
                {post.category}
              </div>
              {post.location && (
                <div className="location-display">
                  <span className="location-icon">📍</span>
                  <span className="location-name">{post.location.name}</span>
                  {post.location.lat && post.location.lon && (
                    <a href={`https://www.google.com/maps?q=${post.location.lat},${post.location.lon}`} target="_blank" rel="noopener noreferrer" className="location-link">
                       (View on Map)
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Feed;


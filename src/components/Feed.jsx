// src/components/Feed.jsx

import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, where, Timestamp } from 'firebase/firestore';

const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  const date = timestamp.toDate();
  const now = new Date();
  
  const isToday = date.getDate() === now.getDate() &&
                  date.getMonth() === now.getMonth() &&
                  date.getFullYear() === now.getFullYear();

  if (isToday) {
    return `Today at ${date.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
  } else {
    return date.toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }
};

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // --- UPDATED LOGIC TO SHOW TODAY'S POSTS ONLY ---

    // 1. Get the start of the current day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfToday = Timestamp.fromDate(today);

    // 2. Create a query that filters posts created after the start of today
    const q = query(
      collection(db, 'posts'), 
      where('createdAt', '>=', startOfToday),
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
    return <p>Loading today's posts...</p>;
  }

  return (
    <div className="feed-container">
      {posts.length === 0 ? (
        <div className="post-card">
          <p>No posts yet for today. Be the first to share an update!</p>
        </div>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <img src={post.authorPhotoURL} alt={post.authorName} className="profile-pic-small" />
              <div className="author-details">
                <span className="author-name">{post.authorName}</span>
                <span className="post-timestamp">&nbsp;·&nbsp;{formatTimestamp(post.createdAt)}</span>
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
                    <>&nbsp;
                      <a href={`https://www.google.com/maps?q=${post.location.lat},${post.location.lon}`} target="_blank" rel="noopener noreferrer" className="location-link">
                        (View on Map)
                      </a>
                    </>
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


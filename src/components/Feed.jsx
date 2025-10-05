// src/components/Feed.jsx

import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

const Feed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    
    // onSnapshot sets up a real-time listener
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsData = [];
      querySnapshot.forEach((doc) => {
        postsData.push({ ...doc.data(), id: doc.id });
      });
      setPosts(postsData);
    });

    // Cleanup the listener when the component unmounts
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

  return (
    <div className="feed-container">
      {posts.map((post) => (
        <div key={post.id} className="post-card">
<div className="post-header">
    <img src={post.authorPhotoURL} alt={post.authorName} className="profile-pic-small" />
    <span className="author-name">{post.authorName}</span>
  </div>

  {post.imageUrl && (
    <img src={post.imageUrl} alt="User upload" className="post-image" />
  )}

  <p className="post-content">{post.content}</p>





<div className="post-footer">
  <div className={`post-category ${getCategoryClass(post.category)}`}>
    {post.category}
  </div>
  
  {/* --- Updated Location Display --- */}
  {post.location && (
    <div className="location-display">
      <span className="location-name">{post.location.name}</span>
      {/* Only show map link if lat/lon exist */}
      {post.location.lat && post.location.lon && (
        <a 
          href={`https://www.google.com/maps?q=${post.location.lat},${post.location.lon}`}
          target="_blank" 
          rel="noopener noreferrer"
          className="location-link"
        >
          (View on Map)
        </a>
      )}
    </div>
  )}
</div>
        </div>
      ))}
    </div>
  );
};

export default Feed;
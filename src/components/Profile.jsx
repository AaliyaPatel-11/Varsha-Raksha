// src/components/Profile.jsx

import { useState, useEffect } from 'react';
import { db, auth, storage } from '../firebase';
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import EditPost from './EditPost'; // Import the EditPost component

const Profile = () => {
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State to manage which post is being edited
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'posts'),
      where('authorId', '==', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsData = [];
      querySnapshot.forEach((doc) => {
        postsData.push({ ...doc.data(), id: doc.id });
      });
      postsData.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
      setMyPosts(postsData);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching user posts:", err);
      setError("Failed to load your posts.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (postId, imageUrl) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      if (imageUrl) {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      }
      
      const postRef = doc(db, 'posts', postId);
      await deleteDoc(postRef);

    } catch (err) { // CORRECTED: Added opening curly brace
      console.error("Error deleting post:", err);
      alert("Failed to delete post. Please try again.");
    }
  };

  if (loading) return <p>Loading your posts...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="page-container">
      <h2>My Posts</h2>
      {myPosts.length === 0 ? (
        <p>You haven't made any posts yet.</p>
      ) : (
        <div className="feed-container">
          {myPosts.map((post) => (
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
                <div className={`post-category`}>{post.category}</div>
                {post.location && (
                  <div className="location-display">
                    <span className="location-name">{post.location.name}</span>
                    {post.location.lat && post.location.lon && (
                       <a href={`https://www.google.com/maps?q=${post.location.lat},${post.location.lon}`} target="_blank" rel="noopener noreferrer" className="location-link">
                         (View on Map)
                       </a>
                    )}
                  </div>
                )}
              </div>
              <div className="post-actions">
                <button onClick={() => setEditingPost(post)} className="edit-btn">
                  Edit
                </button>
                <button onClick={() => handleDelete(post.id, post.imageUrl)} className="delete-btn">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {editingPost && (
        <EditPost 
          post={editingPost} 
          onClose={() => setEditingPost(null)} 
        />
      )}
    </div>
  );
};

export default Profile;


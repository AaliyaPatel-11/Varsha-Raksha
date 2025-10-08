// src/components/Profile.jsx

import { useState, useEffect } from 'react';
import { db, auth, storage } from '../firebase';
import { collection, query, where, onSnapshot, deleteDoc, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import EditPost from './EditPost';

const Profile = () => {
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [responseTexts, setResponseTexts] = useState({});

  const handleVote = async (post, voteType) => {
    const userId = auth.currentUser.uid;
    const postRef = doc(db, 'posts', post.id);
    const likes = post.likes || [];
    const disagrees = post.disagrees || [];
    const userHasLiked = likes.includes(userId);
    const userHasDisagreed = disagrees.includes(userId);

    const updatePayload = {};

    if (voteType === 'agree') {
      updatePayload.likes = userHasLiked ? arrayRemove(userId) : arrayUnion(userId);
      if (!userHasLiked && userHasDisagreed) {
        updatePayload.disagrees = arrayRemove(userId);
      }
    } else if (voteType === 'disagree') {
      updatePayload.disagrees = userHasDisagreed ? arrayRemove(userId) : arrayUnion(userId);
      if (!userHasDisagreed && userHasLiked) {
        updatePayload.likes = arrayRemove(userId);
      }
    }
    await updateDoc(postRef, updatePayload);
  };

  const handleAddResponse = async (e, postId) => {
    e.preventDefault();
    const responseText = responseTexts[postId]?.trim();
    if (!responseText) return;
    const { uid, displayName } = auth.currentUser;
    const postRef = doc(db, 'posts', postId);
    const newResponse = {
      responderId: uid,
      responderName: displayName,
      text: responseText,
      createdAt: new Date(),
    };
    await updateDoc(postRef, { responses: arrayUnion(newResponse) });
    setResponseTexts(prev => ({ ...prev, [postId]: '' }));
  };
  
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    const timeFormat = { hour: 'numeric', minute: 'numeric' };
    const dateFormat = { year: 'numeric', month: 'short', day: 'numeric' };
    return `${date.toLocaleDateString([], dateFormat)} at ${date.toLocaleTimeString([], timeFormat)}`;
  };
  
  const handleDelete = async (postId, imageUrl) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      if (imageUrl) {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      }
      await deleteDoc(doc(db, 'posts', postId));
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete post.");
    }
  };
  
  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    };

    const q = query(
      collection(db, 'posts'), 
      where('authorId', '==', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsData = [];
      querySnapshot.forEach((doc) => postsData.push({ ...doc.data(), id: doc.id }));
      postsData.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
      setMyPosts(postsData);
      setLoading(false);
    }, (err) => {
      console.error("Firestore error:", err);
      setError("Failed to load your posts. Please check your connection or try again.");
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth.currentUser]);

  if (loading) return <div className="loading-spinner"></div>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="page-container">
      <h2>My Posts</h2>
      {myPosts.length === 0 ? (
        <p>You haven't made any posts yet.</p>
      ) : (
        <div className="feed-container">
          {myPosts.map((post) => {
            const userId = auth.currentUser.uid;
            const userHasLiked = post.likes?.includes(userId);
            const userHasDisagreed = post.disagrees?.includes(userId);

            return (
              <div key={post.id} className="post-card">
                <div className="post-header">
                  <img src={post.authorPhotoURL} alt={post.authorName} className="profile-pic-small" />
                  <div className="author-details">
                    <span className="author-name">{post.authorName}</span>
                    <span className="post-timestamp">{formatTimestamp(post.createdAt)}</span>
                  </div>
                </div>
                {post.imageUrl && <img src={post.imageUrl} alt="User upload" className="post-image" />}
                <p className="post-content">{post.content}</p>
                <div className="post-footer">
                   <div className={`post-category ${post.category?.toLowerCase()}`}>{post.category}</div>
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
                <div className="post-actions">
                  <button onClick={() => setEditingPost(post)} className="edit-btn">Edit</button>
                  <button onClick={() => handleDelete(post.id, post.imageUrl)} className="delete-btn">Delete</button>
                </div>

                <div className="interactive-section">
                  {post.category === 'Alert' && (
                    <div className="likes-section">
                      <button onClick={() => handleVote(post, 'agree')} className={`like-btn ${userHasLiked ? 'liked' : ''}`}>👍 Agree</button>
                      <span className="like-count">{post.likes?.length || 0}</span>
                      <button onClick={() => handleVote(post, 'disagree')} className={`disagree-btn ${userHasDisagreed ? 'disagreed' : ''}`}>👎 Disagree</button>
                      <span className="disagree-count">{post.disagrees?.length || 0}</span>
                    </div>
                  )}

                  <div className="responses-section">
                    <h4>Responses</h4>
                    <div className="response-list">
                      {post.responses?.length > 0 ? (
                        post.responses.map((res, index) => (
                          <div key={index} className="response-item"><strong>{res.responderName}:</strong> {res.text}</div>
                        ))
                      ) : (
                        <p className="no-responses">No responses yet.</p>
                      )}
                    </div>
                    <form onSubmit={(e) => handleAddResponse(e, post.id)} className="response-form">
                      <input type="text" placeholder="Write a response..." value={responseTexts[post.id] || ''} onChange={(e) => setResponseTexts(prev => ({ ...prev, [post.id]: e.target.value }))} />
                      <button type="submit">Reply</button>
                    </form>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {editingPost && <EditPost post={editingPost} onClose={() => setEditingPost(null)} />}
    </div>
  );
};

export default Profile;


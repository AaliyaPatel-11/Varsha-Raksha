// src/components/Feed.jsx

import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot, orderBy, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
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
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const q = query(collection(db, 'posts'), where('createdAt', '>=', twentyFourHoursAgo), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsData = [];
      querySnapshot.forEach((doc) => postsData.push({ ...doc.data(), id: doc.id }));
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

  if (loading) return <div className="loading-spinner"></div>;

  return (
    <div className="feed-container">
      {posts.length === 0 ? (
        <div className="empty-feed-message">
          <h3>No community posts in the last 24 hours.</h3>
          <p>Be the first to share an update!</p>
        </div>
      ) : (
        posts.map((post) => {
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

              <div className="interactive-section">
                {post.category === 'Alert' && (
                  <div className="likes-section">
                    <button onClick={() => handleVote(post, 'agree')} className={`like-btn ${userHasLiked ? 'liked' : ''}`}>
                      👍 Agree
                    </button>
                    <span className="like-count">{post.likes?.length || 0}</span>
                     <button onClick={() => handleVote(post, 'disagree')} className={`disagree-btn ${userHasDisagreed ? 'disagreed' : ''}`}>
                      👎 Disagree
                    </button>
                    <span className="disagree-count">{post.disagrees?.length || 0}</span>
                  </div>
                )}

                {(post.category === 'Request' || post.category === 'Offer') && (
                  <div className="responses-section">
                    <h4>Responses</h4>
                    <div className="response-list">
                      {post.responses?.length > 0 ? (
                        post.responses.map((res, index) => (
                          <div key={index} className="response-item">
                            <strong>{res.responderName}:</strong> {res.text}
                          </div>
                        ))
                      ) : (
                        <p className="no-responses">No responses yet.</p>
                      )}
                    </div>
                    <form onSubmit={(e) => handleAddResponse(e, post.id)} className="response-form">
                      <input
                        type="text"
                        placeholder="Write a response..."
                        value={responseTexts[post.id] || ''}
                        onChange={(e) => setResponseTexts(prev => ({ ...prev, [post.id]: e.target.value }))}
                      />
                      <button type="submit">Reply</button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Feed;


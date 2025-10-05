// src/components/EditPost.jsx

import { useState } from 'react';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

const EditPost = ({ post, onClose }) => {
  // State to hold the text being edited, initialized with the current post content
  const [editedContent, setEditedContent] = useState(post.content);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editedContent.trim()) {
      alert("Post content cannot be empty.");
      return;
    }
    
    setIsSaving(true);
    const postRef = doc(db, 'posts', post.id);

    try {
      // Update only the 'content' field in the Firestore document
      await updateDoc(postRef, {
        content: editedContent.trim(),
      });
      onClose(); // Close the modal on successful save
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Edit Post</h3>
        <form onSubmit={handleSave}>
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            rows="5"
          />
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="save-btn" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;

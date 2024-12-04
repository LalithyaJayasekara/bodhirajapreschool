import React, { useState } from 'react';
import './Feedback.css';
import { db } from '../../firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';


const FeedbackForm = () => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRating = (rate) => {
    setRating(rate);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      await addDoc(collection(db, 'feedback'), {
        rating,
        feedback,
        
      });

      setRating(0);
      setFeedback('');
     
      console.log('Feedback submitted successfully!');

    } catch (error) {
      console.error('Error submitting feedback:', error);
      console.log('Error submitting feedback. Please try again.');
    }
  };
  return (
    <div className="feedback-form-container">
      <h2>ADD YOUR FEEDBACK</h2>
      <form onSubmit={handleSubmit}>
        <div className="rating-section">
          <p>Rate Us!</p>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={star <= rating ? 'filled' : ''}
                onClick={() => handleRating(star)}
                required
              >
                ★
              </span>
            ))}
          </div>
        </div>
        <div className="feedback-section">
          <p>What can be improved?</p>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Provide your comments and suggestions here"
            required
          ></textarea>
        </div>
        
        
        <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
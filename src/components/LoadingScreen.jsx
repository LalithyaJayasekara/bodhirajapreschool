import React from 'react';
import './LoadingScreen.css'; // Add styles here or use inline styles
import loadingImage from '../Assets/Logo.png'; // Replace with your image path

const LoadingScreen = () => {
  return (
    <div className="loading-container">
      <img src={loadingImage} alt="Loading" className="loading-image" />
      <h1 className="loading-text">Loading...</h1>
      <div className="loading-animation"></div>
    </div>
  );
};

export default LoadingScreen;

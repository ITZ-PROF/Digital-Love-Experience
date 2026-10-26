import React from 'react';
import { useNavigate } from 'react-router-dom';
import './form.css';

export default function Form() {
  const navigate = useNavigate();

  return (
    <div className="dev-page-container" role="main">
      <div className="dev-card">
        {/* Animated Construction Icon / Graphic */}
        <div className="dev-icon-wrapper">
          <svg 
            xmlns="http://w3.org" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="dev-svg-icon"
          >
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
          <div className="dev-pulse-ring"></div>
        </div>

        {/* Content Section */}
        <h1 className="dev-title">Form Under Construction</h1>
        <p className="dev-subtitle">
          We are currently building this experience room configuration panel. This feature will be live very soon!
        </p>

        {/* Progress Bar Visual Element */}
        <div className="dev-progress-track">
          <div className="dev-progress-fill"></div>
        </div>
        <span className="dev-progress-text">Development Progress: 75%</span>

        {/* Interactive Navigation Action */}
        <button className="dev-back-btn" onClick={() => navigate('/')}>
          <svg 
            xmlns="http://w3.org" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="btn-arrow-icon"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Go Back
        </button>
      </div>
    </div>
  );
}

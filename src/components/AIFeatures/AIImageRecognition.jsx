import React, { useState, useRef } from 'react';
import './AIImageRecognition.css';

const AIImageRecognition = ({ onItemIdentified }) => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [similarItems, setSimilarItems] = useState([]);
  const fileInputRef = useRef(null);

  const sampleSimilarItems = [
    {
      id: 1,
      name: 'iPhone 13 Pro',
      similarity: 92,
      image: '📱',
      type: 'found',
      location: 'Central Park',
      date: '2 hours ago'
    },
    {
      id: 2,
      name: 'Smartphone',
      similarity: 78,
      image: '📱',
      type: 'lost',
      location: 'Downtown',
      date: '1 day ago'
    }
  ];

  const handleImageUpload = async (file) => {
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);
    setIsAnalyzing(true);

    // Simulate AI analysis
    setTimeout(() => {
      const results = {
        category: 'Electronics',
        itemType: 'Smartphone',
        brand: 'Apple',
        model: 'iPhone 13 Pro',
        color: 'Silver',
        confidence: 87,
        features: ['Camera', 'Screen', 'Buttons']
      };
      setAnalysisResults(results);
      setSimilarItems(sampleSimilarItems);
      setIsAnalyzing(false);

      if (onItemIdentified) {
        onItemIdentified(results);
      }
    }, 2000);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="ai-image-recognition">
      <div className="ai-header">
        <h3>🔍 AI Image Recognition</h3>
        <p>Upload a photo to automatically identify your item and find matches</p>
      </div>

      <div className="upload-section">
        <div 
          className={`upload-area ${isAnalyzing ? 'analyzing' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e.target.files[0])}
            className="file-input"
          />
          
          {isAnalyzing ? (
            <div className="analyzing-state">
              <div className="ai-spinner"></div>
              <p>AI is analyzing your image...</p>
            </div>
          ) : uploadedImage ? (
            <div className="image-preview">
              <img src={uploadedImage} alt="Uploaded" />
              <div className="preview-overlay">
                <span>🔄 Click to change</span>
              </div>
            </div>
          ) : (
            <div className="upload-placeholder">
              <div className="upload-icon">📸</div>
              <p>Drag & drop an image or click to upload</p>
              <span className="upload-hint">Supports JPG, PNG, WEBP (Max 5MB)</span>
            </div>
          )}
        </div>
      </div>

      {analysisResults && (
        <div className="analysis-results">
          <h4>AI Analysis Results</h4>
          <div className="results-grid">
            <div className="result-item">
              <span className="result-label">Category</span>
              <span className="result-value">{analysisResults.category}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Item Type</span>
              <span className="result-value">{analysisResults.itemType}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Brand</span>
              <span className="result-value">{analysisResults.brand}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Model</span>
              <span className="result-value">{analysisResults.model}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Color</span>
              <span className="result-value">{analysisResults.color}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Confidence</span>
              <span className="result-value confidence">
                {analysisResults.confidence}%
              </span>
            </div>
          </div>

          <div className="identified-features">
            <h5>Identified Features</h5>
            <div className="features-list">
              {analysisResults.features.map((feature, index) => (
                <span key={index} className="feature-tag">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {similarItems.length > 0 && (
        <div className="similar-items">
          <h4>Potential Matches ({similarItems.length})</h4>
          <div className="similar-items-list">
            {similarItems.map(item => (
              <div key={item.id} className="similar-item-card">
                <div className="item-image">{item.image}</div>
                <div className="item-details">
                  <h5>{item.name}</h5>
                  <div className="similarity-score">
                    <div 
                      className="similarity-bar"
                      style={{ width: `${item.similarity}%` }}
                    ></div>
                    <span>{item.similarity}% match</span>
                  </div>
                  <div className="item-meta">
                    <span className={`type-badge ${item.type}`}>
                      {item.type}
                    </span>
                    <span className="location">📍 {item.location}</span>
                    <span className="date">🕒 {item.date}</span>
                  </div>
                </div>
                <button className="view-match-btn">
                  View Match
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="ai-tips">
        <h5>💡 Tips for Better Recognition</h5>
        <ul>
          <li>Use clear, well-lit photos</li>
          <li>Capture the item from multiple angles</li>
          <li>Include any distinctive features or damage</li>
          <li>Ensure the item fills most of the frame</li>
        </ul>
      </div>
    </div>
  );
};

export default AIImageRecognition;
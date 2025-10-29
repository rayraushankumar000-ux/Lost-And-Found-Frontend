import React, { useState, useRef, useEffect } from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import './ARItemScanner.css';

const ARItemScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [cameraAccess, setCameraAccess] = useState(false);
  const [detectedItems, setDetectedItems] = useState([]);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { addNotification } = useNotification();

  // Sample AR detection results
  const sampleDetections = [
    {
      id: 1,
      type: 'phone',
      name: 'Smartphone',
      confidence: 92,
      boundingBox: { x: 100, y: 150, width: 120, height: 200 },
      color: '#3b82f6'
    },
    {
      id: 2,
      type: 'wallet',
      name: 'Wallet',
      confidence: 87,
      boundingBox: { x: 300, y: 200, width: 150, height: 100 },
      color: '#f59e0b'
    },
    {
      id: 3,
      type: 'keys',
      name: 'Keys',
      confidence: 78,
      boundingBox: { x: 200, y: 100, width: 80, height: 40 },
      color: '#10b981'
    }
  ];

  useEffect(() => {
    checkCameraAccess();
    return () => {
      stopScanner();
    };
  }, []);

  const checkCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setCameraAccess(true);
    } catch (error) {
      console.error('Camera access denied:', error);
      setCameraAccess(false);
    }
  };

  const startScanner = async () => {
    if (!cameraAccess) {
      addNotification({
        title: 'Camera Access Required',
        message: 'Please allow camera access to use AR scanning',
        type: 'error'
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      setIsScanning(true);
      startObjectDetection();
      
      addNotification({
        title: 'AR Scanner Active',
        message: 'Point your camera at items to identify them'
      });
    } catch (error) {
      console.error('Error starting scanner:', error);
      addNotification({
        title: 'Scanner Error',
        message: 'Failed to start camera',
        type: 'error'
      });
    }
  };

  const stopScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
    setDetectedItems([]);
  };

  const startObjectDetection = () => {
    // Simulate object detection (in real app, use TensorFlow.js or similar)
    const detectionInterval = setInterval(() => {
      if (!isScanning) {
        clearInterval(detectionInterval);
        return;
      }
      
      // Simulate random detections
      if (Math.random() < 0.3) { // 30% chance per interval
        const randomItem = sampleDetections[
          Math.floor(Math.random() * sampleDetections.length)
        ];
        
        setDetectedItems(prev => {
          const exists = prev.find(item => item.id === randomItem.id);
          if (!exists) {
            return [...prev, { ...randomItem, timestamp: Date.now() }];
          }
          return prev;
        });
        
        drawBoundingBoxes();
      }
    }, 1000);
  };

  const drawBoundingBoxes = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (!canvas || !video) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    detectedItems.forEach(item => {
      const { x, y, width, height } = item.boundingBox;
      
      // Draw bounding box
      ctx.strokeStyle = item.color;
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, width, height);
      
      // Draw label background
      ctx.fillStyle = item.color;
      ctx.fillRect(x, y - 25, 120, 25);
      
      // Draw label text
      ctx.fillStyle = 'white';
      ctx.font = '14px Arial';
      ctx.fillText(`${item.name} ${item.confidence}%`, x + 5, y - 8);
      
      // Draw corner markers
      const cornerSize = 8;
      ctx.fillStyle = item.color;
      
      // Top-left
      ctx.fillRect(x - cornerSize/2, y - cornerSize/2, cornerSize, cornerSize);
      // Top-right
      ctx.fillRect(x + width - cornerSize/2, y - cornerSize/2, cornerSize, cornerSize);
      // Bottom-left
      ctx.fillRect(x - cornerSize/2, y + height - cornerSize/2, cornerSize, cornerSize);
      // Bottom-right
      ctx.fillRect(x + width - cornerSize/2, y + height - cornerSize/2, cornerSize, cornerSize);
    });
  };

  const handleItemSelect = (item) => {
    setScanResult(item);
    addNotification({
      title: 'Item Identified',
      message: `Detected: ${item.name} with ${item.confidence}% confidence`
    });
  };

  const reportDetectedItem = (item) => {
    addNotification({
      title: 'Item Reported',
      message: `Reporting ${item.name} as found item`
    });
    // In real app, navigate to report form with pre-filled data
  };

  if (!cameraAccess) {
    return (
      <div className="ar-scanner">
        <div className="camera-permission">
          <div className="permission-icon">📷</div>
          <h3>Camera Access Required</h3>
          <p>AR scanning requires camera access to identify items</p>
          <button className="btn btn-primary" onClick={checkCameraAccess}>
            Request Camera Access
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ar-scanner">
      <div className="scanner-header">
        <h2>🕶️ AR Item Scanner</h2>
        <p>Use your camera to identify and report lost/found items</p>
      </div>

      {/* Scanner Controls */}
      <div className="scanner-controls">
        {!isScanning ? (
          <button className="btn btn-primary scan-btn" onClick={startScanner}>
            🎥 Start AR Scanner
          </button>
        ) : (
          <button className="btn btn-danger scan-btn" onClick={stopScanner}>
            ⏹️ Stop Scanner
          </button>
        )}
        
        <div className="scanner-stats">
          <span className="stat">
            📱 {detectedItems.length} Items Detected
          </span>
          <span className="stat">
            🎯 Real-time Analysis
          </span>
        </div>
      </div>

      {/* Camera Feed */}
      {isScanning && (
        <div className="camera-feed">
          <video
            ref={videoRef}
            className="camera-video"
            autoPlay
            playsInline
            muted
          />
          <canvas
            ref={canvasRef}
            className="ar-overlay"
            width="640"
            height="480"
          />
          
          {/* Scanning Instructions */}
          <div className="scanning-instructions">
            <div className="instruction-item">
              <span className="instruction-icon">📱</span>
              <span>Point camera at items</span>
            </div>
            <div className="instruction-item">
              <span className="instruction-icon">⚡</span>
              <span>Automatic detection</span>
            </div>
            <div className="instruction-item">
              <span className="instruction-icon">👆</span>
              <span>Tap items to report</span>
            </div>
          </div>
        </div>
      )}

      {/* Detected Items Panel */}
      {detectedItems.length > 0 && (
        <div className="detected-items">
          <h4>Detected Items</h4>
          <div className="items-grid">
            {detectedItems.map(item => (
              <div
                key={item.id}
                className="detected-item-card"
                onClick={() => handleItemSelect(item)}
              >
                <div 
                  className="item-color-indicator"
                  style={{ backgroundColor: item.color }}
                ></div>
                <div className="item-icon">
                  {item.type === 'phone' && '📱'}
                  {item.type === 'wallet' && '👛'}
                  {item.type === 'keys' && '🔑'}
                </div>
                <div className="item-info">
                  <div className="item-name">{item.name}</div>
                  <div className="item-confidence">
                    {item.confidence}% confidence
                  </div>
                </div>
                <div className="item-actions">
                  <button 
                    className="btn btn-primary btn-small"
                    onClick={(e) => {
                      e.stopPropagation();
                      reportDetectedItem(item);
                    }}
                  >
                    Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scan Result Details */}
      {scanResult && (
        <div className="scan-result">
          <h4>Item Identified</h4>
          <div className="result-card">
            <div className="result-header">
              <div className="result-icon">
                {scanResult.type === 'phone' && '📱'}
                {scanResult.type === 'wallet' && '👛'}
                {scanResult.type === 'keys' && '🔑'}
              </div>
              <div className="result-info">
                <div className="result-name">{scanResult.name}</div>
                <div className="result-confidence">
                  Confidence: {scanResult.confidence}%
                </div>
              </div>
            </div>
            
            <div className="result-actions">
              <button className="btn btn-primary">
                📝 Report as Found
              </button>
              <button className="btn btn-outline">
                🔍 Search Similar Items
              </button>
              <button 
                className="btn btn-outline"
                onClick={() => setScanResult(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AR Features Info */}
      <div className="ar-features">
        <h4>🚀 AR Scanner Features</h4>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <div className="feature-content">
              <h5>Real-time Detection</h5>
              <p>Instantly identify common lost items using AI</p>
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <div className="feature-content">
              <h5>Smart Analysis</h5>
              <p>Get confidence scores and detailed item information</p>
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <div className="feature-content">
              <h5>Quick Reporting</h5>
              <p>One-tap reporting with auto-filled item details</p>
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <div className="feature-content">
              <h5>Location Aware</h5>
              <p>Automatically capture location data for accurate reporting</p>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Tips */}
      <div className="scanner-tips">
        <h5>💡 Tips for Better Scanning</h5>
        <ul>
          <li>Ensure good lighting for accurate detection</li>
          <li>Hold camera steady and focus on one item at a time</li>
          <li>Scan from multiple angles for complex items</li>
          <li>Keep items in focus and avoid motion blur</li>
        </ul>
      </div>
    </div>
  );
};

export default ARItemScanner;
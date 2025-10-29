import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './VerificationSystem.css';

const VerificationSystem = () => {
  const { user, updateUser } = useAuth();
  const [verificationStep, setVerificationStep] = useState(1);
  const [verificationData, setVerificationData] = useState({
    idType: '',
    idNumber: '',
    idFront: null,
    idBack: null,
    selfie: null
  });

  const idTypes = ['Driving License', 'Passport', 'National ID', 'Student ID'];

  const handleFileUpload = (field, file) => {
    setVerificationData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const handleNextStep = () => {
    setVerificationStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setVerificationStep(prev => prev - 1);
  };

  const handleSubmitVerification = async () => {
    // Simulate verification process
    setTimeout(() => {
      updateUser({ verified: true });
      alert('Verification submitted successfully! We will review your documents.');
    }, 1000);
  };

  if (user?.verified) {
    return (
      <div className="verification-status verified">
        <div className="status-icon">✅</div>
        <div className="status-content">
          <h3>Identity Verified</h3>
          <p>Your identity has been successfully verified.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="verification-system">
      <div className="verification-header">
        <h2>Identity Verification</h2>
        <p>Verify your identity to access all features and build trust within the community.</p>
      </div>

      <div className="verification-progress">
        <div className="progress-steps">
          {[1, 2, 3].map(step => (
            <div key={step} className={`step ${step === verificationStep ? 'active' : ''} ${step < verificationStep ? 'completed' : ''}`}>
              <div className="step-number">{step}</div>
              <div className="step-label">
                {step === 1 && 'ID Type'}
                {step === 2 && 'Upload Documents'}
                {step === 3 && 'Selfie Verification'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="verification-content">
        {verificationStep === 1 && (
          <div className="verification-step">
            <h3>Select ID Type</h3>
            <div className="id-type-options">
              {idTypes.map(type => (
                <label key={type} className="id-type-option">
                  <input
                    type="radio"
                    name="idType"
                    value={type}
                    checked={verificationData.idType === type}
                    onChange={(e) => setVerificationData(prev => ({ ...prev, idType: e.target.value }))}
                  />
                  <span className="radio-custom"></span>
                  <span className="id-type-label">{type}</span>
                </label>
              ))}
            </div>
            <button 
              className="btn btn-primary"
              onClick={handleNextStep}
              disabled={!verificationData.idType}
            >
              Continue
            </button>
          </div>
        )}

        {verificationStep === 2 && (
          <div className="verification-step">
            <h3>Upload ID Documents</h3>
            <div className="upload-sections">
              <div className="upload-section">
                <label className="upload-label">Front of ID</label>
                <div className="upload-area">
                  {verificationData.idFront ? (
                    <div className="upload-preview">
                      <span>✅ Document uploaded</span>
                      <button 
                        onClick={() => handleFileUpload('idFront', null)}
                        className="remove-upload"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload('idFront', e.target.files[0])}
                        className="file-input"
                      />
                      <div className="upload-placeholder">
                        <span className="upload-icon">📄</span>
                        <p>Click to upload front side</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="upload-section">
                <label className="upload-label">Back of ID</label>
                <div className="upload-area">
                  {verificationData.idBack ? (
                    <div className="upload-preview">
                      <span>✅ Document uploaded</span>
                      <button 
                        onClick={() => handleFileUpload('idBack', null)}
                        className="remove-upload"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload('idBack', e.target.files[0])}
                        className="file-input"
                      />
                      <div className="upload-placeholder">
                        <span className="upload-icon">📄</span>
                        <p>Click to upload back side</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="step-actions">
              <button className="btn btn-outline" onClick={handlePrevStep}>
                Back
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleNextStep}
                disabled={!verificationData.idFront || !verificationData.idBack}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {verificationStep === 3 && (
          <div className="verification-step">
            <h3>Selfie Verification</h3>
            <div className="selfie-instructions">
              <p>Please take a clear selfie showing your face and your ID card next to it.</p>
              <div className="selfie-example">
                <div className="example-placeholder">📸</div>
                <p>Example</p>
              </div>
            </div>

            <div className="upload-section">
              <div className="upload-area">
                {verificationData.selfie ? (
                  <div className="upload-preview">
                    <span>✅ Selfie uploaded</span>
                    <button 
                      onClick={() => handleFileUpload('selfie', null)}
                      className="remove-upload"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload('selfie', e.target.files[0])}
                      className="file-input"
                    />
                    <div className="upload-placeholder">
                      <span className="upload-icon">🤳</span>
                      <p>Take or upload selfie</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="step-actions">
              <button className="btn btn-outline" onClick={handlePrevStep}>
                Back
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleSubmitVerification}
                disabled={!verificationData.selfie}
              >
                Submit Verification
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationSystem;
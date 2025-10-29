import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../contexts/NotificationContext';
import './ReportFound.css';

const ReportFound = () => {
  const [formData, setFormData] = useState({
    itemName: '',
    category: '',
    description: '',
    locationFound: '',
    dateFound: '',
    timeFound: '',
    color: '',
    brand: '',
    model: '',
    distinctiveFeatures: '',
    storageLocation: '',
    contactPreference: 'email',
    images: []
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { addNotification } = useNotification();

  const categories = [
    'Electronics',
    'Documents',
    'Jewelry',
    'Clothing',
    'Bags & Wallets',
    'Keys',
    'Pets',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        images: Array.from(files)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleNextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      addNotification({
        title: 'Report Submitted',
        message: 'Thank you for reporting the found item!'
      });
      setLoading(false);
      navigate('/dashboard');
    }, 2000);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.itemName && formData.category && formData.description;
      case 2:
        return formData.locationFound && formData.dateFound;
      case 3:
        return true; // Optional fields
      default:
        return false;
    }
  };

  return (
    <div className="report-found">
      <div className="report-header">
        <h1>Report Found Item</h1>
        <p>Help reunite lost items with their owners by reporting what you found</p>
      </div>

      <div className="report-progress">
        <div className="progress-steps">
          {[1, 2, 3].map(step => (
            <div key={step} className={`step ${step === currentStep ? 'active' : ''} ${step < currentStep ? 'completed' : ''}`}>
              <div className="step-number">{step}</div>
              <div className="step-label">
                {step === 1 && 'Item Details'}
                {step === 2 && 'Location & Time'}
                {step === 3 && 'Additional Info'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="report-form">
        {currentStep === 1 && (
          <div className="form-step">
            <div className="form-group">
              <label className="form-label">Item Name *</label>
              <input
                type="text"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., iPhone 13, Wallet, Keys"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-input form-textarea"
                placeholder="Describe the item in detail..."
                rows="4"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Upload Images</label>
              <div className="upload-area">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleChange}
                  className="file-input"
                />
                <div className="upload-placeholder">
                  <span className="upload-icon">📷</span>
                  <p>Click to upload images</p>
                  <span className="upload-hint">Max 5 images, 5MB each</span>
                </div>
              </div>
              {formData.images.length > 0 && (
                <div className="upload-preview">
                  <span>{formData.images.length} image(s) selected</span>
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="form-step">
            <div className="form-group">
              <label className="form-label">Location Found *</label>
              <input
                type="text"
                name="locationFound"
                value={formData.locationFound}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., Central Park, Downtown Mall"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Date Found *</label>
                <input
                  type="date"
                  name="dateFound"
                  value={formData.dateFound}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Time Found</label>
                <input
                  type="time"
                  name="timeFound"
                  value={formData.timeFound}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Current Storage Location</label>
              <select
                name="storageLocation"
                value={formData.storageLocation}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">Select storage location</option>
                <option value="with-me">With me</option>
                <option value="police-station">Police Station</option>
                <option value="lost-found-office">Lost & Found Office</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="form-step">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Color</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., Black, Silver, Red"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., Apple, Samsung"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Model</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., iPhone 13 Pro, Galaxy S21"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Distinctive Features</label>
              <textarea
                name="distinctiveFeatures"
                value={formData.distinctiveFeatures}
                onChange={handleChange}
                className="form-input form-textarea"
                placeholder="Scratches, stickers, engravings, or other identifying marks..."
                rows="3"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Preference</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="contactPreference"
                    value="email"
                    checked={formData.contactPreference === 'email'}
                    onChange={handleChange}
                  />
                  <span className="radio-custom"></span>
                  Email
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="contactPreference"
                    value="phone"
                    checked={formData.contactPreference === 'phone'}
                    onChange={handleChange}
                  />
                  <span className="radio-custom"></span>
                  Phone
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="contactPreference"
                    value="both"
                    checked={formData.contactPreference === 'both'}
                    onChange={handleChange}
                  />
                  <span className="radio-custom"></span>
                  Both
                </label>
              </div>
            </div>
          </div>
        )}

        <div className="form-actions">
          {currentStep > 1 && (
            <button type="button" className="btn btn-outline" onClick={handlePrevStep}>
              Previous
            </button>
          )}
          
          {currentStep < 3 ? (
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={handleNextStep}
              disabled={!isStepValid()}
            >
              Next
            </button>
          ) : (
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Submitting...
                </>
              ) : (
                'Submit Report'
              )}
            </button>
          )}
        </div>
      </form>

      <div className="found-tips">
        <h3>Tips for Reporting Found Items</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <div className="tip-icon">🔒</div>
            <p>Keep valuable items secure until claimed</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">📞</div>
            <p>Be responsive to potential owners</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">🏢</div>
            <p>Consider turning in items to local authorities</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">✅</div>
            <p>Verify ownership before returning items</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportFound;
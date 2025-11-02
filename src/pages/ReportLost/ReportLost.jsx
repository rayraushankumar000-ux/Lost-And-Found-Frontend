import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../contexts/NotificationContext';
import { useAuth } from '../../contexts/AuthContext';
import { itemsAPI } from '../../services/api';
import './ReportLost.css';

const ReportLost = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    location: {
      address: '',
      city: '',
      state: ''
    },
    dateLostFound: '',
    features: {
      color: '',
      brand: '',
      model: ''
    },
    distinctiveFeatures: '',
    contactPreference: 'email',
    reward: {
      amount: 0
    }
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const { user } = useAuth();

  const categories = [
    'electronics',
    'documents', 
    'clothing',
    'jewelry',
    'bags',
    'keys',
    'pets',
    'other'
  ];

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      // Handle image selection
      if (files && files.length > 0) {
        const imageFiles = Array.from(files).slice(0, 5); // Limit to 5 images
        setSelectedImages(imageFiles);
        
        // Create preview URLs
        const previews = imageFiles.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
        
        console.log('Selected images:', imageFiles);
      }
    } else if (name.startsWith('location.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [field]: value
        }
      }));
    } else if (name.startsWith('features.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        features: {
          ...prev.features,
          [field]: value
        }
      }));
    } else if (name.startsWith('reward.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        reward: {
          ...prev.reward,
          [field]: value
        }
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
    
    if (!user) {
      addNotification({
        title: 'Authentication Required',
        message: 'Please log in to report a lost item.',
        type: 'error'
      });
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      console.log('🔄 Starting form submission...');
      console.log('📸 Selected images:', selectedImages);

      // Create FormData
      const formDataToSend = new FormData();
      
      // Append basic fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('dateLostFound', formData.dateLostFound);
      formDataToSend.append('status', 'lost'); // 'lost' or 'found'
      formDataToSend.append('contactPreference', formData.contactPreference);
      formDataToSend.append('distinctiveFeatures', formData.distinctiveFeatures || '');
      formDataToSend.append('rewardAmount', formData.reward.amount || 0);

      // Append location as individual fields
      formDataToSend.append('address', formData.location.address);
      formDataToSend.append('city', formData.location.city);
      formDataToSend.append('state', formData.location.state);

      // Append features as individual fields
      formDataToSend.append('color', formData.features.color || '');
      formDataToSend.append('brand', formData.features.brand || '');
      formDataToSend.append('model', formData.features.model || '');

      // Append first image (single image upload via 'image' field)
      if (selectedImages.length > 0) {
        formDataToSend.append('image', selectedImages[0]);
      }

      // Log FormData contents for debugging
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`📋 ${key}:`, value instanceof File ? `${value.name} (${value.size} bytes)` : value);
      }

      // Use itemsAPI from api.js (automatically handles auth token and Content-Type)
      const response = await itemsAPI.createItem(formDataToSend);
      
      console.log('✅ Success response:', response.data);

      addNotification({
        title: 'Success! 🎉',
        message: 'Your lost item has been reported successfully!'
      });
      
      // Reset form
      setFormData({
        title: '',
        category: '',
        description: '',
        location: { address: '', city: '', state: '' },
        dateLostFound: '',
        features: { color: '', brand: '', model: '' },
        distinctiveFeatures: '',
        contactPreference: 'email',
        reward: { amount: 0 }
      });
      setSelectedImages([]);
      setImagePreviews([]);
      
      navigate('/dashboard');

    } catch (error) {
      console.error('❌ Submission error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Please check your connection and try again.';
      addNotification({
        title: 'Submission Failed',
        message: errorMessage,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Clean up image preview URLs when component unmounts
  React.useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.title && formData.category && formData.description;
      case 2:
        return formData.location.address && formData.location.city && formData.location.state && formData.dateLostFound;
      case 3:
        return true; // Optional fields
      default:
        return false;
    }
  };

  return (
    <div className="report-lost">
      <div className="report-header">
        <h1>Report Lost Item</h1>
        <p>Fill in the details below to report your lost item</p>
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
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., iPhone 13, Wallet, Keys"
                required
                disabled={loading}
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
                disabled={loading}
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
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
                placeholder="Describe your item in detail..."
                rows="4"
                required
                disabled={loading}
              />
            </div>

            {/* Image Upload Section */}
            <div className="form-group">
              <label className="form-label">Upload Images (Optional)</label>
              <div className="upload-area">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleChange}
                  className="file-input"
                  disabled={loading}
                />
                <div className="upload-placeholder">
                  <span className="upload-icon">📷</span>
                  <p>Click to upload images</p>
                  <span className="upload-hint">Max 5 images, 5MB each</span>
                </div>
              </div>
              {selectedImages.length > 0 && (
                <div className="upload-preview">
                  <span>{selectedImages.length} image(s) selected</span>
                  <div className="image-previews">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="image-preview">
                        <img 
                          src={preview} 
                          alt={`Preview ${index + 1}`}
                          className="preview-image"
                        />
                        <span className="image-name">{selectedImages[index].name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="form-step">
            <div className="form-group">
              <label className="form-label">Address *</label>
              <input
                type="text"
                name="location.address"
                value={formData.location.address}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., 123 Main Street, Central Park"
                required
                disabled={loading}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">City *</label>
                <input
                  type="text"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., New York"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">State *</label>
                <input
                  type="text"
                  name="location.state"
                  value={formData.location.state}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., NY"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Date Lost *</label>
              <input
                type="date"
                name="dateLostFound"
                value={formData.dateLostFound}
                onChange={handleChange}
                className="form-input"
                required
                disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
                  />
                  <span className="radio-custom"></span>
                  Phone
                </label>
              </div>
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
                  name="features.color"
                  value={formData.features.color}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., Black, Silver, Red"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Brand</label>
                <input
                  type="text"
                  name="features.brand"
                  value={formData.features.brand}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., Apple, Samsung"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Model</label>
              <input
                type="text"
                name="features.model"
                value={formData.features.model}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., iPhone 13 Pro, Galaxy S21"
                disabled={loading}
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
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Reward Amount (Optional)</label>
              <input
                type="number"
                name="reward.amount"
                value={formData.reward.amount}
                onChange={handleChange}
                className="form-input"
                placeholder="0"
                min="0"
                disabled={loading}
              />
            </div>
          </div>
        )}

        <div className="form-actions">
          {currentStep > 1 && (
            <button 
              type="button" 
              className="btn btn-outline" 
              onClick={handlePrevStep}
              disabled={loading}
            >
              Previous
            </button>
          )}
          
          {currentStep < 3 ? (
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={handleNextStep}
              disabled={!isStepValid() || loading}
            >
              Next
            </button>
          ) : (
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading || !isStepValid()}
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
    </div>
  );
};

export default ReportLost;
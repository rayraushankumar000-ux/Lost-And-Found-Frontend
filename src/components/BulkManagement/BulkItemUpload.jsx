import React, { useState, useRef } from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import './BulkItemUpload.css';

const BulkItemUpload = () => {
  const [uploadStage, setUploadStage] = useState('select'); // select, map, review, complete
  const [csvData, setCsvData] = useState([]);
  const [columnMapping, setColumnMapping] = useState({});
  const [processedItems, setProcessedItems] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);
  const { addNotification } = useNotification();

  const requiredFields = ['itemName', 'category', 'description', 'location'];
  const sampleColumns = ['Item Name', 'Category', 'Description', 'Location', 'Date', 'Color', 'Brand'];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csvText = e.target.result;
      parseCSV(csvText);
    };
    reader.readAsText(file);
  };

  const parseCSV = (csvText) => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      return headers.reduce((obj, header, index) => {
        obj[header] = values[index] || '';
        return obj;
      }, {});
    }).filter(item => Object.values(item).some(val => val));

    setCsvData(data);
    setUploadStage('map');
    
    // Auto-map common column names
    const autoMapping = {};
    headers.forEach(header => {
      const lowerHeader = header.toLowerCase();
      if (lowerHeader.includes('name') || lowerHeader.includes('item')) {
        autoMapping.itemName = header;
      } else if (lowerHeader.includes('category') || lowerHeader.includes('type')) {
        autoMapping.category = header;
      } else if (lowerHeader.includes('desc')) {
        autoMapping.description = header;
      } else if (lowerHeader.includes('location') || lowerHeader.includes('place')) {
        autoMapping.location = header;
      }
    });
    setColumnMapping(autoMapping);
  };

  const handleMappingChange = (field, csvColumn) => {
    setColumnMapping(prev => ({
      ...prev,
      [field]: csvColumn
    }));
  };

  const processItems = () => {
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      const processed = csvData.map((row, index) => {
        const item = {};
        Object.keys(columnMapping).forEach(field => {
          if (columnMapping[field]) {
            item[field] = row[columnMapping[field]];
          }
        });
        
        return {
          id: `bulk-${index}`,
          ...item,
          status: 'pending',
          type: 'lost', // Default to lost items
          errors: validateItem(item)
        };
      });

      setProcessedItems(processed);
      setUploadStage('review');
      setIsProcessing(false);
    }, 2000);
  };

  const validateItem = (item) => {
    const errors = [];
    requiredFields.forEach(field => {
      if (!item[field] || item[field].trim() === '') {
        errors.push(`Missing ${field}`);
      }
    });
    return errors;
  };

  const submitItems = async () => {
    setIsProcessing(true);
    
    // Simulate API submission
    setTimeout(() => {
      const successful = processedItems.filter(item => item.errors.length === 0);
      const failed = processedItems.filter(item => item.errors.length > 0);
      
      addNotification({
        title: 'Bulk Upload Complete',
        message: `Successfully uploaded ${successful.length} items. ${failed.length} items failed.`
      });
      
      setUploadStage('complete');
      setIsProcessing(false);
    }, 3000);
  };

  const getCompletionStats = () => {
    const total = processedItems.length;
    const valid = processedItems.filter(item => item.errors.length === 0).length;
    const invalid = total - valid;
    
    return { total, valid, invalid };
  };

  return (
    <div className="bulk-upload">
      <div className="bulk-header">
        <h2>📦 Bulk Item Management</h2>
        <p>Upload multiple items at once using CSV file</p>
      </div>

      {/* Progress Steps */}
      <div className="upload-progress">
        <div className={`progress-step ${uploadStage === 'select' ? 'active' : ''} ${['map', 'review', 'complete'].includes(uploadStage) ? 'completed' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-label">Select File</div>
        </div>
        <div className={`progress-step ${uploadStage === 'map' ? 'active' : ''} ${['review', 'complete'].includes(uploadStage) ? 'completed' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-label">Map Columns</div>
        </div>
        <div className={`progress-step ${uploadStage === 'review' ? 'active' : ''} ${['complete'].includes(uploadStage) ? 'completed' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-label">Review & Submit</div>
        </div>
        <div className={`progress-step ${uploadStage === 'complete' ? 'active' : ''}`}>
          <div className="step-number">4</div>
          <div className="step-label">Complete</div>
        </div>
      </div>

      {/* Stage 1: File Selection */}
      {uploadStage === 'select' && (
        <div className="upload-stage">
          <div className="file-upload-area">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="file-input"
            />
            <div className="upload-placeholder">
              <div className="upload-icon">📄</div>
              <h3>Upload CSV File</h3>
              <p>Drag & drop your CSV file or click to browse</p>
              <div className="file-requirements">
                <h4>File Requirements:</h4>
                <ul>
                  <li>CSV format with column headers</li>
                  <li>Include: Item Name, Category, Description, Location</li>
                  <li>Maximum 1000 items per file</li>
                  <li>File size limit: 10MB</li>
                </ul>
              </div>
              <button 
                className="btn btn-outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose File
              </button>
            </div>
          </div>

          <div className="sample-section">
            <h4>📋 Sample CSV Format</h4>
            <div className="sample-table">
              <table>
                <thead>
                  <tr>
                    {sampleColumns.map(col => (
                      <th key={col}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>iPhone 13</td>
                    <td>Electronics</td>
                    <td>Black iPhone with blue case</td>
                    <td>Central Park</td>
                    <td>2024-01-15</td>
                    <td>Black</td>
                    <td>Apple</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button className="btn btn-outline">
              📥 Download Template
            </button>
          </div>
        </div>
      )}

      {/* Stage 2: Column Mapping */}
      {uploadStage === 'map' && (
        <div className="upload-stage">
          <h3>Map CSV Columns to Fields</h3>
          <p>Match your CSV column headers to the required item fields</p>
          
          <div className="mapping-table">
            <div className="mapping-header">
              <div className="mapping-field">Required Field</div>
              <div className="mapping-column">CSV Column</div>
              <div className="mapping-preview">Preview</div>
            </div>
            
            {requiredFields.map(field => (
              <div key={field} className="mapping-row">
                <div className="mapping-field">
                  <span className="field-name">{field}</span>
                  <span className="required-badge">Required</span>
                </div>
                <div className="mapping-column">
                  <select
                    value={columnMapping[field] || ''}
                    onChange={(e) => handleMappingChange(field, e.target.value)}
                  >
                    <option value="">Select column...</option>
                    {Object.keys(csvData[0] || {}).map(column => (
                      <option key={column} value={column}>{column}</option>
                    ))}
                  </select>
                </div>
                <div className="mapping-preview">
                  {columnMapping[field] && csvData[0] && (
                    <span className="preview-value">
                      {csvData[0][columnMapping[field]]}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mapping-actions">
            <button 
              className="btn btn-outline"
              onClick={() => setUploadStage('select')}
            >
              ← Back
            </button>
            <button 
              className="btn btn-primary"
              onClick={processItems}
              disabled={isProcessing || !requiredFields.every(field => columnMapping[field])}
            >
              {isProcessing ? 'Processing...' : 'Review Items →'}
            </button>
          </div>
        </div>
      )}

      {/* Stage 3: Review & Submit */}
      {uploadStage === 'review' && (
        <div className="upload-stage">
          <div className="review-header">
            <h3>Review Items</h3>
            <div className="upload-stats">
              <div className="stat valid">{getCompletionStats().valid} Valid</div>
              <div className="stat invalid">{getCompletionStats().invalid} Issues</div>
              <div className="stat total">{getCompletionStats().total} Total</div>
            </div>
          </div>

          <div className="items-review">
            {processedItems.map((item, index) => (
              <div key={item.id} className={`review-item ${item.errors.length > 0 ? 'invalid' : 'valid'}`}>
                <div className="item-preview">
                  <div className="item-name">{item.itemName || 'Unnamed Item'}</div>
                  <div className="item-details">
                    <span>{item.category}</span>
                    <span>•</span>
                    <span>{item.location}</span>
                  </div>
                </div>
                <div className="item-status">
                  {item.errors.length > 0 ? (
                    <div className="error-list">
                      {item.errors.map((error, errorIndex) => (
                        <span key={errorIndex} className="error-tag">{error}</span>
                      ))}
                    </div>
                  ) : (
                    <span className="status-valid">✓ Ready to import</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="review-actions">
            <button 
              className="btn btn-outline"
              onClick={() => setUploadStage('map')}
            >
              ← Back to Mapping
            </button>
            <button 
              className="btn btn-primary"
              onClick={submitItems}
              disabled={isProcessing || getCompletionStats().valid === 0}
            >
              {isProcessing ? 'Uploading...' : `Import ${getCompletionStats().valid} Items`}
            </button>
          </div>
        </div>
      )}

      {/* Stage 4: Complete */}
      {uploadStage === 'complete' && (
        <div className="upload-stage complete-stage">
          <div className="completion-message">
            <div className="success-icon">✅</div>
            <h3>Bulk Upload Complete!</h3>
            <p>Successfully processed {getCompletionStats().total} items</p>
            <div className="completion-stats">
              <div className="stat success">
                <div className="stat-number">{getCompletionStats().valid}</div>
                <div className="stat-label">Successfully Imported</div>
              </div>
              <div className="stat failed">
                <div className="stat-number">{getCompletionStats().invalid}</div>
                <div className="stat-label">Requires Attention</div>
              </div>
            </div>
          </div>

          <div className="completion-actions">
            <button 
              className="btn btn-outline"
              onClick={() => {
                setUploadStage('select');
                setProcessedItems([]);
                setCsvData([]);
              }}
            >
              Upload Another File
            </button>
            <button className="btn btn-primary">
              View Imported Items
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkItemUpload;
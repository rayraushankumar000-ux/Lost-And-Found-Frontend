import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import authorityIntegrationService from '../../services/authorityIntegrationService';
import './AuthorityReporting.css';

const AuthorityReporting = ({ itemData = null }) => {
  const [selectedAuthority, setSelectedAuthority] = useState('police');
  const [nearbyAuthorities, setNearbyAuthorities] = useState([]);
  const [isReporting, setIsReporting] = useState(false);
  const [reportStatus, setReportStatus] = useState(null);
  const [stolenCheck, setStolenCheck] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const { user } = useAuth();
  const { addNotification } = useNotification();

  const authorityTypes = {
    police: { name: 'Police Department', icon: '👮', color: '#3b82f6' },
    transport: { name: 'Transport Authority', icon: '🚆', color: '#f59e0b' },
    municipal: { name: 'Municipal Office', icon: '🏢', color: '#10b981' },
    campus: { name: 'Campus Security', icon: '🎓', color: '#8b5cf6' }
  };

  useEffect(() => {
    if (itemData) {
      checkStolenDatabase();
    }
    getNearbyAuthorities();
  }, [itemData]);

  const getNearbyAuthorities = async () => {
    try {
      const authorities = await authorityIntegrationService.getNearbyAuthorities(userLocation);
      setNearbyAuthorities(authorities);
    } catch (error) {
      console.error('Error fetching authorities:', error);
    }
  };

  const checkStolenDatabase = async () => {
    if (!itemData) return;
    
    try {
      const result = await authorityIntegrationService.checkStolenItemsDatabase(itemData);
      setStolenCheck(result);
      
      if (result.isStolen) {
        addNotification({
          title: '⚠️ Potential Stolen Item',
          message: 'This item matches records in the stolen items database',
          type: 'warning'
        });
      }
    } catch (error) {
      console.error('Error checking stolen database:', error);
    }
  };

  const handleAuthorityReport = async () => {
    if (!itemData) {
      addNotification({
        title: 'Error',
        message: 'No item data provided for reporting',
        type: 'error'
      });
      return;
    }

    setIsReporting(true);
    setReportStatus(null);

    try {
      const reportData = {
        ...itemData,
        reporterName: user?.name,
        reporterContact: user?.email,
        userId: user?.id
      };

      const result = await authorityIntegrationService.reportToAuthorities(
        reportData, 
        selectedAuthority
      );

      setReportStatus(result);
      
      addNotification({
        title: '✅ Reported to Authorities',
        message: `Reference: ${result.referenceNumber}`
      });
    } catch (error) {
      addNotification({
        title: 'Error',
        message: 'Failed to report to authorities',
        type: 'error'
      });
    } finally {
      setIsReporting(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <div className="authority-reporting">
      <div className="authority-header">
        <h2>🏢 Authority Integration</h2>
        <p>Report items to local authorities and check official databases</p>
      </div>

      {/* Stolen Items Check */}
      {stolenCheck && (
        <div className={`stolen-check-alert ${stolenCheck.isStolen ? 'stolen' : 'clean'}`}>
          <div className="alert-icon">
            {stolenCheck.isStolen ? '⚠️' : '✅'}
          </div>
          <div className="alert-content">
            <h4>
              {stolenCheck.isStolen 
                ? 'Potential Stolen Item Match' 
                : 'No Stolen Item Matches Found'
              }
            </h4>
            <p>
              {stolenCheck.isStolen
                ? `This item matches ${stolenCheck.similarItems.length} records in the stolen items database with ${Math.round(stolenCheck.matchConfidence)}% confidence`
                : 'This item does not match any known stolen items in our database'
              }
            </p>
            
            {stolenCheck.similarItems.length > 0 && (
              <div className="similar-stolen-items">
                <h5>Similar Stolen Items:</h5>
                {stolenCheck.similarItems.map(item => (
                  <div key={item.id} className="stolen-item">
                    <span className="item-name">{item.item}</span>
                    <span className="case-number">{item.caseNumber}</span>
                    <span className="reported-date">{item.reportedDate}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="reporting-sections">
        {/* Authority Selection */}
        <div className="reporting-section">
          <h4>Select Authority Type</h4>
          <div className="authority-type-grid">
            {Object.entries(authorityTypes).map(([key, authority]) => (
              <div
                key={key}
                className={`authority-type-card ${selectedAuthority === key ? 'active' : ''}`}
                onClick={() => setSelectedAuthority(key)}
                style={{ borderColor: authority.color }}
              >
                <div className="authority-icon" style={{ color: authority.color }}>
                  {authority.icon}
                </div>
                <div className="authority-name">{authority.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Nearby Authorities */}
        <div className="reporting-section">
          <div className="section-header">
            <h4>Nearby Authorities</h4>
            <button 
              className="btn btn-outline btn-small"
              onClick={getCurrentLocation}
            >
              📍 Update Location
            </button>
          </div>
          
          <div className="nearby-authorities">
            {nearbyAuthorities
              .filter(auth => auth.type === selectedAuthority)
              .map(authority => (
                <div key={authority.id} className="authority-card">
                  <div className="authority-info">
                    <div className="authority-name">{authority.name}</div>
                    <div className="authority-address">{authority.address}</div>
                    <div className="authority-details">
                      <span>📞 {authority.phone}</span>
                      <span>🕒 {authority.hours}</span>
                      <span>📍 {authority.distance}</span>
                    </div>
                    <div className="authority-services">
                      {authority.services.map(service => (
                        <span key={service} className="service-tag">{service}</span>
                      ))}
                    </div>
                  </div>
                  <div className="authority-actions">
                    <button className="btn btn-outline btn-small">
                      📞 Call
                    </button>
                    <button className="btn btn-outline btn-small">
                      🗺️ Directions
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Report Submission */}
        {itemData && (
          <div className="reporting-section">
            <h4>Submit Official Report</h4>
            <div className="report-preview">
              <div className="preview-header">
                <h5>Report Preview</h5>
                <div className="reference-number">
                  Ref: {reportStatus?.referenceNumber || 'Pending...'}
                </div>
              </div>
              <div className="preview-content">
                <div className="preview-item">
                  <strong>Item:</strong> {itemData.itemName}
                </div>
                <div className="preview-item">
                  <strong>Category:</strong> {itemData.category}
                </div>
                <div className="preview-item">
                  <strong>Description:</strong> {itemData.description}
                </div>
                <div className="preview-item">
                  <strong>Reporter:</strong> {user?.name}
                </div>
              </div>
            </div>

            <button
              className="btn btn-primary report-btn"
              onClick={handleAuthorityReport}
              disabled={isReporting}
            >
              {isReporting ? (
                <>
                  <div className="spinner-small"></div>
                  Reporting to {authorityTypes[selectedAuthority]?.name}...
                </>
              ) : (
                `Report to ${authorityTypes[selectedAuthority]?.name}`
              )}
            </button>

            {reportStatus && (
              <div className="report-status">
                <div className="status-success">✅ {reportStatus.message}</div>
                <div className="reference-info">
                  Reference Number: <strong>{reportStatus.referenceNumber}</strong>
                </div>
                <div className="status-actions">
                  <button className="btn btn-outline btn-small">
                    📄 Print Report
                  </button>
                  <button className="btn btn-outline btn-small">
                    📧 Email Copy
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Integration Benefits */}
      <div className="integration-benefits">
        <h4>🚨 Benefits of Authority Integration</h4>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">🔍</div>
            <div className="benefit-content">
              <h5>Stolen Item Database</h5>
              <p>Check against official stolen items records</p>
            </div>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">📋</div>
            <div className="benefit-content">
              <h5>Official Documentation</h5>
              <p>Generate official reports and reference numbers</p>
            </div>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🤝</div>
            <div className="benefit-content">
              <h5>Coordinated Recovery</h5>
              <p>Work together with local authorities for item recovery</p>
            </div>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">⚡</div>
            <div className="benefit-content">
              <h5>Fast Processing</h5>
              <p>Expedited handling through official channels</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorityReporting;
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AdvancedSearch from '../../components/AdvancedSearch/AdvancedSearch';
import ChatModal from '../../components/ChatModal/ChatModal';
import './SearchResults.css';

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const searchFilters = location.state?.filters || {};

  // Sample data - in real app, this would come from API
  const sampleResults = [
    {
      id: 1,
      type: 'lost',
      itemName: 'iPhone 13 Pro',
      category: 'Electronics',
      description: 'Silver iPhone 13 Pro with black case. Lost near Central Park.',
      location: 'Central Park',
      date: '2024-01-15',
      color: 'Silver',
      brand: 'Apple',
      images: [],
      contact: 'john@example.com',
      status: 'active'
    },
    {
      id: 2,
      type: 'found',
      itemName: 'Wallet',
      category: 'Bags & Wallets',
      description: 'Black leather wallet found with credit cards and ID.',
      location: 'Downtown Mall',
      date: '2024-01-14',
      color: 'Black',
      brand: 'Unknown',
      images: [],
      contact: 'sarah@example.com',
      status: 'active'
    },
    {
      id: 3,
      type: 'lost',
      itemName: 'Keys',
      category: 'Keys',
      description: 'Set of 3 keys with blue keychain.',
      location: 'Main Street',
      date: '2024-01-13',
      color: 'Silver',
      brand: 'Unknown',
      images: [],
      contact: 'mike@example.com',
      status: 'active'
    },
    {
      id: 4,
      type: 'found',
      itemName: 'Watch',
      category: 'Jewelry',
      description: 'Gold wristwatch found in restaurant.',
      location: 'City Restaurant',
      date: '2024-01-12',
      color: 'Gold',
      brand: 'Rolex',
      images: [],
      contact: 'admin@restaurant.com',
      status: 'active'
    }
  ];

  useEffect(() => {
    // Simulate API call with filters
    setTimeout(() => {
      let filteredResults = sampleResults;

      // Apply filters
      if (searchFilters.category) {
        filteredResults = filteredResults.filter(item => 
          item.category === searchFilters.category
        );
      }

      if (searchFilters.location) {
        filteredResults = filteredResults.filter(item =>
          item.location.toLowerCase().includes(searchFilters.location.toLowerCase())
        );
      }

      if (searchFilters.status && searchFilters.status !== 'all') {
        filteredResults = filteredResults.filter(item =>
          item.type === searchFilters.status
        );
      }

      if (searchFilters.keywords) {
        const keywords = searchFilters.keywords.toLowerCase();
        filteredResults = filteredResults.filter(item =>
          item.itemName.toLowerCase().includes(keywords) ||
          item.description.toLowerCase().includes(keywords) ||
          item.color.toLowerCase().includes(keywords) ||
          item.brand.toLowerCase().includes(keywords)
        );
      }

      setResults(filteredResults);
      setLoading(false);
    }, 1000);
  }, [searchFilters]);

  const handleContact = (item) => {
    if (!isAuthenticated) {
      alert('Please login to contact about this item');
      return;
    }
    setSelectedItem(item);
    setIsChatModalOpen(true);
  };

  const getStatusColor = (type) => {
    return type === 'lost' ? '#ef4444' : '#10b981';
  };

  const getStatusText = (type) => {
    return type === 'lost' ? 'Lost' : 'Found';
  };

  if (loading) {
    return (
      <div className="search-results">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Searching for items...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results">
      <div className="container">
        <div className="results-header">
          <h1>Search Results</h1>
          <p>{results.length} items found matching your criteria</p>
        </div>

        <div className="search-layout">
          <div className="search-sidebar">
            <AdvancedSearch />
          </div>

          <div className="results-main">
            <div className="results-controls">
              <div className="view-toggle">
                <button 
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  ⬜ Grid
                </button>
                <button 
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  ☰ List
                </button>
              </div>
              <div className="sort-options">
                <select className="sort-select">
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="relevance">Relevance</option>
                </select>
              </div>
            </div>

            {results.length === 0 ? (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <h3>No items found</h3>
                <p>Try adjusting your search criteria or browse all items</p>
                <Link to="/search" className="btn btn-primary">
                  Browse All Items
                </Link>
              </div>
            ) : (
              <div className={`results-grid ${viewMode}`}>
                {results.map(item => (
                  <div key={item.id} className="result-card">
                    <div className="card-header">
                      <div 
                        className="item-type"
                        style={{ 
                          backgroundColor: getStatusColor(item.type) + '20',
                          color: getStatusColor(item.type)
                        }}
                      >
                        {getStatusText(item.type)}
                      </div>
                      <div className="item-date">{item.date}</div>
                    </div>

                    <div className="card-content">
                      <h3 className="item-name">{item.itemName}</h3>
                      <p className="item-description">{item.description}</p>
                      
                      <div className="item-details">
                        <div className="detail">
                          <span className="detail-label">Category:</span>
                          <span className="detail-value">{item.category}</span>
                        </div>
                        <div className="detail">
                          <span className="detail-label">Location:</span>
                          <span className="detail-value">{item.location}</span>
                        </div>
                        <div className="detail">
                          <span className="detail-label">Color:</span>
                          <span className="detail-value">{item.color}</span>
                        </div>
                        {item.brand && item.brand !== 'Unknown' && (
                          <div className="detail">
                            <span className="detail-label">Brand:</span>
                            <span className="detail-value">{item.brand}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="card-actions">
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleContact(item)}
                      >
                        {item.type === 'lost' ? 'I Found This' : 'This Is Mine'}
                      </button>
                      <button className="btn btn-outline">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {results.length > 0 && (
              <div className="results-pagination">
                <button className="pagination-btn" disabled>Previous</button>
                <span className="pagination-info">Page 1 of 1</span>
                <button className="pagination-btn" disabled>Next</button>
              </div>
            )}
          </div>
        </div>

        <ChatModal
          isOpen={isChatModalOpen}
          onClose={() => setIsChatModalOpen(false)}
          item={selectedItem}
        />
      </div>
    </div>
  );
};

export default SearchResults;
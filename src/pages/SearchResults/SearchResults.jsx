import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { itemsAPI } from '../../services/api';
import AdvancedSearch from '../../components/AdvancedSearch/AdvancedSearch';
import ChatModal from '../../components/ChatModal/ChatModal';
import './SearchResults.css';

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const searchFilters = location.state?.filters || {};

  useEffect(() => {
    let mounted = true;

    const fetchResults = async () => {
      setLoading(true);
      setError('');
      try {
        const params = {};
        if (searchFilters.keywords) params.q = searchFilters.keywords;
        if (searchFilters.category) params.category = searchFilters.category;
        if (searchFilters.status && searchFilters.status !== 'all') {
          params.status = searchFilters.status;
        }
        if (searchFilters.near) params.near = searchFilters.near;

        const res = await itemsAPI.searchItems(params);
        const items = res.data?.data || res.data?.items || [];
        const mapped = items.map(it => ({
          id: it._id,
          type: (it.status || 'lost').toLowerCase() === 'found' ? 'found' : 'lost',
          itemName: it.title || it.description || 'Item',
          category: it.category || 'Other',
          description: it.description || '',
          location: it.location?.address || [it.location?.city, it.location?.state].filter(Boolean).join(', ') || 'Unknown',
          date: (it.dateLostFound || it.createdAt || '').toString().slice(0,10),
          color: it.features?.color || it.color || '',
          brand: it.features?.brand || it.brand || 'Unknown',
          images: it.images || [],
          contact: it.reporter?.email || '',
          status: it.status || 'active'
        }));
        // Apply client-side filters to ensure correctness
        let filtered = mapped;
        if (searchFilters.category) {
          const cat = String(searchFilters.category).toLowerCase();
          filtered = filtered.filter(x => String(x.category || '').toLowerCase() === cat);
        }
        if (searchFilters.status && searchFilters.status !== 'all') {
          const st = String(searchFilters.status).toLowerCase();
          filtered = filtered.filter(x => x.type === st);
        }
        if (searchFilters.location) {
          const loc = String(searchFilters.location).toLowerCase();
          filtered = filtered.filter(x => String(x.location || '').toLowerCase().includes(loc));
        }
        if (searchFilters.date) {
          const dt = String(searchFilters.date);
          filtered = filtered.filter(x => String(x.date || '').slice(0,10) === dt);
        }
        if (searchFilters.keywords) {
          const kw = String(searchFilters.keywords).toLowerCase();
          filtered = filtered.filter(x =>
            String(x.itemName || '').toLowerCase().includes(kw) ||
            String(x.description || '').toLowerCase().includes(kw) ||
            String(x.color || '').toLowerCase().includes(kw) ||
            String(x.brand || '').toLowerCase().includes(kw)
          );
        }
        if (mounted) setResults(filtered);
      } catch (err) {
        if (mounted) {
          setError(err?.message || 'Failed to fetch results');
          setResults([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchResults();

    return () => { mounted = false; };
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

  if (error) {
    return (
      <div className="search-results">
        <div className="container">
          <div className="no-results">
            <div className="no-results-icon">⚠️</div>
            <h3>Unable to load results</h3>
            <p>{error}</p>
            <button className="btn btn-outline" onClick={() => window.location.reload()}>Retry</button>
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
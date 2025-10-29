import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdvancedSearch.css';

const AdvancedSearch = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    date: '',
    keywords: '',
    status: 'all'
  });

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

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/search', { state: { filters } });
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      location: '',
      date: '',
      keywords: '',
      status: 'all'
    });
  };

  return (
    <div className="advanced-search">
      <h3 className="search-title">Advanced Search</h3>
      
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-grid">
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="form-input"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              type="text"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="form-input"
              placeholder="Enter location"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => handleFilterChange('date', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="form-input"
            >
              <option value="all">All Status</option>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
              <option value="claimed">Claimed</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Keywords</label>
          <input
            type="text"
            value={filters.keywords}
            onChange={(e) => handleFilterChange('keywords', e.target.value)}
            className="form-input"
            placeholder="Enter keywords (color, brand, features...)"
          />
        </div>

        <div className="search-actions">
          <button type="button" className="btn btn-outline" onClick={clearFilters}>
            Clear Filters
          </button>
          <button type="submit" className="btn btn-primary">
            Search Items
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdvancedSearch;
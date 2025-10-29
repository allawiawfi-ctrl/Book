// components/FilterSidebar/FilterSidebar.js - شريط الفلاتر
import React, { useState } from 'react';
import { useBookContext } from '../../contexts/BookContext';
import './FilterSidebar.css';

const FilterSidebar = ({ filters, onFilterChange, onClearFilters }) => {
  const { categories } = useBookContext();
  
  const [localFilters, setLocalFilters] = useState(filters);
  const [priceRange, setPriceRange] = useState(filters.priceRange);

  const conditions = [
    { value: 'ممتازة', label: 'ممتازة' },
    { value: 'جيدة جداً', label: 'جيدة جداً' },
    { value: 'جيدة', label: 'جيدة' },
    { value: 'مقبولة', label: 'مقبولة' }
  ];

  const exchangeTypes = [
    { value: 'بيع', label: 'للبيع' },
    { value: 'تبادل', label: 'للتبادل' }
  ];

  const handleCategoryChange = (category) => {
    const newFilters = { ...localFilters, category };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleConditionChange = (condition) => {
    const newFilters = { ...localFilters, condition };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleLocationChange = (e) => {
    const location = e.target.value;
    const newFilters = { ...localFilters, location };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceRangeChange = (min, max) => {
    const newPriceRange = { min: parseInt(min), max: parseInt(max) };
    setPriceRange(newPriceRange);
    
    const newFilters = { ...localFilters, priceRange: newPriceRange };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const defaultFilters = {
      category: '',
      condition: '',
      location: '',
      priceRange: { min: 0, max: 1000 },
      sortBy: 'newest'
    };
    
    setLocalFilters(defaultFilters);
    setPriceRange(defaultFilters.priceRange);
    onClearFilters();
  };

  const hasActiveFilters = 
    localFilters.category || 
    localFilters.condition || 
    localFilters.location || 
    localFilters.priceRange.min > 0 || 
    localFilters.priceRange.max < 1000;

  return (
    <div className="filter-sidebar">
      <div className="filter-header">
        <h3>الفلاتر</h3>
        {hasActiveFilters && (
          <button 
            className="clear-filters-btn"
            onClick={handleClearFilters}
          >
            مسح الكل
          </button>
        )}
      </div>

      {/* فلتر التصنيف */}
      <div className="filter-section">
        <h4 className="filter-title">التصنيف</h4>
        <div className="filter-options">
          {categories.map(category => (
            <button
              key={category.id}
              className={`filter-option ${localFilters.category === category.name ? 'active' : ''}`}
              onClick={() => handleCategoryChange(localFilters.category === category.name ? '' : category.name)}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-name">{category.name}</span>
              <span className="category-count">({category.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* فلتر الحالة */}
      <div className="filter-section">
        <h4 className="filter-title">حالة الكتاب</h4>
        <div className="filter-options">
          {conditions.map(condition => (
            <button
              key={condition.value}
              className={`filter-option ${localFilters.condition === condition.value ? 'active' : ''}`}
              onClick={() => handleConditionChange(localFilters.condition === condition.value ? '' : condition.value)}
            >
              <span className="condition-dot"></span>
              <span>{condition.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* فلتر الموقع */}
      <div className="filter-section">
        <h4 className="filter-title">الموقع</h4>
        <div className="location-filter">
          <input
            type="text"
            value={localFilters.location}
            onChange={handleLocationChange}
            placeholder="ابحث عن مدينة..."
            className="location-input"
          />
        </div>
      </div>

      {/* فلتر السعر */}
      <div className="filter-section">
        <h4 className="filter-title">نطاق السعر</h4>
        <div className="price-filter">
          <div className="price-inputs">
            <div className="price-input-group">
              <label>من</label>
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) => handlePriceRangeChange(e.target.value, priceRange.max)}
                min="0"
                max="1000"
                className="price-input"
              />
            </div>
            <div className="price-input-group">
              <label>إلى</label>
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) => handlePriceRangeChange(priceRange.min, e.target.value)}
                min="0"
                max="1000"
                className="price-input"
              />
            </div>
          </div>
          
          <div className="price-slider">
            <input
              type="range"
              min="0"
              max="1000"
              value={priceRange.min}
              onChange={(e) => handlePriceRangeChange(e.target.value, priceRange.max)}
              className="price-range-slider min-slider"
            />
            <input
              type="range"
              min="0"
              max="1000"
              value={priceRange.max}
              onChange={(e) => handlePriceRangeChange(priceRange.min, e.target.value)}
              className="price-range-slider max-slider"
            />
          </div>
          
          <div className="price-display">
            <span>{priceRange.min} ر.س - {priceRange.max} ر.س</span>
          </div>
        </div>
      </div>

      {/* فلتر نوع التبادل */}
      <div className="filter-section">
        <h4 className="filter-title">نوع التبادل</h4>
        <div className="filter-options">
          {exchangeTypes.map(type => (
            <button
              key={type.value}
              className={`filter-option ${localFilters.exchangeType === type.value ? 'active' : ''}`}
              onClick={() => onFilterChange({ ...localFilters, exchangeType: localFilters.exchangeType === type.value ? '' : type.value })}
            >
              <span>{type.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;

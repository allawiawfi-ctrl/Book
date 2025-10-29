// components/BookCard/BookCard.js - بطاقة عرض الكتاب
import React from 'react';
import { Link } from 'react-router-dom';
import { useBookContext } from '../../contexts/BookContext';
import { useAuthContext } from '../../contexts/AuthContext';
import './BookCard.css';

const BookCard = ({ book, showActions = true }) => {
  const { addToWishlist, removeFromWishlist, wishlist } = useBookContext();
  const { user } = useAuthContext();
  
  const isInWishlist = wishlist.some(b => b.id === book.id);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) return;
    
    if (isInWishlist) {
      removeFromWishlist(book.id);
    } else {
      addToWishlist(book.id);
    }
  };

  const formatPrice = (price) => {
    return `${price} ر.س`;
  };

  const getConditionBadge = (condition) => {
    const conditionClasses = {
      'ممتازة': 'excellent',
      'جيدة جداً': 'very-good',
      'جيدة': 'good',
      'مقبولة': 'acceptable'
    };
    
    return (
      <span className={`condition-badge ${conditionClasses[condition] || 'acceptable'}`}>
        {condition}
      </span>
    );
  };

  return (
    <div className="book-card">
      <Link to={`/books/${book.id}`} className="book-card-link">
        <div className="book-image-container">
          <img 
            src={book.image} 
            alt={book.title}
            className="book-image"
            onError={(e) => {
              e.target.src = '/images/book-placeholder.jpg';
            }}
          />
          
          {/* شارة الحالة */}
          <div className="book-status-badges">
            {getConditionBadge(book.condition)}
            {book.exchangeType === 'تبادل' && (
              <span className="exchange-badge">للتبادل</span>
            )}
          </div>
          
          {/* زر قائمة الرغبات */}
          {showActions && user && (
            <button 
              className={`wishlist-btn ${isInWishlist ? 'in-wishlist' : ''}`}
              onClick={handleWishlistToggle}
              title={isInWishlist ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
            >
              {isInWishlist ? '❤️' : '🤍'}
            </button>
          )}
        </div>

        <div className="book-info">
          <h3 className="book-title">{book.title}</h3>
          <p className="book-author">بواسطة: {book.author}</p>
          
          <div className="book-meta">
            <span className="book-category">{book.category}</span>
            <span className="book-location">{book.location}</span>
          </div>
          
          <div className="book-stats">
            <span className="stat">
              <span className="stat-icon">👁️</span>
              {book.views}
            </span>
            <span className="stat">
              <span className="stat-icon">❤️</span>
              {book.likes}
            </span>
          </div>
          
          <div className="book-price-section">
            <div className="price-info">
              <span className="current-price">{formatPrice(book.price)}</span>
              {book.originalPrice && book.originalPrice > book.price && (
                <span className="original-price">{formatPrice(book.originalPrice)}</span>
              )}
            </div>
            
            {book.originalPrice && book.originalPrice > book.price && (
              <span className="discount-percent">
                {Math.round((1 - book.price / book.originalPrice) * 100)}%
              </span>
            )}
          </div>
          
          <div className="seller-info">
            <img 
              src={book.seller.avatar} 
              alt={book.seller.name}
              className="seller-avatar"
            />
            <div className="seller-details">
              <span className="seller-name">{book.seller.name}</span>
              <div className="seller-rating">
                <span className="rating-stars">★★★★★</span>
                <span className="rating-value">{book.seller.rating}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BookCard;

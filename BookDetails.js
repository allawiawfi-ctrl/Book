// pages/BookDetails/BookDetails.js - صفحة تفاصيل الكتاب
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBookContext } from '../../contexts/BookContext';
import { useAuthContext } from '../../contexts/AuthContext';
import BookImageGallery from '../../components/BookImageGallery/BookImageGallery';
import SellerInfo from '../../components/SellerInfo/SellerInfo';
import BookActionButtons from '../../components/BookActionButtons/BookActionButtons';
import SimilarBooks from '../../components/SimilarBooks/SimilarBooks';
import ReviewSection from '../../components/ReviewSection/ReviewSection';
import './BookDetails.css';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    books, 
    userBooks, 
    wishlist, 
    loading, 
    addToWishlist, 
    removeFromWishlist, 
    addToRecentlyViewed, 
    incrementViews,
    incrementLikes
  } = useBookContext();
  
  const { user } = useAuthContext();
  
  const [book, setBook] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    // البحث عن الكتاب
    const foundBook = books.find(b => b.id === parseInt(id));
    
    if (foundBook) {
      setBook(foundBook);
      setIsInWishlist(wishlist.some(b => b.id === foundBook.id));
      setIsOwner(userBooks.some(b => b.id === foundBook.id));
      
      // زيادة عدد المشاهدات
      incrementViews(foundBook.id);
      
      // إضافة إلى الكتب التي تم مشاهدتها مؤخراً
      addToRecentlyViewed(foundBook.id);
    } else {
      // إذا لم يتم العثور على الكتاب، التوجيه للصفحة غير موجودة
      navigate('/404');
    }
  }, [id, books, userBooks, wishlist, incrementViews, addToRecentlyViewed, navigate]);

  const handleAddToWishlist = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (isInWishlist) {
      removeFromWishlist(book.id);
      setIsInWishlist(false);
    } else {
      addToWishlist(book.id);
      setIsInWishlist(true);
    }
  };

  const handleLike = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!liked) {
      incrementLikes(book.id);
      setLiked(true);
    }
  };

  const handleContactSeller = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // التوجيه لصفحة المحادثة مع البائع
    navigate(`/chat/${book.seller.id}`);
  };

  if (loading || !book) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>جاري تحميل تفاصيل الكتاب...</p>
      </div>
    );
  }

  return (
    <div className="book-details-page">
      <nav className="breadcrumb">
        <Link to="/">الرئيسية</Link> / 
        <Link to="/books">الكتب</Link> / 
        <span>{book.title}</span>
      </nav>

      <div className="book-details-content">
        {/* قسم الصور والمعلومات الأساسية */}
        <section className="book-main-info">
          <div className="book-images">
            <BookImageGallery images={[book.image]} />
          </div>
          
          <div className="book-basic-info">
            <h1 className="book-title">{book.title}</h1>
            <p className="book-author">بواسطة: {book.author}</p>
            
            <div className="book-meta">
              <span className="book-category">{book.category}</span>
              <span className="book-condition">الحالة: {book.condition}</span>
              <span className="book-location">المكان: {book.location}</span>
            </div>
            
            <div className="book-stats">
              <div className="stat">
                <span className="stat-value">{book.views}</span>
                <span className="stat-label">مشاهدة</span>
              </div>
              <div className="stat">
                <span className="stat-value">{book.likes}</span>
                <span className="stat-label">إعجاب</span>
              </div>
              <div className="stat">
                <span className="stat-value">{book.createdAt}</span>
                <span className="stat-label">تاريخ النشر</span>
              </div>
            </div>
            
            <div className="book-price-section">
              <div className="price-info">
                <span className="current-price">{book.price} ر.س</span>
                {book.originalPrice && (
                  <span className="original-price">{book.originalPrice} ر.س</span>
                )}
                <span className="discount-badge">
                  {book.originalPrice ? 
                    `${Math.round((1 - book.price / book.originalPrice) * 100)}% خصم` : 
                    'سعر مميز'
                  }
                </span>
              </div>
              
              <div className="exchange-type">
                <span className={`type-badge ${book.exchangeType}`}>
                  {book.exchangeType === 'بيع' ? 'للبيع' : 'للتبادل'}
                </span>
              </div>
            </div>
            
            <div className="book-actions">
              <BookActionButtons 
                book={book}
                isOwner={isOwner}
                isInWishlist={isInWishlist}
                onAddToWishlist={handleAddToWishlist}
                onContactSeller={handleContactSeller}
                onLike={handleLike}
                liked={liked}
              />
            </div>
          </div>
        </section>

        {/* معلومات البائع */}
        <section className="seller-section">
          <SellerInfo seller={book.seller} />
        </section>

        {/* تفاصيل الكتاب */}
        <section className="book-details-tabs">
          <div className="tabs-header">
            <button 
              className={`tab ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              الوصف
            </button>
            <button 
              className={`tab ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              التفاصيل
            </button>
            <button 
              className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              التقييمات
            </button>
          </div>
          
          <div className="tabs-content">
            {activeTab === 'description' && (
              <div className="tab-panel">
                <h3>وصف الكتاب</h3>
                <p>{book.description}</p>
                
                <div className="book-features">
                  <h4>مميزات الكتاب:</h4>
                  <ul>
                    <li>حالة جيدة جداً</li>
                    <li>غير مكتوب فيه</li>
                    <li>غلاف أصلي</li>
                    <li>توصيل متاح داخل المدينة</li>
                  </ul>
                </div>
              </div>
            )}
            
            {activeTab === 'details' && (
              <div className="tab-panel">
                <h3>تفاصيل الكتاب</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">العنوان:</span>
                    <span className="detail-value">{book.title}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">المؤلف:</span>
                    <span className="detail-value">{book.author}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">التصنيف:</span>
                    <span className="detail-value">{book.category}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">الحالة:</span>
                    <span className="detail-value">{book.condition}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">نوع التبادل:</span>
                    <span className="detail-value">
                      {book.exchangeType === 'بيع' ? 'بيع' : 'تبادل'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">السعر:</span>
                    <span className="detail-value">{book.price} ر.س</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">المكان:</span>
                    <span className="detail-value">{book.location}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">تاريخ النشر:</span>
                    <span className="detail-value">{book.createdAt}</span>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div className="tab-panel">
                <ReviewSection bookId={book.id} />
              </div>
            )}
          </div>
        </section>

        {/* كتب مشابهة */}
        <section className="similar-books-section">
          <SimilarBooks currentBook={book} />
        </section>
      </div>
    </div>
  );
};

export default BookDetails;

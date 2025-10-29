// pages/Home/Home.js - الصفحة الرئيسية
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBookContext } from '../../contexts/BookContext';
import { useAuthContext } from '../../contexts/AuthContext';
import SearchBar from '../../components/SearchBar/SearchBar';
import BookCard from '../../components/BookCard/BookCard';
import CategoryCard from '../../components/CategoryCard/CategoryCard';
import './Home.css';

const Home = () => {
  const { 
    books, 
    categories, 
    recentlyViewed, 
    wishlist,
    loading 
  } = useBookContext();
  
  const { user } = useAuthContext();
  
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [newBooks, setNewBooks] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);

  useEffect(() => {
    // تحديد الكتب المميزة (بناءً على الإعجابات والمشاهدات)
    const featured = [...books]
      .sort((a, b) => (b.likes + b.views) - (a.likes + a.views))
      .slice(0, 6);
    
    // أحدث الكتب
    const newBooksList = [...books]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 6);
    
    // الكتب الأكثر شيوعاً
    const popular = [...books]
      .sort((a, b) => b.views - a.views)
      .slice(0, 6);
    
    setFeaturedBooks(featured);
    setNewBooks(newBooksList);
    setPopularBooks(popular);
  }, [books]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>جاري تحميل المحتوى...</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* قسم الترحيب والبحث */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">منصة تبادل الكتب المستعملة</h1>
          <p className="hero-subtitle">
            اكتشف عالماً من المعرفة بأسعار معقولة. بيع واشترِ الكتب المستعملة بسهولة وأمان.
          </p>
          
          <SearchBar />
          
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">{books.length}+</span>
              <span className="stat-label">كتاب متاح</span>
            </div>
            <div className="stat">
              <span className="stat-number">{categories.length}+</span>
              <span className="stat-label">تصنيف</span>
            </div>
            <div className="stat">
              <span className="stat-number">1000+</span>
              <span className="stat-label">مستخدم نشط</span>
            </div>
          </div>
        </div>
        
        <div className="hero-image">
          <img src="/images/hero-books.png" alt="كتب متنوعة" />
        </div>
      </section>

      {/* التصنيفات */}
      <section className="categories-section">
        <div className="section-header">
          <h2>تصفح حسب التصنيف</h2>
          <Link to="/categories" className="view-all-link">عرض الكل</Link>
        </div>
        
        <div className="categories-grid">
          {categories.slice(0, 8).map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* الكتب المميزة */}
      <section className="featured-books-section">
        <div className="section-header">
          <h2>كتب مميزة</h2>
          <Link to="/books" className="view-all-link">عرض الكل</Link>
        </div>
        
        <div className="books-grid">
          {featuredBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* أحدث الإضافات */}
      <section className="new-books-section">
        <div className="section-header">
          <h2>أحدث الإضافات</h2>
          <Link to="/books?sort=newest" className="view-all-link">عرض الكل</Link>
        </div>
        
        <div className="books-grid">
          {newBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* الكتب الأكثر شيوعاً */}
      <section className="popular-books-section">
        <div className="section-header">
          <h2>الأكثر شيوعاً</h2>
          <Link to="/books?sort=popular" className="view-all-link">عرض الكل</Link>
        </div>
        
        <div className="books-grid">
          {popularBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* قسم للمستخدمين المسجلين */}
      {user && (
        <>
          {/* الكتب التي تم مشاهدتها مؤخراً */}
          {recentlyViewed.length > 0 && (
            <section className="recently-viewed-section">
              <div className="section-header">
                <h2>شاهدت مؤخراً</h2>
              </div>
              
              <div className="books-grid">
                {recentlyViewed.slice(0, 6).map(book => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </section>
          )}

          {/* قائمة الرغبات */}
          {wishlist.length > 0 && (
            <section className="wishlist-section">
              <div className="section-header">
                <h2>قائمة رغباتي</h2>
                <Link to="/profile?tab=wishlist" className="view-all-link">عرض الكل</Link>
              </div>
              
              <div className="books-grid">
                {wishlist.slice(0, 6).map(book => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* دعوة للعمل */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>هل لديك كتب لا تحتاجها؟</h2>
          <p>انشر كتبك على المنصة واجعلها تصل لمحبي القراءة</p>
          
          {user ? (
            <Link to="/add-book" className="cta-button">أضف كتاب الآن</Link>
          ) : (
            <Link to="/register" className="cta-button">سجل الآن وابدأ البيع</Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;

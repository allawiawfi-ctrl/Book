// components/Header/Header.js - شريط التنقل الرئيسي
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { useBookContext } from '../../contexts/BookContext';
import SearchBar from '../SearchBar/SearchBar';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuthContext();
  const { wishlist } = useBookContext();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  // إغلاق قائمة الملف الشخصي عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* الشعار */}
        <div className="logo-section">
          <Link to="/" className="logo">
            <span className="logo-icon">📚</span>
            <span className="logo-text">منصة الكتب</span>
          </Link>
        </div>

        {/* شريط البحث */}
        <div className="search-section">
          <SearchBar />
        </div>

        {/* روابط التنقل */}
        <nav className={`nav-section ${isMenuOpen ? 'active' : ''}`}>
          <Link 
            to="/" 
            className={`nav-link ${isActiveLink('/') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            الرئيسية
          </Link>
          <Link 
            to="/books" 
            className={`nav-link ${isActiveLink('/books') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            الكتب
          </Link>
          <Link 
            to="/categories" 
            className={`nav-link ${isActiveLink('/categories') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            التصنيفات
          </Link>
          <Link 
            to="/about" 
            className={`nav-link ${isActiveLink('/about') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            عن المنصة
          </Link>
        </nav>

        {/* إجراءات المستخدم */}
        <div className="user-actions">
          {user ? (
            <>
              {/* رابط إضافة كتاب */}
              <Link to="/add-book" className="add-book-link">
                <span className="icon">➕</span>
                <span className="text">أضف كتاب</span>
              </Link>

              {/* رابط الرسائل */}
              <Link to="/messages" className="messages-link">
                <span className="icon">💬</span>
                <span className="text">الرسائل</span>
              </Link>

              {/* رابط الإشعارات */}
              <Link to="/notifications" className="notifications-link">
                <span className="icon">🔔</span>
                <span className="text">الإشعارات</span>
              </Link>

              {/* رابط قائمة الرغبات */}
              <Link to="/profile?tab=wishlist" className="wishlist-link">
                <span className="icon">❤️</span>
                {wishlist.length > 0 && (
                  <span className="wishlist-count">{wishlist.length}</span>
                )}
              </Link>

              {/* صورة الملف الشخصي */}
              <div className="profile-menu" ref={profileMenuRef}>
                <button 
                  className="profile-toggle"
                  onClick={toggleProfileMenu}
                >
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="profile-avatar"
                  />
                  <span className="profile-name">{user.name}</span>
                  <span className="dropdown-arrow">▼</span>
                </button>

                {isProfileMenuOpen && (
                  <div className="profile-dropdown">
                    <Link 
                      to="/profile" 
                      className="dropdown-item"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <span className="icon">👤</span>
                      ملفي الشخصي
                    </Link>
                    <Link 
                      to="/my-books" 
                      className="dropdown-item"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <span className="icon">📖</span>
                      كتبي
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button 
                      className="dropdown-item logout-btn"
                      onClick={handleLogout}
                    >
                      <span className="icon">🚪</span>
                      تسجيل الخروج
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-btn">
                تسجيل الدخول
              </Link>
              <Link to="/register" className="register-btn">
                إنشاء حساب
              </Link>
            </div>
          )}

          {/* زر القائمة المتنقلة */}
          <button 
            className={`mobile-menu-toggle ${isMenuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* القائمة المتنقلة */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <nav className="mobile-nav">
            <Link 
              to="/" 
              className="mobile-nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              الرئيسية
            </Link>
            <Link 
              to="/books" 
              className="mobile-nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              الكتب
            </Link>
            <Link 
              to="/categories" 
              className="mobile-nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              التصنيفات
            </Link>
            <Link 
              to="/about" 
              className="mobile-nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              عن المنصة
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/add-book" 
                  className="mobile-nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  إضافة كتاب
                </Link>
                <Link 
                  to="/my-books" 
                  className="mobile-nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  كتبي
                </Link>
                <Link 
                  to="/messages" 
                  className="mobile-nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  الرسائل
                </Link>
                <Link 
                  to="/profile" 
                  className="mobile-nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ملفي الشخصي
                </Link>
                <button 
                  className="mobile-nav-link logout-btn"
                  onClick={handleLogout}
                >
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="mobile-nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  تسجيل الدخول
                </Link>
                <Link 
                  to="/register" 
                  className="mobile-nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  إنشاء حساب
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

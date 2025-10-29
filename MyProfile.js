// pages/MyProfile/MyProfile.js - صفحة الملف الشخصي
import React, { useState } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useBookContext } from '../../contexts/BookContext';
import ProfileInfo from '../../components/ProfileInfo/ProfileInfo';
import ProfileStats from '../../components/ProfileStats/ProfileStats';
import ActivityHistory from '../../components/ActivityHistory/ActivityHistory';
import Wishlist from '../../components/Wishlist/Wishlist';
import './MyProfile.css';

const MyProfile = () => {
  const { user, updateProfile } = useAuthContext();
  const { userBooks, wishlist, recentlyViewed } = useBookContext();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdateProfile = async (updatedData) => {
    try {
      await updateProfile(updatedData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const getProfileStats = () => {
    return {
      totalBooks: userBooks.length,
      availableBooks: userBooks.filter(book => book.status === 'متاح').length,
      soldBooks: userBooks.filter(book => book.status === 'مباع').length,
      wishlistCount: wishlist.length,
      totalViews: userBooks.reduce((sum, book) => sum + book.views, 0),
      totalLikes: userBooks.reduce((sum, book) => sum + book.likes, 0)
    };
  };

  const profileStats = getProfileStats();

  return (
    <div className="my-profile-page">
      <div className="page-header">
        <h1>ملفي الشخصي</h1>
        <p>إدارة معلومات حسابك وأنشطتك على المنصة</p>
      </div>

      <div className="profile-content">
        {/* شريط التنقل بين الأقسام */}
        <div className="profile-tabs">
          <button 
            className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            المعلومات الشخصية
          </button>
          <button 
            className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            الإحصائيات
          </button>
          <button 
            className={`tab ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            سجل النشاط
          </button>
          <button 
            className={`tab ${activeTab === 'wishlist' ? 'active' : ''}`}
            onClick={() => setActiveTab('wishlist')}
          >
            قائمة الرغبات
          </button>
          <button 
            className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            الإعدادات
          </button>
        </div>

        {/* محتوى الأقسام */}
        <div className="tab-content">
          {activeTab === 'profile' && (
            <div className="tab-panel">
              <ProfileInfo 
                user={user}
                isEditing={isEditing}
                onEditToggle={() => setIsEditing(!isEditing)}
                onUpdateProfile={handleUpdateProfile}
              />
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="tab-panel">
              <ProfileStats stats={profileStats} />
              
              {/* رسوم بيانية بسيطة للإحصائيات */}
              <div className="stats-charts">
                <div className="chart-section">
                  <h3>نظرة عامة على كتبك</h3>
                  <div className="books-stats-chart">
                    <div className="chart-bar available" style={{width: `${(profileStats.availableBooks / profileStats.totalBooks) * 100}%`}}>
                      <span>متاحة ({profileStats.availableBooks})</span>
                    </div>
                    <div className="chart-bar sold" style={{width: `${(profileStats.soldBooks / profileStats.totalBooks) * 100}%`}}>
                      <span>مباعة ({profileStats.soldBooks})</span>
                    </div>
                  </div>
                </div>
                
                <div className="engagement-stats">
                  <div className="engagement-item">
                    <span className="engagement-value">{profileStats.totalViews}</span>
                    <span className="engagement-label">إجمالي المشاهدات</span>
                  </div>
                  <div className="engagement-item">
                    <span className="engagement-value">{profileStats.totalLikes}</span>
                    <span className="engagement-label">إجمالي الإعجابات</span>
                  </div>
                  <div className="engagement-item">
                    <span className="engagement-value">{profileStats.wishlistCount}</span>
                    <span className="engagement-label">في قوائم الرغبات</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="tab-panel">
              <ActivityHistory 
                userBooks={userBooks}
                recentlyViewed={recentlyViewed}
                wishlist={wishlist}
              />
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="tab-panel">
              <Wishlist books={wishlist} />
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="tab-panel">
              <div className="settings-section">
                <h3>إعدادات الإشعارات</h3>
                <div className="setting-item">
                  <label>
                    <input type="checkbox" defaultChecked />
                    <span>إشعارات الرسائل</span>
                  </label>
                </div>
                <div className="setting-item">
                  <label>
                    <input type="checkbox" defaultChecked />
                    <span>إشعارات عند بيع الكتب</span>
                  </label>
                </div>
                <div className="setting-item">
                  <label>
                    <input type="checkbox" />
                    <span>النشرة الإخبارية</span>
                  </label>
                </div>
              </div>
              
              <div className="settings-section">
                <h3>إعدادات الخصوصية</h3>
                <div className="setting-item">
                  <label>
                    <input type="checkbox" defaultChecked />
                    <span>إظهار ملفي الشخصي للعامة</span>
                  </label>
                </div>
                <div className="setting-item">
                  <label>
                    <input type="checkbox" />
                    <span>إظهار البريد الإلكتروني</span>
                  </label>
                </div>
              </div>
              
              <div className="settings-section">
                <h3>إعدادات الحساب</h3>
                <button className="change-password-btn">تغيير كلمة المرور</button>
                <button className="delete-account-btn">حذف الحساب</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;

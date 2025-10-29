// contexts/AuthContext.js - سياق المصادقة
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // تحميل بيانات المستخدم من التخزين المحلي
  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const savedUser = localStorage.getItem('bookExchangeUser');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  // تسجيل الدخول
  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    
    try {
      // محاكاة طلب تسجيل الدخول
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // في التطبيق الحقيقي، هنا سيتم الاتصال بالخادم
      if (email === 'demo@example.com' && password === 'password') {
        const userData = {
          id: 1,
          name: 'أحمد محمد',
          email: 'demo@example.com',
          avatar: '/images/avatar1.jpg',
          location: 'الرياض',
          joinDate: '2023-01-15',
          rating: 4.8,
          phone: '+966500000000'
        };
        
        setUser(userData);
        localStorage.setItem('bookExchangeUser', JSON.stringify(userData));
        return { success: true };
      } else {
        throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      }
    } catch (error) {
      setAuthError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // التسجيل
  const register = async (userData) => {
    setLoading(true);
    setAuthError(null);
    
    try {
      // محاكاة طلب التسجيل
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newUser = {
        id: Date.now(),
        ...userData,
        joinDate: new Date().toISOString().split('T')[0],
        rating: 5.0,
        avatar: '/images/default-avatar.jpg'
      };
      
      setUser(newUser);
      localStorage.setItem('bookExchangeUser', JSON.stringify(newUser));
      return { success: true };
    } catch (error) {
      setAuthError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // تسجيل الخروج
  const logout = () => {
    setUser(null);
    localStorage.removeItem('bookExchangeUser');
  };

  // تحديث الملف الشخصي
  const updateProfile = async (updatedData) => {
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedUser = { ...user, ...updatedData };
      setUser(updatedUser);
      localStorage.setItem('bookExchangeUser', JSON.stringify(updatedUser));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    authError,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

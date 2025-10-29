// src/pages/Auth/Login.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [securityCode, setSecurityCode] = useState('');
  const [showSecurityCode, setShowSecurityCode] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTime, setLockTime] = useState(0);
  
  const { login, loading, authError } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    // تحميل البيانات المحفوظة
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail, rememberMe: true }));
    }

    // التحقق من حالة القفل
    const lockUntil = localStorage.getItem('loginLockUntil');
    if (lockUntil && new Date().getTime() < parseInt(lockUntil)) {
      setIsLocked(true);
      setLockTime(Math.ceil((parseInt(lockUntil) - new Date().getTime()) / 1000));
    }
  }, []);

  useEffect(() => {
    let timer;
    if (isLocked && lockTime > 0) {
      timer = setInterval(() => {
        setLockTime(prev => {
          if (prev <= 1) {
            setIsLocked(false);
            localStorage.removeItem('loginLockUntil');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLocked, lockTime]);

  const generateSecurityCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    return code;
  };

  const validateForm = () => {
    const newErrors = {};

    // التحقق من البريد الإلكتروني
    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صالح';
    }

    // التحقق من كلمة المرور
    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (formData.password.length < 6) {
      newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }

    // التحقق من رمز الأمان إذا مطلوب
    if (showSecurityCode && !securityCode) {
      newErrors.securityCode = 'رمز الأمان مطلوب';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // مسح الخطأ عند الكتابة
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSecurityCodeChange = (e) => {
    setSecurityCode(e.target.value);
    if (errors.securityCode) {
      setErrors(prev => ({ ...prev, securityCode: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLocked) {
      setErrors({ submit: `الحساب مؤقتاً مغلق. يرجى الانتظار ${lockTime} ثانية` });
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    // توليد رمز أمان بعد محاولات متعددة
    if (loginAttempts >= 2) {
      const code = generateSecurityCode();
      setShowSecurityCode(true);
      setErrors({ securityCode: `يرجى إدخال رمز الأمان: ${code}` });
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        if (formData.rememberMe) {
          localStorage.setItem('rememberedEmail', formData.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        // إعادة تعيين عداد المحاولات
        setLoginAttempts(0);
        localStorage.removeItem('loginAttempts');
        localStorage.removeItem('loginLockUntil');

        // التوجيه للصفحة السابقة أو الرئيسية
        navigate(from, { replace: true });
      } else {
        // زيادة عداد المحاولات الفاشلة
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        localStorage.setItem('loginAttempts', newAttempts.toString());

        // قفل الحساب بعد 5 محاولات فاشلة
        if (newAttempts >= 5) {
          const lockUntil = new Date().getTime() + 15 * 60 * 1000; // 15 دقيقة
          localStorage.setItem('loginLockUntil', lockUntil.toString());
          setIsLocked(true);
          setLockTime(15 * 60);
          setErrors({ submit: 'تم قفل الحساب مؤقتاً بسبب محاولات تسجيل دخول فاشلة متعددة. يرجى المحاولة بعد 15 دقيقة.' });
        } else {
          setErrors({ submit: result.error });
        }
      }
    } catch (error) {
      setErrors({ submit: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = (provider) => {
    // محاكاة تسجيل الدخول عبر وسائل التواصل الاجتماعي
    setErrors({ submit: `تسجيل الدخول عبر ${provider} غير متاح حالياً` });
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const handleResendCode = () => {
    const code = generateSecurityCode();
    setErrors({ securityCode: `تم إرسال رمز جديد: ${code}` });
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-background-overlay"></div>
        <div className="auth-background-content">
          <h2>مرحباً بعودتك!</h2>
          <p>استمر في رحلتك مع الكتب واستكشف عالماً من المعرفة</p>
          <div className="auth-features">
            <div className="feature">
              <span className="feature-icon">📚</span>
              <span>الوصول إلى آلاف الكتب</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🤝</span>
              <span>تبادل الكتب مع المجتمع</span>
            </div>
            <div className="feature">
              <span className="feature-icon">⭐</span>
              <span>تقييمات وتوصيات</span>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-form-container">
        <div className="auth-form-wrapper">
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <span className="logo-icon">📚</span>
              <span className="logo-text">منصة الكتب</span>
            </Link>
            <h1>تسجيل الدخول</h1>
            <p>ادخل إلى حسابك للمتابعة</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {isLocked && (
              <div className="lock-message">
                <div className="lock-icon">🔒</div>
                <h3>الحساب مؤقتاً مغلق</h3>
                <p>لقد تجاوزت عدد المحاولات المسموح بها. يرجى الانتظار:</p>
                <div className="lock-timer">{formatTime(lockTime)}</div>
                <p>قبل المحاولة مرة أخرى</p>
              </div>
            )}

            {!isLocked && (
              <>
                {/* حقل البريد الإلكتروني */}
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    البريد الإلكتروني
                  </label>
                  <div className="input-with-icon">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`form-control ${errors.email ? 'error' : ''}`}
                      placeholder="ادخل بريدك الإلكتروني"
                      disabled={isSubmitting}
                      autoComplete="email"
                    />
                    <span className="input-icon">📧</span>
                  </div>
                  {errors.email && <div className="error-message">{errors.email}</div>}
                </div>

                {/* حقل كلمة المرور */}
                <div className="form-group">
                  <div className="password-label-container">
                    <label htmlFor="password" className="form-label">
                      كلمة المرور
                    </label>
                    <button
                      type="button"
                      className="forgot-password-link"
                      onClick={handleForgotPassword}
                    >
                      نسيت كلمة المرور؟
                    </button>
                  </div>
                  <div className="input-with-icon">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`form-control ${errors.password ? 'error' : ''}`}
                      placeholder="ادخل كلمة المرور"
                      disabled={isSubmitting}
                      autoComplete="current-password"
                    />
                    <span className="input-icon">🔒</span>
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {errors.password && <div className="error-message">{errors.password}</div>}
                </div>

                {/* رمز الأمان */}
                {showSecurityCode && (
                  <div className="form-group">
                    <label htmlFor="securityCode" className="form-label">
                      رمز الأمان
                    </label>
                    <div className="security-code-container">
                      <input
                        type="text"
                        id="securityCode"
                        name="securityCode"
                        value={securityCode}
                        onChange={handleSecurityCodeChange}
                        className={`form-control ${errors.securityCode ? 'error' : ''}`}
                        placeholder="ادخل رمز الأمان"
                        disabled={isSubmitting}
                        maxLength={6}
                      />
                      <button
                        type="button"
                        className="resend-code-btn"
                        onClick={handleResendCode}
                        disabled={isSubmitting}
                      >
                        إعادة الإرسال
                      </button>
                    </div>
                    {errors.securityCode && (
                      <div className={`security-code-message ${errors.securityCode.includes('يرجى إدخال') ? 'info' : 'error'}`}>
                        {errors.securityCode}
                      </div>
                    )}
                  </div>
                )}

                {/* تذكرني */}
                <div className="form-group remember-me-container">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                    <span className="checkmark"></span>
                    تذكرني
                  </label>
                </div>

                {/* رسائل الخطأ */}
                {errors.submit && (
                  <div className="submit-error">
                    <span className="error-icon">⚠️</span>
                    {errors.submit}
                  </div>
                )}

                {authError && (
                  <div className="submit-error">
                    <span className="error-icon">⚠️</span>
                    {authError}
                  </div>
                )}

                {/* زر التسجيل */}
                <button
                  type="submit"
                  className="auth-submit-btn"
                  disabled={isSubmitting || loading}
                >
                  {isSubmitting || loading ? (
                    <>
                      <div className="spinner"></div>
                      جاري تسجيل الدخول...
                    </>
                  ) : (
                    'تسجيل الدخول'
                  )}
                </button>

                {/* تسجيل الدخول الاجتماعي */}
                <div className="social-login-section">
                  <div className="divider">
                    <span>أو</span>
                  </div>

                  <div className="social-buttons">
                    <button
                      type="button"
                      className="social-btn google-btn"
                      onClick={() => handleSocialLogin('Google')}
                      disabled={isSubmitting}
                    >
                      <span className="social-icon">🔍</span>
                      <span>متابعة مع Google</span>
                    </button>

                    <button
                      type="button"
                      className="social-btn facebook-btn"
                      onClick={() => handleSocialLogin('Facebook')}
                      disabled={isSubmitting}
                    >
                      <span className="social-icon">📘</span>
                      <span>متابعة مع Facebook</span>
                    </button>

                    <button
                      type="button"
                      className="social-btn twitter-btn"
                      onClick={() => handleSocialLogin('Twitter')}
                      disabled={isSubmitting}
                    >
                      <span className="social-icon">🐦</span>
                      <span>متابعة مع Twitter</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </form>

          {/* رابط التسجيل */}
          <div className="auth-footer">
            <p>
              ليس لديك حساب؟{' '}
              <Link to="/register" className="auth-link">
                إنشاء حساب جديد
              </Link>
            </p>
          </div>

          {/* معلومات أمان */}
          <div className="security-info">
            <div className="security-item">
              <span className="security-icon">🔒</span>
              <span>بياناتك محمية ومشفرة</span>
            </div>
            <div className="security-item">
              <span className="security-icon">👁️</span>
              <span>نحن لا نشارك بياناتك مع أحد</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

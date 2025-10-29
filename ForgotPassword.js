// src/pages/Auth/ForgotPassword.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('البريد الإلكتروني مطلوب');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('البريد الإلكتروني غير صالح');
      return;
    }

    setIsSubmitting(true);
    setError('');

    // محاكاة إرسال بريد إلكتروني
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 2000);
  };

  const handleReset = () => {
    setEmail('');
    setIsSubmitted(false);
    setError('');
  };

  if (isSubmitted) {
    return (
      <div className="auth-container">
        <div className="auth-form-container">
          <div className="auth-form-wrapper">
            <div className="auth-header">
              <Link to="/" className="auth-logo">
                <span className="logo-icon">📚</span>
                <span className="logo-text">منصة الكتب</span>
              </Link>
              <h1>تحقق من بريدك</h1>
            </div>

            <div className="success-message">
              <div className="success-icon">✅</div>
              <h3>تم إرسال رابط إعادة التعيين</h3>
              <p>
                لقد أرسلنا رابط إعادة تعيين كلمة المرور إلى:
                <strong> {email}</strong>
              </p>
              <p>يرجى التحقق من بريدك الإلكتروني ومتابعة التعليمات.</p>
              
              <div className="success-actions">
                <button
                  type="button"
                  className="auth-submit-btn"
                  onClick={handleReset}
                >
                  إعادة تعيين كلمة مرور أخرى
                </button>
                <Link to="/login" className="auth-link-button">
                  العودة لتسجيل الدخول
                </Link>
              </div>

              <div className="email-note">
                <p>إذا لم تستلم البريد الإلكتروني:</p>
                <ul>
                  <li>تحقق من مجلد البريد العشوائي (Spam)</li>
                  <li>تأكد من صحة عنوان البريد الإلكتروني</li>
                  <li>انتظر بضع دقائق</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <div className="auth-form-wrapper">
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <span className="logo-icon">📚</span>
              <span className="logo-text">منصة الكتب</span>
            </Link>
            <h1>نسيت كلمة المرور</h1>
            <p>أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                البريد الإلكتروني
              </label>
              <div className="input-with-icon">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`form-control ${error ? 'error' : ''}`}
                  placeholder="ادخل بريدك الإلكتروني المسجل"
                  disabled={isSubmitting}
                />
                <span className="input-icon">📧</span>
              </div>
              {error && <div className="error-message">{error}</div>}
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner"></div>
                  جاري الإرسال...
                </>
              ) : (
                'إرسال رابط التعيين'
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              تذكرت كلمة المرور؟{' '}
              <Link to="/login" className="auth-link">
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

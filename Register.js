// src/pages/Auth/Register.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    newsletter: true
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: []
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const { register, loading, authError } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const calculatePasswordStrength = (password) => {
    let score = 0;
    const feedback = [];

    if (password.length >= 8) score += 1;
    else feedback.push('8 أحرف على الأقل');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('حرف كبير واحد على الأقل');

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('حرف صغير واحد على الأقل');

    if (/[0-9]/.test(password)) score += 1;
    else feedback.push('رقم واحد على الأقل');

    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    else feedback.push('رمز خاص واحد على الأقل');

    return { score, feedback };
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'الاسم الأول مطلوب';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'الاسم الأول يجب أن يكون حرفين على الأقل';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'اسم العائلة مطلوب';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'اسم العائلة يجب أن يكون حرفين على الأقل';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صالح';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'رقم الهاتف غير صالح';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (formData.password.length < 6) {
      newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    } else if (passwordStrength.score < 3) {
      newErrors.password = 'كلمة المرور ضعيفة جداً';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'تأكيد كلمة المرور مطلوب';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'كلمات المرور غير متطابقة';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'يجب الموافقة على الشروط والأحكام';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    if (currentStep === 1) return validateStep1();
    if (currentStep === 2) return validateStep2();
    return true;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // حساب قوة كلمة المرور
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    // مسح الخطأ عند الكتابة
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  const sendVerificationCode = () => {
    // محاكاة إرسال رمز التحقق
    setCountdown(60);
    setShowVerification(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!showVerification) {
      sendVerificationCode();
      return;
    }

    if (!verificationCode) {
      setErrors({ verificationCode: 'رمز التحقق مطلوب' });
      return;
    }

    setIsSubmitting(true);

    try {
      const userData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        newsletter: formData.newsletter
      };

      const result = await register(userData);
      
      if (result.success) {
        navigate('/', { replace: true });
      } else {
        setErrors({ submit: result.error });
      }
    } catch (error) {
      setErrors({ submit: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = () => {
    if (countdown === 0) {
      sendVerificationCode();
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score <= 1) return '#ff4d4f';
    if (passwordStrength.score <= 3) return '#faad14';
    return '#52c41a';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength.score <= 1) return 'ضعيفة جداً';
    if (passwordStrength.score <= 2) return 'ضعيفة';
    if (passwordStrength.score <= 3) return 'جيدة';
    if (passwordStrength.score <= 4) return 'قوية';
    return 'قوية جداً';
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-background-overlay"></div>
        <div className="auth-background-content">
          <h2>انضم إلى مجتمعنا</h2>
          <p>اكتشف عالماً من المعرفة وتبادل الكتب مع آلاف القراء</p>
          <div className="auth-features">
            <div className="feature">
              <span className="feature-icon">📖</span>
              <span>الوصول إلى آلاف الكتب</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🤝</span>
              <span>بيع وتبادل الكتب</span>
            </div>
            <div className="feature">
              <span className="feature-icon">⭐</span>
              <span>بناء مكتبتك الشخصية</span>
            </div>
            <div className="feature">
              <span className="feature-icon">👥</span>
              <span>مجتمع من محبي القراءة</span>
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
            <h1>إنشاء حساب جديد</h1>
            <p>املأ المعلومات لإنشاء حسابك</p>
            
            {/* شريط التقدم */}
            <div className="progress-bar">
              <div className="progress-steps">
                <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                  <span className="step-number">1</span>
                  <span className="step-label">المعلومات الشخصية</span>
                </div>
                <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                  <span className="step-number">2</span>
                  <span className="step-label">كلمة المرور</span>
                </div>
                <div className={`step ${showVerification ? 'active' : ''}`}>
                  <span className="step-number">3</span>
                  <span className="step-label">التحقق</span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {/* الخطوة 1: المعلومات الشخصية */}
            {currentStep === 1 && (
              <div className="form-step">
                <div className="name-fields">
                  <div className="form-group">
                    <label htmlFor="firstName" className="form-label">
                      الاسم الأول
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`form-control ${errors.firstName ? 'error' : ''}`}
                      placeholder="ادخل اسمك الأول"
                      disabled={isSubmitting}
                    />
                    {errors.firstName && <div className="error-message">{errors.firstName}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName" className="form-label">
                      اسم العائلة
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`form-control ${errors.lastName ? 'error' : ''}`}
                      placeholder="ادخل اسم العائلة"
                      disabled={isSubmitting}
                    />
                    {errors.lastName && <div className="error-message">{errors.lastName}</div>}
                  </div>
                </div>

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
                    />
                    <span className="input-icon">📧</span>
                  </div>
                  {errors.email && <div className="error-message">{errors.email}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone" className="form-label">
                    رقم الهاتف
                  </label>
                  <div className="input-with-icon">
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`form-control ${errors.phone ? 'error' : ''}`}
                      placeholder="ادخل رقم هاتفك"
                      disabled={isSubmitting}
                    />
                    <span className="input-icon">📱</span>
                  </div>
                  {errors.phone && <div className="error-message">{errors.phone}</div>}
                </div>

                <button
                  type="button"
                  className="auth-next-btn"
                  onClick={handleNextStep}
                  disabled={isSubmitting}
                >
                  التالي
                </button>
              </div>
            )}

            {/* الخطوة 2: كلمة المرور */}
            {currentStep === 2 && (
              <div className="form-step">
                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    كلمة المرور
                  </label>
                  <div className="input-with-icon">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`form-control ${errors.password ? 'error' : ''}`}
                      placeholder="أنشئ كلمة مرور قوية"
                      disabled={isSubmitting}
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
                  
                  {/* مؤشر قوة كلمة المرور */}
                  {formData.password && (
                    <div className="password-strength">
                      <div className="strength-bar">
                        <div 
                          className="strength-fill"
                          style={{
                            width: `${(passwordStrength.score / 5) * 100}%`,
                            backgroundColor: getPasswordStrengthColor()
                          }}
                        ></div>
                      </div>
                      <div className="strength-info">
                        <span>قوة كلمة المرور: </span>
                        <span style={{ color: getPasswordStrengthColor() }}>
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                      {passwordStrength.feedback.length > 0 && (
                        <div className="password-feedback">
                          {passwordStrength.feedback.map((item, index) => (
                            <div key={index} className="feedback-item">
                              <span>• {item}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {errors.password && <div className="error-message">{errors.password}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    تأكيد كلمة المرور
                  </label>
                  <div className="input-with-icon">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
                      placeholder="أعد إدخال كلمة المرور"
                      disabled={isSubmitting}
                    />
                    <span className="input-icon">🔒</span>
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                    <span className="checkmark"></span>
                    أوافق على <Link to="/terms" className="inline-link">الشروط والأحكام</Link> و <Link to="/privacy" className="inline-link">سياسة الخصوصية</Link>
                  </label>
                  {errors.agreeToTerms && <div className="error-message">{errors.agreeToTerms}</div>}
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="newsletter"
                      checked={formData.newsletter}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                    <span className="checkmark"></span>
                    أرغب في تلقي النشرة الإخبارية والعروض الخاصة
                  </label>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="auth-prev-btn"
                    onClick={handlePrevStep}
                    disabled={isSubmitting}
                  >
                    السابق
                  </button>
                  <button
                    type="submit"
                    className="auth-submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="spinner"></div>
                        جاري إنشاء الحساب...
                      </>
                    ) : (
                      'إنشاء الحساب'
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* الخطوة 3: التحقق */}
            {showVerification && (
              <div className="form-step">
                <div className="verification-header">
                  <div className="verification-icon">📧</div>
                  <h3>التحقق من البريد الإلكتروني</h3>
                  <p>لقد أرسلنا رمز تحقق إلى بريدك الإلكتروني</p>
                  <p className="email-address">{formData.email}</p>
                </div>

                <div className="form-group">
                  <label htmlFor="verificationCode" className="form-label">
                    رمز التحقق
                  </label>
                  <input
                    type="text"
                    id="verificationCode"
                    name="verificationCode"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className={`form-control ${errors.verificationCode ? 'error' : ''}`}
                    placeholder="ادخل رمز التحقق المكون من 6 أرقام"
                    maxLength={6}
                    disabled={isSubmitting}
                  />
                  {errors.verificationCode && <div className="error-message">{errors.verificationCode}</div>}
                </div>

                <div className="verification-actions">
                  <button
                    type="button"
                    className="resend-code-btn"
                    onClick={handleResendCode}
                    disabled={countdown > 0 || isSubmitting}
                  >
                    {countdown > 0 ? `إعادة الإرسال (${countdown})` : 'إعادة إرسال الرمز'}
                  </button>
                  
                  <button
                    type="submit"
                    className="auth-submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="spinner"></div>
                        جاري التحقق...
                      </>
                    ) : (
                      'تحقق وإنشاء الحساب'
                    )}
                  </button>
                </div>

                <div className="verification-note">
                  <p>إذا لم تستلم الرمز، تأكد من مجلد البريد العشوائي (Spam)</p>
                </div>
              </div>
            )}

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
          </form>

          {/* رابط تسجيل الدخول */}
          <div className="auth-footer">
            <p>
              لديك حساب بالفعل؟{' '}
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

export default Register;

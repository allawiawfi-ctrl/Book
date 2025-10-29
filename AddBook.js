// pages/AddBook/AddBook.js - صفحة إضافة كتاب جديد
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookContext } from '../../contexts/BookContext';
import { useAuthContext } from '../../contexts/AuthContext';
import BookForm from '../../components/BookForm/BookForm';
import './AddBook.css';

const AddBook = () => {
  const { addBook } = useBookContext();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (bookData) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // إضافة معلومات البائع
      const bookWithSeller = {
        ...bookData,
        seller: {
          id: user.id,
          name: user.name,
          rating: user.rating || 5.0,
          location: user.location || 'غير محدد'
        }
      };
      
      // إضافة الكتاب
      const newBook = addBook(bookWithSeller);
      
      setSubmitStatus({
        type: 'success',
        message: 'تم إضافة الكتاب بنجاح! سيتم مراجعته قبل النشر.'
      });
      
      // الانتقال لصفحة تفاصيل الكتاب بعد ثانيتين
      setTimeout(() => {
        navigate(`/books/${newBook.id}`);
      }, 2000);
      
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'حدث خطأ أثناء إضافة الكتاب. يرجى المحاولة مرة أخرى.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-book-page">
      <div className="page-header">
        <h1>إضافة كتاب جديد</h1>
        <p>انشر كتابك على المنصة ليصل لمحبي القراءة</p>
      </div>
      
      <div className="add-book-content">
        <div className="form-container">
          <BookForm 
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitButtonText="نشر الكتاب"
          />
          
          {submitStatus && (
            <div className={`submit-status ${submitStatus.type}`}>
              {submitStatus.message}
            </div>
          )}
        </div>
        
        <div className="form-guidelines">
          <div className="guidelines-card">
            <h3>نصائح لإضافة كتاب ناجح</h3>
            <ul>
              <li>التقاط صور واضحة وجيدة الإضاءة للكتاب</li>
              <li>وصف دقيق لحالة الكتاب (جديد، جيد جداً، جيد، مقبول)</li>
              <li>تحديد سعر مناسب مقارنة بالسعر الأصلي وحالة الكتاب</li>
              <li>كتابة وصف شامل للكتاب يوضح محتواه وفائدته</li>
              <li>اختيار التصنيف المناسب للكتاب</li>
            </ul>
          </div>
          
          <div className="guidelines-card">
            <h3>شروط النشر</h3>
            <ul>
              <li>يجب أن يكون الكتاب أصلياً وليس نسخة مقلدة</li>
              <li>ممنوع نشر الكتب المخالفة للأنظمة أو ذات المحتوى غير الأخلاقي</li>
              <li>يجب أن تكون حالة الكتاب كما هو موضح في الوصف</li>
              <li>الالتزام بالدقة في وصف حالة الكتاب وسعره</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBook;

// pages/Books/Books.js - صفحة عرض جميع الكتب
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useBookContext } from '../../contexts/BookContext';
import BookCard from '../../components/BookCard/BookCard';
import FilterSidebar from '../../components/FilterSidebar/FilterSidebar';
import SortDropdown from '../../components/SortDropdown/SortDropdown';
import Pagination from '../../components/Pagination/Pagination';
import './Books.css';

const Books = () => {
  const { books, loading, filters, setFilters, searchBooks, searchResults } = useBookContext();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [displayedBooks, setDisplayedBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(12);
  const [showFilters, setShowFilters] = useState(false);

  // معالجة معاملات البحث من URL
  useEffect(() => {
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const sort = searchParams.get('sort') || 'newest';
    
    if (query || category) {
      searchBooks(query, { ...filters, category, sortBy: sort });
    }
  }, [searchParams, filters, searchBooks]);

  // تحديث الكتب المعروضة
  useEffect(() => {
    const booksToDisplay = searchResults.length > 0 ? searchResults : books;
    setDisplayedBooks(booksToDisplay);
  }, [books, searchResults]);

  // تطبيق الفلاتر والترتيب
  useEffect(() => {
    let filteredBooks = [...displayedBooks];
    
    // تطبيق الفلاتر
    if (filters.category) {
      filteredBooks = filteredBooks.filter(book => book.category === filters.category);
    }
    
    if (filters.condition) {
      filteredBooks = filteredBooks.filter(book => book.condition === filters.condition);
    }
    
    if (filters.location) {
      filteredBooks = filteredBooks.filter(book => 
        book.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    if (filters.priceRange) {
      filteredBooks = filteredBooks.filter(book => 
        book.price >= filters.priceRange.min && book.price <= filters.priceRange.max
      );
    }
    
    // تطبيق الترتيب
    if (filters.sortBy === 'price-low') {
      filteredBooks.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price-high') {
      filteredBooks.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'newest') {
      filteredBooks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (filters.sortBy === 'popular') {
      filteredBooks.sort((a, b) => b.views - a.views);
    }
    
    setDisplayedBooks(filteredBooks);
    setCurrentPage(1); // العودة للصفحة الأولى عند تغيير الفلاتر
  }, [filters, displayedBooks]);

  // الحصول على الكتب الحالية للصفحة
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = displayedBooks.slice(indexOfFirstBook, indexOfLastBook);

  // تغيير الصفحة
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // تطبيق الفلاتر
  const applyFilters = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  // مسح الفلاتر
  const clearFilters = () => {
    setFilters({
      category: '',
      condition: '',
      location: '',
      priceRange: { min: 0, max: 1000 },
      sortBy: 'newest'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>جاري تحميل الكتب...</p>
      </div>
    );
  }

  return (
    <div className="books-page">
      <div className="books-header">
        <h1>جميع الكتب</h1>
        <p>اكتشف مجموعة واسعة من الكتب المستعملة بأسعار مناسبة</p>
        
        <div className="books-controls">
          <button 
            className={`filter-toggle ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'إخفاء الفلاتر' : 'عرض الفلاتر'}
          </button>
          
          <SortDropdown 
            sortBy={filters.sortBy}
            onSortChange={(sortBy) => setFilters({ ...filters, sortBy })}
          />
        </div>
      </div>

      <div className="books-content">
        {/* شريط الفلاتر */}
        {showFilters && (
          <div className="filters-sidebar-mobile">
            <FilterSidebar 
              filters={filters}
              onFilterChange={applyFilters}
              onClearFilters={clearFilters}
            />
          </div>
        )}
        
        <div className="books-layout">
          {/* شريط الفلاتر (لشاشات الكمبيوتر) */}
          <aside className="filters-sidebar">
            <FilterSidebar 
              filters={filters}
              onFilterChange={applyFilters}
              onClearFilters={clearFilters}
            />
          </aside>

          {/* قائمة الكتب */}
          <main className="books-list">
            <div className="books-info">
              <p>عرض {currentBooks.length} من {displayedBooks.length} كتاب</p>
            </div>
            
            {currentBooks.length > 0 ? (
              <>
                <div className="books-grid">
                  {currentBooks.map(book => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
                
                <Pagination 
                  booksPerPage={booksPerPage}
                  totalBooks={displayedBooks.length}
                  currentPage={currentPage}
                  paginate={paginate}
                />
              </>
            ) : (
              <div className="no-books">
                <img src="/images/no-books.svg" alt="لا توجد كتب" />
                <h3>لا توجد كتب تطابق معايير البحث</h3>
                <p>جرب تعديل الفلاتر أو البحث عن شيء آخر</p>
                <button onClick={clearFilters} className="clear-filters-btn">
                  مسح جميع الفلاتر
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Books;

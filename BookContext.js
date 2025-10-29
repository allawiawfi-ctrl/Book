// contexts/BookContext.js - سياق إدارة الكتب
import React, { createContext, useState, useContext, useEffect } from 'react';

const BookContext = createContext();

export const useBookContext = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBookContext must be used within a BookProvider');
  }
  return context;
};

export const BookProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [userBooks, setUserBooks] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    condition: '',
    location: '',
    priceRange: { min: 0, max: 1000 },
    sortBy: 'newest'
  });

  // تحميل البيانات الأولية
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        // محاكاة جلب البيانات من API
        const booksData = await fetchBooks();
        const categoriesData = await fetchCategories();
        
        setBooks(booksData);
        setCategories(categoriesData);
        
        // تحميل الكتب المحفوظة محلياً
        const savedUserBooks = localStorage.getItem('userBooks');
        const savedWishlist = localStorage.getItem('wishlist');
        const savedRecentlyViewed = localStorage.getItem('recentlyViewed');
        
        if (savedUserBooks) setUserBooks(JSON.parse(savedUserBooks));
        if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
        if (savedRecentlyViewed) setRecentlyViewed(JSON.parse(savedRecentlyViewed));
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // محاكاة جلب الكتب من API
  const fetchBooks = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            title: 'الأب الغني والأب الفقير',
            author: 'روبرت كيوساكي',
            description: 'كتاب رائع عن الاستثمار والذكاء المالي',
            category: 'اقتصاد واستثمار',
            condition: 'جيدة',
            price: 25,
            originalPrice: 50,
            image: '/images/rich-dad-poor-dad.jpg',
            seller: {
              id: 1,
              name: 'أحمد محمد',
              rating: 4.8,
              location: 'الرياض'
            },
            location: 'الرياض',
            exchangeType: 'بيع',
            status: 'متاح',
            createdAt: '2023-10-15',
            views: 124,
            likes: 18
          },
          // يمكن إضافة المزيد من الكتب هنا
        ]);
      }, 500);
    });
  };

  // محاكاة جلب التصنيفات من API
  const fetchCategories = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, name: 'روايات', count: 245, icon: '📚' },
          { id: 2, name: 'علمية', count: 189, icon: '🔬' },
          { id: 3, name: 'تاريخ', count: 132, icon: '📜' },
          { id: 4, name: 'اقتصاد واستثمار', count: 98, icon: '💰' },
          { id: 5, name: 'تطوير الذات', count: 176, icon: '💪' },
          { id: 6, name: 'أدب', count: 154, icon: '✍️' },
          { id: 7, name: 'فلسفة', count: 87, icon: '🧠' },
          { id: 8, name: 'دينية', count: 210, icon: '🕌' }
        ]);
      }, 300);
    });
  };

  // إضافة كتاب جديد
  const addBook = (bookData) => {
    const newBook = {
      ...bookData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      views: 0,
      likes: 0,
      status: 'متاح'
    };
    
    const updatedBooks = [...books, newBook];
    const updatedUserBooks = [...userBooks, newBook];
    
    setBooks(updatedBooks);
    setUserBooks(updatedUserBooks);
    
    // حفظ محلي
    localStorage.setItem('userBooks', JSON.stringify(updatedUserBooks));
    
    return newBook;
  };

  // تعديل كتاب
  const updateBook = (bookId, updatedData) => {
    const updatedBooks = books.map(book => 
      book.id === bookId ? { ...book, ...updatedData } : book
    );
    
    const updatedUserBooks = userBooks.map(book => 
      book.id === bookId ? { ...book, ...updatedData } : book
    );
    
    setBooks(updatedBooks);
    setUserBooks(updatedUserBooks);
    
    // حفظ محلي
    localStorage.setItem('userBooks', JSON.stringify(updatedUserBooks));
  };

  // حذف كتاب
  const deleteBook = (bookId) => {
    const updatedBooks = books.filter(book => book.id !== bookId);
    const updatedUserBooks = userBooks.filter(book => book.id !== bookId);
    
    setBooks(updatedBooks);
    setUserBooks(updatedUserBooks);
    
    // حفظ محلي
    localStorage.setItem('userBooks', JSON.stringify(updatedUserBooks));
  };

  // البحث عن الكتب
  const searchBooks = (query, searchFilters = {}) => {
    setLoading(true);
    
    // محاكاة البحث
    setTimeout(() => {
      const results = books.filter(book => {
        const matchesQuery = 
          book.title.toLowerCase().includes(query.toLowerCase()) ||
          book.author.toLowerCase().includes(query.toLowerCase()) ||
          book.description.toLowerCase().includes(query.toLowerCase());
        
        const matchesCategory = !searchFilters.category || book.category === searchFilters.category;
        const matchesCondition = !searchFilters.condition || book.condition === searchFilters.condition;
        const matchesLocation = !searchFilters.location || book.location.includes(searchFilters.location);
        const matchesPrice = 
          book.price >= (searchFilters.priceRange?.min || 0) && 
          book.price <= (searchFilters.priceRange?.max || 1000);
        
        return matchesQuery && matchesCategory && matchesCondition && matchesLocation && matchesPrice;
      });
      
      // تطبيق الترتيب
      let sortedResults = [...results];
      if (searchFilters.sortBy === 'price-low') {
        sortedResults.sort((a, b) => a.price - b.price);
      } else if (searchFilters.sortBy === 'price-high') {
        sortedResults.sort((a, b) => b.price - a.price);
      } else if (searchFilters.sortBy === 'newest') {
        sortedResults.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (searchFilters.sortBy === 'popular') {
        sortedResults.sort((a, b) => b.views - a.views);
      }
      
      setSearchResults(sortedResults);
      setLoading(false);
    }, 500);
  };

  // إضافة كتاب إلى قائمة الرغبات
  const addToWishlist = (bookId) => {
    const book = books.find(b => b.id === bookId);
    if (book && !wishlist.find(b => b.id === bookId)) {
      const updatedWishlist = [...wishlist, book];
      setWishlist(updatedWishlist);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    }
  };

  // إزالة كتاب من قائمة الرغبات
  const removeFromWishlist = (bookId) => {
    const updatedWishlist = wishlist.filter(book => book.id !== bookId);
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  // إضافة كتاب إلى الكتب التي تم مشاهدتها مؤخراً
  const addToRecentlyViewed = (bookId) => {
    const book = books.find(b => b.id === bookId);
    if (book) {
      const filtered = recentlyViewed.filter(b => b.id !== bookId);
      const updatedRecentlyViewed = [book, ...filtered].slice(0, 10); // حفظ آخر 10 كتب
      setRecentlyViewed(updatedRecentlyViewed);
      localStorage.setItem('recentlyViewed', JSON.stringify(updatedRecentlyViewed));
    }
  };

  // زيادة عدد المشاهدات
  const incrementViews = (bookId) => {
    const updatedBooks = books.map(book => 
      book.id === bookId ? { ...book, views: book.views + 1 } : book
    );
    setBooks(updatedBooks);
  };

  // زيادة عدد الإعجابات
  const incrementLikes = (bookId) => {
    const updatedBooks = books.map(book => 
      book.id === bookId ? { ...book, likes: book.likes + 1 } : book
    );
    setBooks(updatedBooks);
  };

  const value = {
    books,
    categories,
    userBooks,
    wishlist,
    recentlyViewed,
    searchResults,
    loading,
    filters,
    setFilters,
    addBook,
    updateBook,
    deleteBook,
    searchBooks,
    addToWishlist,
    removeFromWishlist,
    addToRecentlyViewed,
    incrementViews,
    incrementLikes
  };

  return (
    <BookContext.Provider value={value}>
      {children}
    </BookContext.Provider>
  );
};

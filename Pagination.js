// components/Pagination/Pagination.js - ترقيم الصفحات
import React from 'react';
import './Pagination.css';

const Pagination = ({ booksPerPage, totalBooks, currentPage, paginate }) => {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalBooks / booksPerPage);

  // تحديد الصفحات التي سيتم عرضها
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);

  if (currentPage <= 3) {
    endPage = Math.min(5, totalPages);
  }

  if (currentPage >= totalPages - 2) {
    startPage = Math.max(1, totalPages - 4);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="pagination">
      <ul className="pagination-list">
        {/* زر الصفحة الأولى */}
        {currentPage > 1 && (
          <li className="pagination-item">
            <button
              onClick={() => paginate(1)}
              className="pagination-link first-page"
              title="الصفحة الأولى"
            >
              ⏮️
            </button>
          </li>
        )}

        {/* زر الصفحة السابقة */}
        {currentPage > 1 && (
          <li className="pagination-item">
            <button
              onClick={() => paginate(currentPage - 1)}
              className="pagination-link prev-page"
              title="الصفحة السابقة"
            >
              ◀️
            </button>
          </li>
        )}

        {/* النقاط إذا كانت هناك صفحات قبل */}
        {startPage > 1 && (
          <li className="pagination-item">
            <span className="pagination-ellipsis">...</span>
          </li>
        )}

        {/* أرقام الصفحات */}
        {pageNumbers.map(number => (
          <li key={number} className="pagination-item">
            <button
              onClick={() => paginate(number)}
              className={`pagination-link ${currentPage === number ? 'active' : ''}`}
            >
              {number}
            </button>
          </li>
        ))}

        {/* النقاط إذا كانت هناك صفحات بعد */}
        {endPage < totalPages && (
          <li className="pagination-item">
            <span className="pagination-ellipsis">...</span>
          </li>
        )}

        {/* زر الصفحة التالية */}
        {currentPage < totalPages && (
          <li className="pagination-item">
            <button
              onClick={() => paginate(currentPage + 1)}
              className="pagination-link next-page"
              title="الصفحة التالية"
            >
              ▶️
            </button>
          </li>
        )}

        {/* زر الصفحة الأخيرة */}
        {currentPage < totalPages && (
          <li className="pagination-item">
            <button
              onClick={() => paginate(totalPages)}
              className="pagination-link last-page"
              title="الصفحة الأخيرة"
            >
              ⏭️
            </button>
          </li>
        )}
      </ul>

      {/* معلومات الصفحة */}
      <div className="pagination-info">
        <span>
          عرض {(currentPage - 1) * booksPerPage + 1} - {Math.min(currentPage * booksPerPage, totalBooks)} من {totalBooks} كتاب
        </span>
      </div>
    </nav>
  );
};

export default Pagination;

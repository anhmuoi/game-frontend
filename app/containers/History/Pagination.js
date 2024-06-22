import React from 'react';
import './Pagination.css';
import { FormattedMessage } from 'react-intl';
import messages from './messages.js';

const Pagination = ({ totalRecords, pageSize, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalRecords / pageSize);
  const pageNeighbours = 1; // Number of neighbouring pages to show on each side

  const generatePageNumbers = () => {
    const pages = [];

    if (totalPages <= 1) return pages;

    const startPage = Math.max(2, currentPage - pageNeighbours);
    const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours);

    if (startPage > 2) {
      pages.push(1);
      pages.push('...');
    } else {
      for (let i = 1; i < startPage; i++) {
        pages.push(i);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages - 1) {
      pages.push('...');
      pages.push(totalPages);
    } else {
      for (let i = endPage + 1; i <= totalPages; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  const handleClick = (pageNumber) => {
    if (pageNumber !== '...') {
      onPageChange(pageNumber);
    }
  };

  return (
    <div className="pagination">
      <button
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <FormattedMessage {...messages.previous} />
      </button>
      {pageNumbers.map((page, index) =>
        page === '...' ? (
          <span key={index} className="ellipsis">
            {page}
          </span>
        ) : (
          <button
            key={index}
            onClick={() => handleClick(page)}
            className={currentPage === page ? 'active' : ''}
          >
            {page}
          </button>
        ),
      )}
      <button
        onClick={() => handleClick(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <FormattedMessage {...messages.next} />
      </button>
    </div>
  );
};

export default Pagination;

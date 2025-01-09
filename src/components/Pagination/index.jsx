import React from 'react';

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    onFirstPage,
    onLastPage,
    onNextPage,
    onPrevPage
}) {
    
    const getPaginationRange = () => {
        const paginationRange = 10; 
        const start = Math.max(1, currentPage - Math.floor(paginationRange / 2));
        const end = Math.min(totalPages, start + paginationRange - 1);

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    return (
        <div className="pagination">
            <button onClick={onFirstPage} disabled={currentPage === 1}>
                ⏮️
            </button>
            <button onClick={onPrevPage} disabled={currentPage === 1}>
                ◀️
            </button>
            {getPaginationRange().map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={currentPage === page ? 'active' : ''}
                >
                    {page}
                </button>
            ))}
            <button onClick={onNextPage} disabled={currentPage === totalPages}>
                ▶️
            </button>
            <button onClick={onLastPage} disabled={currentPage === totalPages}>
                ⏭️
            </button>
        </div>
    );
}

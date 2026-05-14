"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showingText?: string;
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  showingText = "Showing 1-4 of 124 invoices" 
}: PaginationProps) {
  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-between">
      <p className="text-[13px] text-[#64748b]">{showingText}</p>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex size-8 items-center justify-center rounded-lg border border-[#e2e8f0] bg-white text-[#64748b] hover:bg-[#f8f9fc] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={14} />
        </button>
        
        {getVisiblePages().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && onPageChange(page)}
            disabled={page === "..."}
            className={`
              flex size-8 items-center justify-center rounded-lg text-[13px] font-medium transition-colors
              ${page === currentPage
                ? "bg-[#4338ca] text-white"
                : page === "..."
                ? "text-[#64748b] cursor-default"
                : "border border-[#e2e8f0] bg-white text-[#64748b] hover:bg-[#f8f9fc]"
              }
            `}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex size-8 items-center justify-center rounded-lg border border-[#e2e8f0] bg-white text-[#64748b] hover:bg-[#f8f9fc] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

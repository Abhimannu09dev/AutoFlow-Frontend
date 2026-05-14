"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: number;
  className?: string;
}

export function StarRating({ 
  rating, 
  onRatingChange, 
  readonly = false, 
  size = 24,
  className = "" 
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (value: number) => {

    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value: number) => {
    if (!readonly) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {[1, 2, 3, 4, 5].map((value) => {
        const isActive = value <= (hoverRating || rating);
        const isSelected = value === rating;
        
        return (
          <button
            key={value}
            type="button"
            onClick={() => handleClick(value)}
            onMouseEnter={() => handleMouseEnter(value)}
            onMouseLeave={handleMouseLeave}
            disabled={readonly}
            className={`
              relative transition-all duration-200 
              ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}
              ${isSelected ? 'transform scale-125' : ''}
            `}
          >
            <div className={`
              rounded-2xl p-4 transition-all duration-200
              ${isSelected 
                ? 'bg-[#4338ca] shadow-lg' 
                : isActive 
                ? 'bg-[#64748b]' 
                : 'bg-[#e2e8f0]'
              }
            `}>
              <Star 
                size={size} 
                className={`
                  transition-colors duration-200
                  ${isSelected || isActive ? 'text-white' : 'text-[#94a3b8]'}
                `}
                fill={isSelected || isActive ? 'currentColor' : 'none'}
              />
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
              <span className="text-[12px] font-medium text-[#64748b]">{value}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

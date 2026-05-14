"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarProps {
  selectedDate?: Date;
  onDateSelect: (date: Date) => void;
  minDate?: Date;
}

export function Calendar({ selectedDate, onDateSelect, minDate = new Date() }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const isDateDisabled = (date: Date | null) => {
    if (!date) return true;
    return date < minDate;
  };

  const isDateSelected = (date: Date | null) => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="max-w-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[15px] font-bold text-[#0f172a]">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => navigateMonth('prev')}
            className="flex size-6 items-center justify-center rounded text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a]"
          >
            <ChevronLeft size={12} />
          </button>
          <button
            type="button"
            onClick={() => navigateMonth('next')}
            className="flex size-6 items-center justify-center rounded text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a]"
          >
            <ChevronRight size={12} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {dayNames.map((day) => (
          <div key={day} className="flex h-8 items-center justify-center text-[10px] font-medium text-[#64748b]">
            {day}
          </div>
        ))}
        
        {days.map((date, index) => (
          <div key={index} className="flex h-8 items-center justify-center">
            {date && (
              <button
                type="button"
                disabled={isDateDisabled(date)}
                onClick={() => !isDateDisabled(date) && onDateSelect(date)}
                className={`
                  flex size-7 items-center justify-center rounded text-[12px] font-medium transition
                  ${isDateSelected(date) 
                    ? 'bg-[#4338ca] text-white' 
                    : isDateDisabled(date)
                    ? 'text-[#cbd5e1] cursor-not-allowed'
                    : 'text-[#0f172a] hover:bg-[#f1f5f9]'
                  }
                `}
              >
                {date.getDate()}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

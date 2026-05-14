"use client";

interface TimeSlot {
  time: string;
  available: boolean;
}

interface TimeSlotPickerProps {
  selectedTime?: string;
  onTimeSelect: (time: string) => void;
  timeSlots?: TimeSlot[];
}

const defaultTimeSlots: TimeSlot[] = [
  { time: "08:00 AM", available: true },
  { time: "09:15 AM", available: true },
  { time: "10:00 AM", available: true },
  { time: "11:30 AM", available: true },
  { time: "01:00 PM", available: true },
  { time: "02:45 PM", available: true },
  { time: "04:00 PM", available: true },
  { time: "05:30 PM", available: true },
];

export function TimeSlotPicker({ 
  selectedTime, 
  onTimeSelect, 
  timeSlots = defaultTimeSlots 
}: TimeSlotPickerProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">
        SELECT TIME SLOT
      </h4>
      
      <div className="grid grid-cols-4 gap-2 max-w-md">
        {timeSlots.map((slot) => (
          <button
            key={slot.time}
            type="button"
            disabled={!slot.available}
            onClick={() => slot.available && onTimeSelect(slot.time)}
            className={`
              rounded-lg px-3 py-2 text-[12px] font-medium transition
              ${selectedTime === slot.time
                ? 'bg-[#4338ca] text-white'
                : slot.available
                ? 'border border-[#e2e8f0] bg-white text-[#0f172a] hover:bg-[#f8f9fc]'
                : 'border border-[#f1f5f9] bg-[#f8f9fc] text-[#cbd5e1] cursor-not-allowed'
              }
            `}
          >
            {slot.time}
          </button>
        ))}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

interface MonthYearPickerProps {
  selectedMonth: string;
  selectedYear: string;
  onChange: (month: string, year: string) => void;
  isRtl?: boolean;
}

const months = [
  { value: '1', ar: 'يناير', en: 'Jan' },
  { value: '2', ar: 'فبراير', en: 'Feb' },
  { value: '3', ar: 'مارس', en: 'Mar' },
  { value: '4', ar: 'أبريل', en: 'Apr' },
  { value: '5', ar: 'مايو', en: 'May' },
  { value: '6', ar: 'يونيو', en: 'Jun' },
  { value: '7', ar: 'يوليو', en: 'Jul' },
  { value: '8', ar: 'أغسطس', en: 'Aug' },
  { value: '9', ar: 'سبتمبر', en: 'Sep' },
  { value: '10', ar: 'أكتوبر', en: 'Oct' },
  { value: '11', ar: 'نوفمبر', en: 'Nov' },
  { value: '12', ar: 'ديسمبر', en: 'Dec' },
];

export const MonthYearPicker: React.FC<MonthYearPickerProps> = ({
  selectedMonth,
  selectedYear,
  onChange,
  isRtl = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayedYear, setDisplayedYear] = useState<number>(Number(selectedYear) || new Date().getFullYear());

  const currentMonthObj = months.find((m) => m.value === selectedMonth) || months[0];
  const monthName = isRtl ? currentMonthObj.ar : currentMonthObj.en;

  const handlePrevYear = () => {
    setDisplayedYear((prev) => prev - 1);
  };

  const handleNextYear = () => {
    setDisplayedYear((prev) => prev + 1);
  };

  const handleSelectMonth = (monthValue: string) => {
    onChange(monthValue, String(displayedYear));
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 !rounded-lg border border-black/10 bg-white px-3.5 py-1.5 text-xs font-bold text-black shadow-xs transition-all hover:bg-neutral-50 hover:border-black/20 focus:outline-none cursor-pointer"
        >
          <CalendarIcon className="h-4 w-4 text-black/60" />
          <span>{monthName} {selectedYear}</span>
          <ChevronDown className="h-3.5 w-3.5 text-black/40 transition-transform duration-200" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3 rounded-2xl border border-black/10 bg-white shadow-xl" align="end">
        <div className="flex items-center justify-between border-b border-black/5 pb-2 mb-3">
          <button
            type="button"
            onClick={handlePrevYear}
            className="rounded-lg p-1 text-black/60 hover:bg-black/5 hover:text-black transition-colors cursor-pointer"
          >
            <ChevronLeft className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
          <span className="text-xs font-black text-black">{displayedYear}</span>
          <button
            type="button"
            onClick={handleNextYear}
            className="rounded-lg p-1 text-black/60 hover:bg-black/5 hover:text-black transition-colors cursor-pointer"
          >
            <ChevronRight className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {months.map((m) => {
            const isSelected = m.value === selectedMonth && String(displayedYear) === selectedYear;
            return (
              <button
                key={m.value}
                type="button"
                onClick={() => handleSelectMonth(m.value)}
                className={`rounded-xl py-2 text-[11px] font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-black text-white shadow-sm'
                    : 'text-black/80 hover:bg-black/5 hover:text-black'
                }`}
              >
                {isRtl ? m.ar : m.en}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

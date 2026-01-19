import { CalendarDays } from 'lucide-react';

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
  const dates = [];
  const today = new Date(); // Use current date
  
  // Generate 20 days starting from today
  for (let i = 0; i < 20; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }

  const formatDay = (date: Date) => {
    return date.toLocaleDateString('it-IT', { weekday: 'short' }).toUpperCase();
  };

  const formatDate = (date: Date) => {
    return date.getDate();
  };

  const formatDateString = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center gap-2 mb-3">
        <CalendarDays className="w-5 h-5 text-indigo-600" />
        <h2 className="text-sm font-semibold text-gray-700">Seleziona Data</h2>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {dates.map((date) => {
          const dateString = formatDateString(date);
          const isSelected = selectedDate === dateString;
          
          return (
            <button
              key={dateString}
              onClick={() => onDateChange(dateString)}
              className={`flex flex-col items-center justify-center min-w-[60px] px-3 py-2 rounded-lg transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="text-xs font-medium mb-1">{formatDay(date)}</span>
              <span className="text-lg font-bold">{formatDate(date)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
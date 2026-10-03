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
  <div
    className="
      fixed top-0 left-0 right-0 z-[100] w-full shrink-0
      bg-[#050914]/95
      backdrop-blur-xl
      border-b border-white/10
      px-4 pt-3 pb-3
      shadow-[0_8px_30px_rgba(0,0,0,0.12)]
    "
  >
    {/* Header */}
    <div className="flex items-center gap-2 mb-3">
      <div
        className="
          w-8 h-8
          rounded-lg
          flex items-center justify-center
          bg-gradient-to-br
          from-cyan-400
          via-blue-500
          to-violet-500
          shadow-[0_0_14px_rgba(34,211,238,0.25)]
        "
      >
        <CalendarDays className="w-4 h-4 text-white" />
      </div>

      <div className="flex flex-col">
        <h2 className="text-sm font-semibold text-white">
          Seleziona Data
        </h2>

        <span className="text-[10px] text-slate-500">
          Scopri cosa succede in città
        </span>
      </div>
    </div>

    {/* Date carousel */}
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {dates.map((date) => {
        const dateString = formatDateString(date);
        const isSelected = selectedDate === dateString;

        return (
          <button
            key={dateString}
            onClick={() => onDateChange(dateString)}
            className={`
              relative
              flex flex-col items-center justify-center
              min-w-[60px]
              h-[64px]
              px-3 py-2
              rounded-xl
              border
              transition-all duration-300
              ${
                isSelected
                  ? `
                    text-white
                    border-cyan-400/40
                    bg-gradient-to-br
                    from-cyan-400
                    via-blue-500
                    to-violet-500
                    shadow-[0_0_12px_rgba(34,211,238,0.18)]
                    scale-[1.03]
                  `
                  : `
                    bg-[#111B2E]
                    text-slate-400
                    border-white/5
                    hover:bg-[#162238]
                    hover:text-slate-200
                  `
              }
            `}
          >
            <span
              className={`text-[10px] font-semibold mb-1 ${
                isSelected ? 'text-white/90' : 'text-slate-500'
              }`}
            >
              {formatDay(date)}
            </span>

            <span
              className={`text-lg font-bold ${
                isSelected ? 'text-white' : 'text-slate-300'
              }`}
            >
              {formatDate(date)}
            </span>
          </button>
        );
      })}
    </div>
  </div>
);
}
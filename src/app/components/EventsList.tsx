import { useState, useMemo } from 'react';
import type { Event } from '../types/event';
import { EventCard } from './EventCard';
import { Music, Theater, Film, Utensils, Calendar, Search, X } from 'lucide-react';

interface EventsListProps {
  events: Event[];
  favorites: Set<string>;
  onToggleFavorite: (eventId: string) => void;
  onEventClick: (event: Event) => void;
  showFilters?: boolean;
}

export function EventsList({ events, favorites, onToggleFavorite, onEventClick, showFilters = false }: EventsListProps) {
  const [selectedTypes, setSelectedTypes] = useState<Set<Event['type']>>(new Set());
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  // Get unique dates from events
  const uniqueDates = useMemo(() => {
    const dates = Array.from(new Set(events.map(e => e.date))).sort();
    return dates;
  }, [events]);

  // Filter events
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Filter by type
      if (selectedTypes.size > 0 && !selectedTypes.has(event.type)) {
        return false;
      }
      
      // Filter by date
      if (selectedDate && event.date !== selectedDate) {
        return false;
      }
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          event.title.toLowerCase().includes(query) ||
          event.venue.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  }, [events, selectedTypes, selectedDate, searchQuery]);

  const toggleType = (type: Event['type']) => {
    setSelectedTypes(prev => {
      const newTypes = new Set(prev);
      if (newTypes.has(type)) {
        newTypes.delete(type);
      } else {
        newTypes.add(type);
      }
      return newTypes;
    });
  };

  const clearFilters = () => {
    setSelectedTypes(new Set());
    setSelectedDate('');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedTypes.size > 0 || selectedDate || searchQuery;

  const eventTypes = [
    {
      type: 'club' as const,
      label: 'Discoteca',
      icon: Music,
      color: 'from-violet-500 to-purple-600',
    },
    {
      type: 'concert' as const,
      label: 'Concerto',
      icon: Music,
      color: 'from-cyan-400 to-cyan-600',
    },
    {
      type: 'theater' as const,
      label: 'Teatro',
      icon: Theater,
      color: 'from-blue-400 to-blue-600',
    },
    {
      type: 'cinema' as const,
      label: 'Cinema',
      icon: Film,
      color: 'from-indigo-400 to-indigo-600',
    },
    {
      type: 'restaurant' as const,
      label: 'Ristorante',
      icon: Utensils,
      color: 'from-violet-400 to-fuchsia-600',
    },
  ];

  if (filteredEvents.length === 0) {
    return (
      <div className="h-full flex flex-col">
        {showFilters && (
          <div className=" border-b border-white/10  bg-[#050914]/95  backdrop-blur-xl p-4 space-y-3">
            {/* Search bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cerca eventi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Type filters */}
            <div className="flex flex-wrap gap-2">
              {eventTypes.map(({ type, label, icon: Icon, color }) => (
                <button
                  key={type}
                  onClick={() => toggleType(type)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                  selectedTypes.has(type)
                    ? `bg-gradient-to-r ${color} text-white shadow-md border-transparent`
                    : 'bg-[#111B2E] text-slate-400 border-white/10 hover:text-white hover:border-white/20'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {label}
                </button>
              ))}
            </div>

            {/* Date filter */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="  flex-1  px-3 py-2  bg-[#111B2E]  border border-white/10  rounded-xl  text-sm text-slate-300  outline-none  focus:border-cyan-400/60">
                <option value="">Tutte le date</option>
                {uniqueDates.map(date => {
                  const dateObj = new Date(date + 'T00:00:00');
                  const formatted = dateObj.toLocaleDateString('it-IT', { 
                    weekday: 'short', 
                    day: 'numeric', 
                    month: 'short' 
                  });
                  return (
                    <option key={date} value={date}>{formatted}</option>
                  );
                })}
              </select>
              
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  Reset
                </button>
              )}
            </div>
          </div>
        )}
        
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Nessun evento trovato</h3>
          <p className="text-gray-600">
            {hasActiveFilters 
              ? 'Prova a modificare i filtri per trovare altri eventi.'
              : 'Non ci sono eventi disponibili.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {showFilters && (
        <div className="  border-b border-white/10  bg-[#050914]/95  backdrop-blur-xl  p-4 space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
            <input
              type="text"
              placeholder="Cerca eventi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
             className="  w-full h-11  pl-10 pr-4  bg-[#111B2E]  border border-white/10  rounded-xl  text-sm text-white  placeholder:text-slate-500  outline-none  focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10  transition-all"   />
          </div>

          {/* Type filters */}
          <div className="flex flex-wrap gap-2">
            {eventTypes.map(({ type, label, icon: Icon, color }) => (
              <button
                key={type}
                onClick={() => toggleType(type)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedTypes.has(type)
                    ? `${color} text-white`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-3 h-3" />
                {label}
              </button>
            ))}
          </div>

          {/* Date filter */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Tutte le date</option>
              {uniqueDates.map(date => {
                const dateObj = new Date(date + 'T00:00:00');
                const formatted = dateObj.toLocaleDateString('it-IT', { 
                  weekday: 'short', 
                  day: 'numeric', 
                  month: 'short' 
                });
                return (
                  <option key={date} value={date}>{formatted}</option>
                );
              })}
            </select>
            
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Reset
              </button>
              )}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto scrollbar-hide pb-20">
        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {filteredEvents.length} {filteredEvents.length === 1 ? 'Evento' : 'Eventi'}
            {hasActiveFilters && ' (filtrati)'}
          </h2>
          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                isFavorite={favorites.has(event.id)}
                onToggleFavorite={onToggleFavorite}
                onEventClick={onEventClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
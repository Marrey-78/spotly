import { Heart } from 'lucide-react';
import type { Event } from '../types/event';
import { EventCard } from './EventCard';

interface ProfileViewProps {
  favoriteEvents: Event[];
  favorites: Set<string>;
  onToggleFavorite: (eventId: string) => void;
  onEventClick: (event: Event) => void;
}

export function ProfileView({ favoriteEvents, favorites, onToggleFavorite, onEventClick }: ProfileViewProps) {
  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-20 bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <span className="text-2xl">👤</span>
          </div>
          <div>
            <h2 className="text-xl font-bold">Il Mio Profilo</h2>
            <p className="text-sm text-indigo-100">Gestisci i tuoi eventi preferiti</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-4">
        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 fill-red-500 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{favoriteEvents.length}</p>
                <p className="text-sm text-gray-600">Eventi Preferiti</p>
              </div>
            </div>
          </div>
        </div>

        {/* Favorite Events */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">I Miei Preferiti</h3>
          {favoriteEvents.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center">
              <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 mb-2">Nessun evento preferito</p>
              <p className="text-sm text-gray-500">
                Tocca il cuore su un evento per aggiungerlo ai preferiti
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {favoriteEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isFavorite={favorites.has(event.id)}
                  onToggleFavorite={onToggleFavorite}
                  onEventClick={onEventClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
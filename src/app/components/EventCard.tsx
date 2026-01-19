import { Heart, Clock, MapPin, Music, Theater, Film, Utensils } from 'lucide-react';
import type { Event } from '../types/event';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface EventCardProps {
  event: Event;
  isFavorite: boolean;
  onToggleFavorite: (eventId: string) => void;
  onEventClick?: (event: Event) => void;
}

export function EventCard({ event, isFavorite, onToggleFavorite, onEventClick }: EventCardProps) {
  const getEventIcon = () => {
    switch (event.type) {
      case 'club':
        return Music;
      case 'concert':
        return Music;
      case 'theater':
        return Theater;
      case 'cinema':
        return Film;
      case 'restaurant':
        return Utensils;
      default:
        return Music;
    }
  };

  const getEventTypeLabel = () => {
    switch (event.type) {
      case 'club':
        return 'Discoteca';
      case 'concert':
        return 'Concerto';
      case 'theater':
        return 'Teatro';
      case 'cinema':
        return 'Cinema';
      case 'restaurant':
        return 'Ristorante';
      default:
        return '';
    }
  };

  const Icon = getEventIcon();

  return (
    <div
      onClick={() => onEventClick?.(event)}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="relative h-40">
        <ImageWithFallback
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
          <Icon className="w-3 h-3 text-indigo-600" />
          <span className="text-xs font-medium text-gray-800">{getEventTypeLabel()}</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(event.id);
          }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform"
        >
          <Heart
            className={`w-4 h-4 ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1">{event.title}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <MapPin className="w-4 h-4" />
          <span>{event.venue}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{event.time}</span>
          </div>
          <span className="font-semibold text-indigo-600">{event.price}</span>
        </div>
      </div>
    </div>
  );
}

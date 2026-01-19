import { X, MapPin, Clock, Heart, Music, Theater, Film, Utensils, Calendar } from 'lucide-react';
import type { Event } from '../types/event';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface EventDetailModalProps {
  event: Event | null;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: (eventId: string) => void;
  onNavigate: (event: Event) => void;
}

export function EventDetailModal({ event, isFavorite, onClose, onToggleFavorite, onNavigate }: EventDetailModalProps) {
  if (!event) return null;

  const getEventIcon = () => {
    switch (event.type) {
      case 'club':
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white w-full sm:max-w-lg sm:rounded-t-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up">
        {/* Header Image */}
        <div className="relative h-64">
          <ImageWithFallback
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
          >
            <X className="w-5 h-5 text-gray-800" />
          </button>

          {/* Type badge */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
            <Icon className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-gray-800">{getEventTypeLabel()}</span>
          </div>

          {/* Title */}
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-2xl font-bold text-white mb-1">{event.title}</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Info cards */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{event.venue}</p>
                  <p className="text-xs text-gray-600">Luogo dell'evento</p>
                </div>
              </div>

              {/* 🧭 NAVIGAZIONE */}
              <button
                onClick={() => onNavigate(event)}
                className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md hover:bg-indigo-700 transition"
                title="Naviga"
              >
                🧭
              </button>
            </div>


            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900 capitalize">{formatDate(event.date)}</p>
                <p className="text-xs text-gray-600">Data</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Clock className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">{event.time}</p>
                <p className="text-xs text-gray-600">Orario</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Descrizione</h3>
            <p className="text-gray-600">{event.description}</p>
          </div>

          {/* Price */}
          <div className="bg-indigo-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Prezzo</span>
              <span className="text-2xl font-bold text-indigo-600">{event.price}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => onToggleFavorite(event.id)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                isFavorite
                  ? 'bg-red-50 text-red-600 hover:bg-red-100'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-600' : ''}`} />
              {isFavorite ? 'Rimuovi' : 'Aggiungi ai preferiti'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

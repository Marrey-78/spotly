import { X, MapPin, Clock, Heart, Music, Theater, Film, Utensils, Calendar, Footprints, Car, Navigation } from 'lucide-react';
import type { Event } from '../types/event';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState } from 'react';
import { useEffect } from 'react';
import { trackAnalytics } from '../api/analytics';
import { flodeTheme } from '../theme/flodeTheme';

interface EventDetailModalProps {
  event: Event | null;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: (eventId: string) => void;
  onNavigate: (event: Event, mode: google.maps.TravelMode) => void;
}

export function EventDetailModal({ event, isFavorite, onClose, onToggleFavorite, onNavigate }: EventDetailModalProps) {
  if (!event) return null;

  const getEventIcon = () => {
    switch (event.type) {
      case 'club':
      case 'concert':
      case 'live_music':
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

    const getEventColor = () => {
    switch (event.type) {
      case 'club':
        return flodeTheme.colors.purple;

      case 'concert':
      case 'live_music':
        return flodeTheme.colors.cyan;

      case 'theater':
        return flodeTheme.colors.blue;

      case 'cinema':
        return '#6366F1';

      case 'restaurant':
        return '#A855F7';

      case 'pub':
      case 'bar':
        return '#7C3AED';

      default:
        return flodeTheme.colors.blue;
    }
  };

  const eventColor = getEventColor();

  const getEventTypeLabel = () => {
    switch (event.type) {
      case 'club':
        return 'Discoteca';
      case 'concert':
      case 'live_music':
        return 'Concerto';
      case 'theater':
        return 'Teatro';
      case 'cinema':
        return 'Cinema';
      case 'restaurant':
        return 'Ristorante';
      case 'pub':
        return 'Pub';
      case 'bar':
        return 'Bar';
      default:
        return '';
    }
  };

  useEffect(() => {
    if (!event?.id) return;

    trackAnalytics({
      event_type: 'event_view',
      event_id: event.id,
    });
  }, [event?.id]);

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

  // Pop - up
  const [showNavigationModal, setShowNavigationModal] = useState(false);

  const handleToggleFavorite = () => {
    // Tracciamo solo l'aggiunta, non la rimozione
    if (!isFavorite) {
      trackAnalytics({
        event_type: 'event_favorite',
        event_id: event.id,
      });
    }

    onToggleFavorite(event.id);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center">
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
          <div
                className="
                  absolute top-4 left-4
                  backdrop-blur-md
                  px-3 py-1.5
                  rounded-full
                  flex items-center gap-2
                  text-white
                  shadow-lg
                "
                style={{
                  backgroundColor: `${eventColor}E6`,
                  boxShadow: `0 0 14px ${eventColor}55`,
                }}
              >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-semibold">{getEventTypeLabel()}</span>
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
            <div className="flex items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-100 rounded-lg">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{event.venue}</p>
                  <p className="text-xs text-gray-600">Luogo dell'evento</p>
                </div>
              </div>

              {/* 🧭 NAVIGAZIONE */}
              <button
                onClick={() => {
                  trackAnalytics({
                    event_type: 'directions_click',
                    event_id: event.id,
                  });
                
                  setShowNavigationModal(true);
                }}
                className="
                  w-9 h-9
                  rounded-xl
                  text-white
                  flex items-center justify-center
                  shadow-[0_0_14px_rgba(34,211,238,0.25)]
                  bg-gradient-to-br
                  from-cyan-400
                  via-blue-500
                  to-violet-500
                  hover:scale-105
                  transition-all
                "
                title="Naviga"
              >
                🧭
              </button>
            </div>


            <div className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-100 rounded-lg">
              <Calendar className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900 capitalize">{formatDate(event.date)}</p>
                <p className="text-xs text-gray-600">Data</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-100 rounded-lg">
              <Clock className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
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
          <div className="bg-gradient-to-r from-cyan-50 via-blue-50 to-violet-50 border border-cyan-100 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Prezzo</span>
              <span className="
                                text-2xl font-bold
                                text-transparent bg-clip-text
                                bg-gradient-to-r
                                from-cyan-500
                                via-blue-500
                                to-violet-500
                              ">{event.price}</span>
            </div>
          </div>

          {event.ticket_url && (
            <a
              href={event.ticket_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackAnalytics({
                  event_type: 'ticket_click',
                  event_id: event.id,
                });
              }}
              className="
                          w-full mb-3
                          py-3 px-4
                          rounded-xl
                          text-white
                          font-semibold
                          flex items-center justify-center gap-2
                          bg-gradient-to-r
                          from-cyan-400
                          via-blue-500
                          to-violet-500
                          shadow-[0_6px_20px_rgba(59,130,246,0.25)]
                          hover:shadow-[0_8px_26px_rgba(59,130,246,0.35)]
                          hover:-translate-y-0.5
                          transition-all duration-300
                        "
            >
              🎟️ Acquista biglietti
            </a>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleToggleFavorite}
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
      {showNavigationModal && (
        <div className="fixed inset-0 z-[210] flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowNavigationModal(false)}
          />

          <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-[#0B1220]/95 backdrop-blur-xl shadow-[0_24px_60px_rgba(0,0,0,0.45)] p-5">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 shrink-0 rounded-2xl flex items-center justify-center bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500 shadow-[0_0_16px_rgba(34,211,238,0.22)]">
                  <Navigation className="w-5 h-5 text-white stroke-[2.4]" />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-cyan-400">
                    Indicazioni
                  </p>
                  <h3 className="text-lg font-bold text-white">
                    Come vuoi andare?
                  </h3>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {event.venue}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowNavigationModal(false)}
                aria-label="Chiudi"
                className="w-9 h-9 shrink-0 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  onNavigate(event, google.maps.TravelMode.WALKING);
                  setShowNavigationModal(false);
                }}
                className="group min-h-[112px] rounded-2xl border border-white/10 bg-[#111B2E] px-4 py-4 flex flex-col items-center justify-center gap-3 text-slate-300 hover:border-cyan-400/40 hover:bg-[#162238] hover:text-white transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-cyan-400/10 text-cyan-400 group-hover:bg-cyan-400/15 transition-colors">
                  <Footprints className="w-5 h-5 stroke-[2.3]" />
                </div>
                <span className="text-sm font-semibold">A piedi</span>
              </button>

              <button
                onClick={() => {
                  onNavigate(event, google.maps.TravelMode.DRIVING);
                  setShowNavigationModal(false);
                }}
                className="group min-h-[112px] rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500 px-4 py-4 flex flex-col items-center justify-center gap-3 text-white shadow-[0_0_18px_rgba(34,211,238,0.16)] hover:shadow-[0_0_24px_rgba(34,211,238,0.24)] hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-white/15">
                  <Car className="w-5 h-5 stroke-[2.3]" />
                </div>
                <span className="text-sm font-semibold">In auto</span>
              </button>
            </div>

            <p className="mt-4 text-center text-[11px] text-slate-500">
              Scegli il mezzo per calcolare il percorso.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}

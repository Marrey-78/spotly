import { Heart, Clock, MapPin, Music, Theater, Film, Utensils } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { Event } from '../types/event';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { trackAnalytics } from '../api/analytics';
import { flodeTheme } from '../theme/flodeTheme';

interface EventCardProps {
  event: Event;
  isFavorite: boolean;
  onToggleFavorite: (eventId: string) => void;
  onEventClick?: (event: Event) => void;
}

export function EventCard({ event, isFavorite, onToggleFavorite, onEventClick }: EventCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const impressionTracked = useRef(false);

  useEffect(() => {
    const element = cardRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          entry.intersectionRatio >= 0.5 &&
          !impressionTracked.current
        ) {
          impressionTracked.current = true;

          trackAnalytics({
            event_type: 'event_impression',
            event_id: event.id,
          });

          observer.disconnect();
        }
      },
      {
        threshold: 0.5,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [event.id]);

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

    const getEventColor = () => {
    switch (event.type) {
      case 'club':
        return flodeTheme.colors.purple;

      case 'concert':
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
    ref={cardRef}
    onClick={() => onEventClick?.(event)}
    className="
      bg-white
      rounded-2xl
      overflow-hidden
      border border-slate-100
      shadow-sm
      hover:shadow-lg
      hover:-translate-y-0.5
      transition-all duration-300
      cursor-pointer
    "
  >
    {/* IMAGE */}
    <div className="relative h-40">
      <ImageWithFallback
        src={event.image}
        alt={event.title}
        className="w-full h-full object-cover"
      />

      {/* leggero gradient sull'immagine */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

      {/* EVENT TYPE */}
      <div
        className="
          absolute top-3 left-3
          px-2.5 py-1
          rounded-full
          flex items-center gap-1.5
          text-white
          backdrop-blur-md
          shadow-md
        "
        style={{
          backgroundColor: `${eventColor}E6`,
          boxShadow: `0 0 12px ${eventColor}40`,
        }}
      >
        <Icon className="w-3 h-3" />

        <span className="text-xs font-semibold">
          {getEventTypeLabel()}
        </span>
      </div>

      {/* FAVORITE */}
      <button
        onClick={(e) => {
          e.stopPropagation();

          if (!isFavorite) {
            trackAnalytics({
              event_type: 'event_favorite',
              event_id: event.id,
            });
          }

          onToggleFavorite(event.id);
        }}
        className="
          absolute top-3 right-3
          w-9 h-9
          bg-[#0B1220]/85
          backdrop-blur-md
          rounded-xl
          flex items-center justify-center
          border border-white/10
          shadow-lg
          hover:scale-110
          transition-all duration-200
        "
      >
        <Heart
          className={`w-4 h-4 transition-all ${
            isFavorite
              ? 'fill-cyan-400 text-cyan-400'
              : 'text-white'
          }`}
        />
      </button>
    </div>

    {/* CONTENT */}
    <div className="p-4">

      <h3 className="font-semibold text-slate-900 mb-2 truncate">
        {event.title}
      </h3>

      <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
        <MapPin className="w-4 h-4 text-slate-400" />
        <span className="truncate">{event.venue}</span>
      </div>

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-1.5 text-sm text-slate-500">
          <Clock className="w-4 h-4 text-cyan-600" />
          <span>{event.time}</span>
        </div>

        <span
          className="
            font-bold
            text-transparent
            bg-clip-text
            bg-gradient-to-r
            from-cyan-500
            via-blue-500
            to-violet-500
          "
        >
          {event.price}
        </span>

      </div>
    </div>
  </div>
);
}

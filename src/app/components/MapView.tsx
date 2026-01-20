import {
  GoogleMap,
  useJsApiLoader,
  OverlayView,
  DirectionsRenderer,
} from '@react-google-maps/api';
import {
  MapPin,
  Music,
  Theater,
  Film,
  Utensils,
  Clock,
  MapPinIcon,
} from 'lucide-react';
import type { Event } from '../types/event';
import { useUserLocation } from './useUserLocation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { darkMapStyle } from '../maps/darkMapStyle';

/* ---------- MAP CONFIG ---------- */

const containerStyle = {
  width: '100%',
  height: '100%',
};

const lastPositionRef = useRef<google.maps.LatLngLiteral | null>(null);

const distanceInMeters = (
  a: google.maps.LatLngLiteral,
  b: google.maps.LatLngLiteral
): number => {
  const R = 6371000; // raggio Terra in metri
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;

  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;

  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
};


const defaultCenter = { lat: 45.4642, lng: 9.19 };

interface MapViewProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  navigationEvent?: Event | null;
  travelMode: google.maps.TravelMode | null;
  onCancelNavigation: () => void;
}

export function MapView({ events, onEventClick, navigationEvent, travelMode, onCancelNavigation }: MapViewProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const { position } = useUserLocation();
  const mapRef = useRef<google.maps.Map | null>(null);
  const cardsRef = useRef<Record<string, HTMLButtonElement | null>>({});

  const setCardRef = (id: string) => (el: HTMLButtonElement | null) => {
    cardsRef.current[id] = el;
  };


  const [darkMode, setDarkMode] = useState(false);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [directions, setDirections] =
  useState<google.maps.DirectionsResult | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  /* -------ETA -------*/
  const [eta, setEta] = useState<string | null>(null);

  /* --- Ricalcolo percorso --- */
  const [userPosition, setUserPosition] = useState<google.maps.LatLngLiteral | null>(null);
 

  /* ----------PERCORSO ----------*/
  useEffect(() => {
  if (!navigator.geolocation) return;

  const watchId = navigator.geolocation.watchPosition(
    (pos) => {
      const newPosition = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };

      // prima posizione → sempre accettata
      if (!lastPositionRef.current) {
        lastPositionRef.current = newPosition;
        setUserPosition(newPosition);
        return;
      }

      const movedMeters = distanceInMeters(
        lastPositionRef.current,
        newPosition
      );

      // ricalcolo solo se > 20 metri
      if (movedMeters >= 20) {
        lastPositionRef.current = newPosition;
        setUserPosition(newPosition);
      }
    },
    (err) => {
      console.error('Errore geolocalizzazione', err);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 10000,
    }
  );

  return () => navigator.geolocation.clearWatch(watchId);
}, []);


  useEffect(() => {
    if (!navigationEvent || !travelMode || !userPosition) return;

    const service = new google.maps.DirectionsService();

    service.route(
      {
        origin: userPosition,
        destination: {
          lat: navigationEvent.latitude,
          lng: navigationEvent.longitude,
        },
        travelMode,
      },
      (result, status) => {
        if (status === 'OK' && result) {
          setDirections(result);

          const duration =
            result.routes[0].legs[0].duration?.text;

          setEta(duration ?? null);
        }
      }
    );
  }, [navigationEvent, travelMode, userPosition]);


  useEffect(() => {
    if (!navigationEvent) {
      setDirections(null);
      setEta(null);
    }
  }, [navigationEvent]);


  /* ---------- MAP ACTIONS ---------- */

  const zoomOnEvent = (event: Event) => {
    if (!mapRef.current) return;

    mapRef.current.panTo({
      lat: event.latitude,
      lng: event.longitude,
    });
    mapRef.current.setZoom(16);
  };

  /* ---------- INTERACTIONS ---------- */

  const handleMarkerClick = (event: Event) => {
    setActiveEventId(event.id);

    // scroll card into view
    cardsRef.current[event.id]?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  };

  const handleCardClick = (event: Event) => {
    setActiveEventId(event.id);
    zoomOnEvent(event);
    onEventClick(event); // apre modal
  };

  const centerOnUser = () => {
    if (!position || !mapRef.current) return;

    mapRef.current.panTo(position);
    mapRef.current.setZoom(15);
  };


  if (!isLoaded) {
    return (
      <div className="h-full flex items-center justify-center">
        Caricamento mappa…
      </div>
    );
  }

  /* ---------- HELPERS ---------- */

  const getIcon = (type: Event['type']) => {
    switch (type) {
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
        return MapPin;
    }
  };

  const getColor = (type: Event['type']) => {
    switch (type) {
      case 'club':
        return 'bg-purple-500';
      case 'concert':
        return 'bg-pink-500';
      case 'theater':
        return 'bg-blue-500';
      case 'cinema':
        return 'bg-orange-500';
      case 'restaurant':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTypeLabel = (type: Event['type']) => {
    switch (type) {
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
        return 'Evento';
    }
  };




  /* ---------- RENDER ---------- */

  return (
    <div className="relative w-full h-full">
      {/* 🗺️ MAP */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={position ?? defaultCenter}
        zoom={position ? 14 : 12}
        onLoad={onLoad}
        options={{
          disableDefaultUI: true,
          clickableIcons: false,
          styles: darkMode ? darkMapStyle : undefined,
        }}
      >
        {/* 📍 USER */}
        {position && (
          <OverlayView
            position={position}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg -translate-x-1/2 -translate-y-1/2" />
          </OverlayView>
        )}
        {navigationEvent && (
            <div className="absolute top-4 right-4 z-50">
              <button
                onClick={onCancelNavigation}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-red-700 transition"
              >
                ✕ Termina Navigazione
              </button>
            </div>
          )}


        {/* 📌 EVENTS */}
        {events.map((event) => {
          const Icon = getIcon(event.type);
          const color = getColor(event.type);
          const isActive = activeEventId === event.id;

          return (
            <OverlayView
              key={event.id}
              position={{ lat: event.latitude, lng: event.longitude }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <button
                onClick={() => handleMarkerClick(event)}
                className="relative -translate-x-1/2 -translate-y-1/2"
              >
                <div
                  className={`w-10 h-10 ${color} rounded-full flex items-center justify-center text-white shadow-lg border-2 transition-transform ${
                    isActive
                      ? 'border-black scale-125'
                      : 'border-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </button>
            </OverlayView>
          );
        })}
        {directions && (
        <DirectionsRenderer
          directions={directions}
          options={{
            suppressMarkers: true,
            polylineOptions: {
              strokeColor: '#4f46e5',
              strokeWeight: 5,
            },
          }}
        />
      )}
      {eta && (
        <div className="absolute top-4 left-4 z-50 bg-black/80 text-white px-4 py-2 rounded-lg">
          ETA: {eta}
        </div>
      )}

      </GoogleMap>

      {/* 🎴 CARDS */}
      <div className="absolute bottom-[88px] left-0 right-0 z-20 pointer-events-none">
        <div className="px-4">
          <div className="flex gap-4 overflow-x-auto pb-4 pointer-events-auto scrollbar-hide">
            {events.map((event) => {
              const Icon = getIcon(event.type);
              const color = getColor(event.type);
              const isActive = activeEventId === event.id;

              return (
                <button
                  key={event.id}
                  ref={setCardRef(event.id)}
                  onClick={() => handleCardClick(event)}
                  className={`flex-shrink-0 w-72 rounded-2xl overflow-hidden shadow-xl transition-all ${
                    isActive
                      ? 'scale-105 ring-2 ring-indigo-600 bg-white'
                      : 'bg-white/95'
                  }`}
                >
                  <div className="relative h-36">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className={`absolute top-3 right-3 ${color} text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1`}
                    >
                      <Icon className="w-3 h-3" />
                      {getTypeLabel(event.type)}
                    </div>
                  </div>

                  <div className="p-4 text-left">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">
                      {event.title}
                    </h3>

                    <div className="flex items-center gap-1 text-gray-600 text-xs mb-2">
                      <MapPinIcon className="w-3 h-3" />
                      <span className="truncate">{event.venue}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-indigo-600 text-xs font-medium">
                        <Clock className="w-3 h-3" />
                        {event.time}
                      </div>
                      <div className="text-sm font-bold text-gray-900">
                        {event.price}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 🌙 DARK MODE */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute bottom-24 right-4 z-30 bg-white rounded-full shadow-xl p-4"
      >
        🌙
      </button>
      {/* 📍 CENTRA SU DI ME */}
      <button
        onClick={centerOnUser}
        className="absolute bottom-40 right-4 z-30 bg-white rounded-full shadow-xl p-4 hover:bg-gray-100"
        aria-label="Centra sulla mia posizione"
      >
        📍
      </button>

    </div>
  );
}
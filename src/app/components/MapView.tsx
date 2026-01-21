import {
  GoogleMap,
  useJsApiLoader,
  OverlayView
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

const GOOGLE_LIBRARIES: (
  | 'places'
  | 'geometry'
)[] = ['places', 'geometry'];


const containerStyle = {
  width: '100%',
  height: '100%',
};


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

const isOffRoute = (
  position: google.maps.LatLngLiteral,
  polyline: google.maps.Polyline | null
): boolean => {
  if (!polyline) return false;

  const point = new google.maps.LatLng(position.lat, position.lng);

  return !google.maps.geometry.poly.isLocationOnEdge(
    point,
    polyline,
    0.0002 // ≈ 20m
  );
};


const getClosestPointOnRoute = (
  position: google.maps.LatLngLiteral,
  polyline: google.maps.Polyline
): google.maps.LatLngLiteral => {
  const path = polyline.getPath();
  let minDistance = Infinity;
  let closestPoint = path.getAt(0);

  const point = new google.maps.LatLng(position.lat, position.lng);

  for (let i = 0; i < path.getLength(); i++) {
    const candidate = path.getAt(i);
    const distance =
      google.maps.geometry.spherical.computeDistanceBetween(
        point,
        candidate
      );

    if (distance < minDistance) {
      minDistance = distance;
      closestPoint = candidate;
    }
  }

  return {
    lat: closestPoint.lat(),
    lng: closestPoint.lng(),
  };
};

// Rotazione marker
const calculateBearing = (
  from: google.maps.LatLngLiteral,
  to: google.maps.LatLngLiteral
): number => {
  const lat1 = (from.lat * Math.PI) / 180;
  const lat2 = (to.lat * Math.PI) / 180;
  const dLng = ((to.lng - from.lng) * Math.PI) / 180;

  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

  const bearing = (Math.atan2(y, x) * 180) / Math.PI;
  return (bearing + 360) % 360; // 0–360
};

// zoom navigazione
const getZoomFromSpeed = (speed: number): number => {
  // speed in m/s
  if (speed < 1) return 18;       // fermo / a piedi
  if (speed < 5) return 17;       // camminata veloce
  if (speed < 10) return 16;      // bici / traffico lento
  if (speed < 20) return 15;      // città
  return 14;                      // veloce / extraurbano
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
    libraries: GOOGLE_LIBRARIES,
  });

  const routePolylineRef = useRef<google.maps.Polyline | null>(null);

  const lastPositionRef = useRef<google.maps.LatLngLiteral | null>(null);

  const { position } = useUserLocation();
  const mapRef = useRef<google.maps.Map | null>(null);
  const cardsRef = useRef<Record<string, HTMLButtonElement | null>>({});

  const setCardRef = (id: string) => (el: HTMLButtonElement | null) => {
    cardsRef.current[id] = el;
  };

  const [darkMode, setDarkMode] = useState(false);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  /* -------ETA -------*/
  const [eta, setEta] = useState<string | null>(null);

  /* --- Ricalcolo percorso --- */
  const [userPosition, setUserPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const [routePolyline, setRoutePolyline] =   useState<google.maps.Polyline | null>(null);

  /* --- snap guida ---*/
  const [snappedPosition, setSnappedPosition] = useState<google.maps.LatLngLiteral | null>(null);

  // Movimento fluido
  const animateMarker = (
    from: google.maps.LatLngLiteral,
    to: google.maps.LatLngLiteral,
    duration = 300
  ) => {
    const start = performance.now();

    const animate = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);

      setSnappedPosition({
        lat: from.lat + (to.lat - from.lat) * progress,
        lng: from.lng + (to.lng - from.lng) * progress,
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  // Rotazione marker
  const [heading, setHeading] = useState<number>(0);

  // Nascondo schede durante navigazione
  const isNavigating = Boolean(navigationEvent);


  /* ----------PERCORSO ----------*/
  useEffect(() => {
    if (!navigationEvent) {
      lastPositionRef.current = null;
      return;
    }

    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const newPosition: google.maps.LatLngLiteral = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        /* ---------- PRIMA POSIZIONE ---------- */
        if (!lastPositionRef.current) {
          lastPositionRef.current = newPosition;
          setUserPosition(newPosition);
          setSnappedPosition(newPosition);
          return;
        }

        /* ---------- DISTANZA ---------- */
        const movedMeters = distanceInMeters(
          lastPositionRef.current,
          newPosition
        );

        if (movedMeters < 10) return;

        /* ---------- SNAP VISIVO ---------- */
        let snapped = newPosition;

        if (routePolyline) {
          snapped = getClosestPointOnRoute(
            newPosition,
            routePolyline
          );

          if (snappedPosition) {
            animateMarker(snappedPosition, snapped);
          } else {
            setSnappedPosition(snapped);
          }

          /* ---------- ROTAZIONE MARKER ---------- */
          if (snappedPosition) {
            const newHeading = calculateBearing(
              snappedPosition,
              snapped
            );
            setHeading(newHeading);
          }

          /* ---------- RICALCOLO SOLO SE OFF-ROUTE ---------- */
          if (isOffRoute(newPosition, routePolyline)) {
            setUserPosition(newPosition);
          }
        } else {
          // nessuna navigazione attiva
          setSnappedPosition(newPosition);
          setUserPosition(newPosition);
        }

        /* ---------- ZOOM + PAN AUTOMATICI ---------- */
        if (
          navigationEvent &&
          mapRef.current &&
          pos.coords.speed !== null
        ) {
          const targetZoom = getZoomFromSpeed(pos.coords.speed);
          mapRef.current.setZoom(targetZoom);
          mapRef.current.panTo(snapped);
        }

        lastPositionRef.current = newPosition;
      },
      (err) => {
        console.error('Errore geolocalizzazione', err);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 3000,
        timeout: 10000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [
    navigationEvent,
    routePolyline,
    snappedPosition,
  ]);



  useEffect(() => {
    if (!navigationEvent || !travelMode) return;
    if (!userPosition) return;

    // 🎯 zoom e centro immediato all'avvio navigazione
    if (mapRef.current) {
      mapRef.current.panTo(userPosition);
      mapRef.current.setZoom(17);
    }

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
        if (!navigationEvent) return;

        if (status === 'OK' && result) {
          // 1️⃣ rimuove eventuale percorso precedente
          if (routePolylineRef.current) {
            routePolylineRef.current.setMap(null);
            routePolylineRef.current = null;
           } 

          // 2️⃣ crea la polyline visibile
          const polyline = new google.maps.Polyline({
            path: result.routes[0].overview_path,
            strokeColor: '#4f46e5',
            strokeWeight: 5,
          });

          // 3️⃣ la attacca alla mappa
          polyline.setMap(mapRef.current!);

          // 4️⃣ salva la ref (VISIVA)
          routePolylineRef.current = polyline;

          // 5️⃣ salva anche per snap / off-route
          setRoutePolyline(polyline);

          // 6️⃣ ETA
          const duration = result.routes[0].legs[0].duration?.text;
          setEta(duration ?? null);
        }
      }
    );
  }, [navigationEvent, travelMode, userPosition]);


useEffect(() => {
  if (!navigationEvent) {
    if (routePolylineRef.current) {
      routePolylineRef.current.setMap(null);
      routePolylineRef.current = null;
    }

    setRoutePolyline(null);
    setDirections(null);
    setEta(null);
    setSnappedPosition(null);
    setHeading(0);
    setActiveEventId(null);
    lastPositionRef.current = null;
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
        {(snappedPosition ||  position) && (
          <OverlayView
            position={(snappedPosition ?? position)!}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div
              className="w-5 h-5 bg-blue-600 clip-arrow border-2 border-white shadow-lg transition-transform duration-300"
              style={{
                transform: `translate(-50%, -50%) rotate(${heading}deg)`,
              }}
            />

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
        {!isNavigating && events.map((event) => {
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
        {isNavigating && navigationEvent && (
          <OverlayView
            position={{
              lat: navigationEvent.latitude,
              lng: navigationEvent.longitude,
            }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div className="relative -translate-x-1/2 -translate-y-1/2">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-xl border-4 border-white">
                📍
              </div>
            </div>
          </OverlayView>
        )}
      {eta && (
        <div className="absolute top-4 left-4 z-50 bg-black/80 text-white px-4 py-2 rounded-lg">
          ETA: {eta}
        </div>
      )}

      </GoogleMap>

      {/* 🎴 CARDS */}
      {!isNavigating && (
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
      )}

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
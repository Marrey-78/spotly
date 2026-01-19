import { useEffect, useState } from 'react';

export function useUserLocation() {
  const [position, setPosition] = useState<google.maps.LatLngLiteral | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn('Geolocalizzazione non supportata');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        console.error('Errore geolocalizzazione', err);
      },
      {
        enableHighAccuracy: true, // ✅ FONDAMENTALE
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }, []);

  return { position };
}

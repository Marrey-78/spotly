//const API_URL = 'http://localhost:3000';
const API_URL = import.meta.env.VITE_API_URL;

export async function getPublicEvents() {
  const response = await fetch(`${API_URL}/events/public`);

  if (!response.ok) {
    throw new Error('Errore caricamento eventi pubblici');
  }

  return response.json();
}
export async function getNearbyEvents(
  lat: number,
  lng: number,
  radiusKm = 20
) {
  const response = await fetch(
    `${API_URL}/events/nearby?lat=${lat}&lng=${lng}&radius_km=${radiusKm}`
  );

  if (!response.ok) {
    throw new Error('Errore caricamento eventi vicini');
  }

  return response.json();
}

export async function getEventsByCity(city: string) {
  const response = await fetch(
    `${API_URL}/events/city/${encodeURIComponent(city)}`
  );

  if (!response.ok) {
    throw new Error('Errore caricamento eventi città');
  }

  return response.json();
}
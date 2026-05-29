const API_URL = 'http://localhost:3000';

export async function getPublicEvents() {
  const response = await fetch(`${API_URL}/events/public`);

  if (!response.ok) {
    throw new Error('Errore caricamento eventi pubblici');
  }

  return response.json();
}
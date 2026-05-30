//const API_URL = 'http://localhost:3000';
const API_URL = import.meta.env.VITE_API_URL;
function getAuthHeaders() {
  const token = localStorage.getItem('token');

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function getVenueTypes() {
  const response = await fetch(`${API_URL}/venue-types`);

  if (!response.ok) {
    throw new Error('Errore caricamento tipi locale');
  }

  return response.json();
}

export async function getMyVenues() {
  const response = await fetch(`${API_URL}/venues/my`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Errore caricamento locali');
  }

  return response.json();
}

export async function createVenue(data: {
  venue_type_id: string;
  name: string;
  description?: string;
  address: string;
  city?: string;
  phone?: string;
  instagram_url?: string;
  image_url?: string;
}) {
  const response = await fetch(`${API_URL}/venues`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Errore creazione locale');
  }

  return response.json();
}

export async function deleteVenue(venueId: string) {
  const response = await fetch(`${API_URL}/venues/${venueId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Errore eliminazione locale');
  }

  return response.json();
}
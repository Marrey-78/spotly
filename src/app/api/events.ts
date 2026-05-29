const API_URL = 'http://localhost:3000';

function getAuthHeaders() {
  const token = localStorage.getItem('token');

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function getVenueEvents(venueId: string) {
  const response = await fetch(`${API_URL}/venues/${venueId}/events`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Errore caricamento eventi');
  }

  return response.json();
}

export async function deleteEvent(eventId: string) {
  const response = await fetch(`${API_URL}/events/${eventId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Errore eliminazione evento');
  }

  return response.json();
}

export async function createEvent(data: {
  venue_id: string;
  title: string;
  description?: string;
  event_date: string;
  start_time: string;
  end_time?: string;
  price?: number | null;
  category?: string;
  image_url?: string;
  ticket_url?: string;
  max_participants?: number | null;
}) {
  const response = await fetch(`${API_URL}/events`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Errore creazione evento');
  }

  return response.json();
}
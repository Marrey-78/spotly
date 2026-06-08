const API_URL = import.meta.env.VITE_API_URL;

function getAuthHeaders() {
  const token = localStorage.getItem('token');

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function getFavoriteEvents() {
  const response = await fetch(`${API_URL}/favorites/events`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Errore caricamento preferiti');
  }

  return response.json();
}

export async function addFavoriteEvent(eventId: string) {
  const response = await fetch(`${API_URL}/favorites/events/${eventId}`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Errore aggiunta preferito');
  }

  return response.json();
}

export async function removeFavoriteEvent(eventId: string) {
  const response = await fetch(`${API_URL}/favorites/events/${eventId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Errore rimozione preferito');
  }

  return response.json();
}

export async function getFavoriteVenues() {
  const response = await fetch(`${API_URL}/favorites/venues`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Errore caricamento locali preferiti');
  }

  return response.json();
}

export async function addFavoriteVenue(venueId: string) {
  const response = await fetch(`${API_URL}/favorites/venues/${venueId}`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Errore aggiunta locale preferito');
  }

  return response.json();
}

export async function removeFavoriteVenue(venueId: string) {
  const response = await fetch(`${API_URL}/favorites/venues/${venueId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Errore rimozione locale preferito');
  }

  return response.json();
}

export async function getFavoriteOrganizers() {
  const response = await fetch(`${API_URL}/favorites/organizers`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Errore caricamento organizzazioni preferite');
  }

  return response.json();
}

export async function addFavoriteOrganizer(organizerId: string) {
  const response = await fetch(`${API_URL}/favorites/organizers/${organizerId}`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Errore aggiunta organizzazione preferita');
  }

  return response.json();
}

export async function removeFavoriteOrganizer(organizerId: string) {
  const response = await fetch(`${API_URL}/favorites/organizers/${organizerId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Errore rimozione organizzazione preferita');
  }

  return response.json();
}
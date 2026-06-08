//const API_URL = 'http://localhost:3000';
const API_URL = import.meta.env.VITE_API_URL;

function getAuthHeaders() {
  const token = localStorage.getItem('token');

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function getMyOrganizers() {
  const response = await fetch(`${API_URL}/organizers/my`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Errore caricamento organizzatori');
  }

  return response.json();
}

export async function createOrganizer(data: {
  name: string;
  description?: string;
  phone?: string;
  email?: string;
  website_url?: string;
  instagram_url?: string;
  image_url?: string;
}) {
  const response = await fetch(`${API_URL}/organizers`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Errore creazione organizzatore');
  }

  return response.json();
}

export async function deleteOrganizer(organizerId: string) {
  const response = await fetch(`${API_URL}/organizers/${organizerId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Errore eliminazione organizzatore');
  }

  return response.json();
}

export async function updateOrganizer(
  organizerId: string,
  data: {
    name: string;
    description?: string;
    phone?: string;
    email?: string;
    website_url?: string;
    instagram_url?: string;
    image_url?: string;
  }
  ) {
    const response = await fetch(`${API_URL}/organizers/${organizerId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {
      throw new Error('Errore modifica organizzatore');
    }
  
    return response.json();
}
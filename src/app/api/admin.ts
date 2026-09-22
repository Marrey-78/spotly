const API_URL = import.meta.env.VITE_API_URL;

export interface CreateAdminVenuePayload {
  venue_type_id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  phone?: string;
  email?: string;
  website_url?: string;
  instagram_url?: string;
  image_url?: string;
  source_url?: string;
}

export async function createAdminVenue(
  payload: CreateAdminVenuePayload
) {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Token non presente');
  }

  const response = await fetch(`${API_URL}/admin/venues`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.detail || 'Errore durante la creazione del locale'
    );
  }

  return response.json();
}
const API_URL = import.meta.env.VITE_API_URL;

function getAuthHeaders() {
  const token = localStorage.getItem('token');

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function getMyProfile() {
  const response = await fetch(`${API_URL}/users/me`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Errore caricamento profilo');
  }

  return response.json();
}

export async function updateMyProfile(data: {
  name: string;
  email: string;
  city?: string;
  avatar?: string;
}) {
  const response = await fetch(`${API_URL}/users/me`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Errore aggiornamento profilo');
  }

  return response.json();
}

export async function changeMyPassword(data: {
  old_password: string;
  new_password: string;
}) {
  const response = await fetch(`${API_URL}/users/me/password`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Errore cambio password');
  }

  return response.json();
}

export async function uploadMyAvatar(file: File) {
  const token = localStorage.getItem('token');

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/users/me/avatar`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Errore upload avatar');
  }

  return response.json();
}
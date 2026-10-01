//const API_URL = 'http://localhost:3000/auth';
const API_URL = import.meta.env.VITE_API_URL;

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  hasVenue: boolean;
}) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Errore registrazione');
  }

  return response.json();
}

export async function loginUser(data: {
  email: string;
  password: string;
}) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Credenziali non valide');
  }

  return response.json();
}

export async function loginWithFirebase(idToken: string) {
  const response = await fetch(`${API_URL}/auth/firebase`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id_token: idToken,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('ERRORE BACKEND FIREBASE:', data);
    throw new Error(
      data.detail || 'Autenticazione Firebase fallita'
    );
  }

  return data;
}
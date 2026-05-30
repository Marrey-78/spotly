//const API_URL = 'http://localhost:3000';
const API_URL = import.meta.env.VITE_API_URL;

export async function getDefaultEventImages() {
  const response = await fetch(`${API_URL}/event-images/defaults`);

  if (!response.ok) {
    throw new Error('Errore caricamento immagini default');
  }

  return response.json();
}

export async function uploadEventImage(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/uploads/event-image`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Errore upload immagine');
  }

  return response.json();
}
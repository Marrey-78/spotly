import { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, Clock, Euro, Plus, Ticket, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { createEvent, getVenueEvents, deleteEvent } from '../api/events';
import { getDefaultEventImages, uploadEventImage } from '../api/eventImages';

interface Venue {
  id: string;
  name: string;
}

interface EventItem {
  id: string;
  title: string;
  description?: string;
  event_date: string;
  start_time: string;
  end_time?: string;
  price?: number;
  category?: string;
  image_url?: string;
  ticket_url?: string;
  max_participants?: number;
}

interface EventsManagerViewProps {
  venue: Venue;
  onBack: () => void;
}

interface DefaultImage {
  id: string;
  title: string;
  category?: string;
  image_url: string;
}

export function EventsManagerView({ venue, onBack }: EventsManagerViewProps) {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [defaultImages, setDefaultImages] = useState<DefaultImage[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    start_time: '',
    end_time: '',
    price: '',
    category: '',
    image_url: '',
    ticket_url: '',
    max_participants: '',
  });

  const loadEvents = async () => {
    try {
      const images = await getDefaultEventImages();
      setDefaultImages(images);
      const data = await getVenueEvents(venue.id);
      setEvents(data);
    } catch (error) {
      console.error(error);
      alert('Errore caricamento eventi');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [venue.id]);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createEvent({
        venue_id: venue.id,
        title: formData.title,
        description: formData.description || undefined,
        event_date: formData.event_date,
        start_time: formData.start_time,
        end_time: formData.end_time || undefined,
        price: formData.price ? Number(formData.price) : null,
        category: formData.category || undefined,
        image_url: formData.image_url || undefined,
        ticket_url: formData.ticket_url || undefined,
        max_participants: formData.max_participants
          ? Number(formData.max_participants)
          : null,
      });

      setFormData({
        title: '',
        description: '',
        event_date: '',
        start_time: '',
        end_time: '',
        price: '',
        category: '',
        image_url: '',
        ticket_url: '',
        max_participants: '',
      });

      setShowForm(false);
      setIsLoading(true);
      await loadEvents();
    } catch (error) {
      console.error(error);
      alert('Errore creazione evento');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    const confirmed = window.confirm(
      'Sei sicuro di voler eliminare questo evento?'
    );
  
    if (!confirmed) return;
  
    try {
      await deleteEvent(eventId);
      await loadEvents();
    } catch (error) {
      console.error(error);
      alert('Errore durante eliminazione evento');
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploadingImage(true);

      const result = await uploadEventImage(file);

      setFormData((prev) => ({
        ...prev,
        image_url: result.image_url,
      }));
    } catch (error) {
      console.error(error);
      alert('Errore caricamento immagine');
    } finally {
      setIsUploadingImage(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="text-sm text-gray-600">Caricamento eventi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50 p-4 pb-24">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-indigo-600 font-medium mb-4"
      >
        <ArrowLeft className="w-5 h-5" />
        Torna ai locali
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{venue.name}</h1>
        <p className="text-gray-600">Gestisci gli eventi di questo locale.</p>
      </div>

      {!showForm && (
        <Button
          onClick={() => setShowForm(true)}
          className="w-full h-12 rounded-xl bg-indigo-600 text-white font-semibold mb-6"
        >
          <Plus className="w-5 h-5 mr-2" />
          Crea nuovo evento
        </Button>
      )}

      {showForm && (
        <form
          onSubmit={handleCreateEvent}
          className="bg-white rounded-2xl shadow-md p-4 space-y-4 mb-6"
        >
          <h2 className="text-lg font-bold text-gray-900">Nuovo evento</h2>

          <Input
            placeholder="Titolo evento"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />

          <Input
            placeholder="Descrizione"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <Input
            type="date"
            value={formData.event_date}
            onChange={(e) =>
              setFormData({ ...formData, event_date: e.target.value })
            }
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              type="time"
              value={formData.start_time}
              onChange={(e) =>
                setFormData({ ...formData, start_time: e.target.value })
              }
              required
            />

            <Input
              type="time"
              value={formData.end_time}
              onChange={(e) =>
                setFormData({ ...formData, end_time: e.target.value })
              }
            />
          </div>

          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full h-12 rounded-xl border border-gray-300 px-3 bg-white text-gray-900"
            required
          >
            <option value="">Seleziona categoria</option>
            <option value="club">Discoteca / Party</option>
            <option value="concert">Concerto / Live Music</option>
            <option value="theater">Teatro / Spettacolo</option>
            <option value="cinema">Cinema</option>
            <option value="restaurant">Ristorante / Cena</option>
            <option value="restaurant">Pub / Bar</option>
            <option value="restaurant">Lounge Bar</option>
          </select>

          <Input
            type="number"
            placeholder="Prezzo"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
          />

          <Input
            type="number"
            placeholder="Numero massimo partecipanti"
            value={formData.max_participants}
            onChange={(e) =>
              setFormData({
                ...formData,
                max_participants: e.target.value,
              })
            }
          />

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Immagine evento
            </label>

            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
              }}
            />

            {isUploadingImage && (
              <p className="text-sm text-gray-500">Caricamento immagine...</p>
            )}

            {formData.image_url && (
              <img
                src={formData.image_url}
                alt="Anteprima evento"
                className="w-full h-36 object-cover rounded-xl"
              />
            )}

            <p className="text-sm font-medium text-gray-700">
              Oppure scegli una foto default
            </p>
          
            <div className="grid grid-cols-3 gap-3">
              {defaultImages.map((image) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      image_url: image.image_url,
                    })
                  }
                  className={`rounded-xl overflow-hidden border-2 ${
                    formData.image_url === image.image_url
                      ? 'border-indigo-600'
                      : 'border-transparent'
                  }`}
                >
                  <img
                    src={image.image_url}
                    alt={image.title}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <Input
            placeholder="URL biglietti"
            value={formData.ticket_url}
            onChange={(e) =>
              setFormData({ ...formData, ticket_url: e.target.value })
            }
          />

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowForm(false)}
              className="flex-1 h-12 rounded-xl"
            >
              Annulla
            </Button>

            <Button
              type="submit"
              className="flex-1 h-12 rounded-xl bg-indigo-600 text-white"
            >
              Salva
            </Button>
          </div>
        </form>
      )}

      {events.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <Calendar className="w-12 h-12 mx-auto text-indigo-600 mb-3" />
          <h2 className="text-lg font-bold text-gray-900 mb-1">
            Nessun evento ancora
          </h2>
          <p className="text-gray-600 text-sm">
            Crea il primo evento per questo locale.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden"
            >
              {event.image_url && (
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-36 object-cover"
                />
              )}

              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {event.title}
                    </h2>

                    {event.category && (
                      <p className="text-sm text-indigo-600 font-medium">
                        {event.category}
                      </p>
                    )}
                  </div>

                  <Calendar className="w-6 h-6 text-gray-400" />
                </div>

                {event.description && (
                  <p className="text-gray-600 text-sm mt-3">
                    {event.description}
                  </p>
                )}

                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{event.event_date}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>
                      {event.start_time}
                      {event.end_time ? ` - ${event.end_time}` : ''}
                    </span>
                  </div>

                  {event.price !== undefined && event.price !== null && (
                    <div className="flex items-center gap-2">
                      <Euro className="w-4 h-4" />
                      <span>{event.price} €</span>
                    </div>
                  )}

                  {event.ticket_url && (
                    <div className="flex items-center gap-2">
                      <Ticket className="w-4 h-4" />
                      <span>Biglietti disponibili</span>
                    </div>
                  )}

                  <Button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="w-full mt-4 h-11 rounded-xl bg-red-50 text-red-600 hover:bg-red-100"
                      variant="ghost"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Elimina evento
                    </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
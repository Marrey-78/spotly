import { useEffect, useState } from 'react';
import { Store, Plus, MapPin, Phone, Instagram } from 'lucide-react';
import { getVenueTypes, getMyVenues, createVenue, deleteVenue } from '../api/venues';
import { Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { EventsManagerView } from './EventsManagerView';

interface VenueType {
  id: string;
  code: string;
  name: string;
}

interface Venue {
  id: string;
  name: string;
  description?: string;
  address: string;
  city?: string;
  phone?: string;
  instagram_url?: string;
  venue_type_name?: string;
}

export function VenuesView() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [venueTypes, setVenueTypes] = useState<VenueType[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

  const [formData, setFormData] = useState({
    venue_type_id: '',
    name: '',
    description: '',
    address: '',
    city: '',
    phone: '',
    instagram_url: '',
    image_url: '',
  });

  const loadData = async () => {
    try {
      const [typesData, venuesData] = await Promise.all([
        getVenueTypes(),
        getMyVenues(),
      ]);

      setVenueTypes(typesData);
      setVenues(venuesData);

      if (typesData.length > 0 && !formData.venue_type_id) {
        setFormData((prev) => ({
          ...prev,
          venue_type_id: typesData[0].id,
        }));
      }
    } catch (error) {
      console.error(error);
      alert('Errore caricamento locali');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateVenue = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createVenue(formData);

      setFormData({
        venue_type_id: venueTypes[0]?.id || '',
        name: '',
        description: '',
        address: '',
        city: '',
        phone: '',
        instagram_url: '',
        image_url: '',
      });

      setShowForm(false);
      await loadData();
    } catch (error) {
      console.error(error);
      alert('Errore durante la creazione del locale');
    }
  };
  const handleDeleteVenue = async (venueId: string) => {
    const confirmed = window.confirm(
      'Sei sicuro di voler eliminare questo locale? Verranno eliminati anche tutti gli eventi collegati.'
    );

    if (!confirmed) return;

    try {
      await deleteVenue(venueId);
      await loadData();
    } catch (error) {
      console.error(error);
      alert('Errore durante eliminazione locale');
    }
  };


  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="text-sm text-gray-600">Caricamento locali...</p>
        </div>
      </div>
    );
  }

  if (selectedVenue) {
  return (
    <EventsManagerView
      venue={selectedVenue}
      onBack={() => setSelectedVenue(null)}
    />
  );
}

  return (
    <div className="h-full overflow-y-auto bg-gray-50 p-4 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">I miei locali</h1>
        <p className="text-gray-600">
          Gestisci i locali collegati al tuo account.
        </p>
      </div>

      {!showForm && (
        <Button
          onClick={() => setShowForm(true)}
          className="w-full h-12 rounded-xl bg-indigo-600 text-white font-semibold mb-6"
        >
          <Plus className="w-5 h-5 mr-2" />
          Crea nuovo locale
        </Button>
      )}

      {showForm && (
        <form
          onSubmit={handleCreateVenue}
          className="bg-white rounded-2xl shadow-md p-4 space-y-4 mb-6"
        >
          <h2 className="text-lg font-bold text-gray-900">
            Nuovo locale
          </h2>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Tipo locale
            </label>
            <select
              value={formData.venue_type_id}
              onChange={(e) =>
                setFormData({ ...formData, venue_type_id: e.target.value })
              }
              className="mt-1 w-full h-12 rounded-xl border border-gray-300 px-3"
              required
            >
              {venueTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            placeholder="Nome locale"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
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
            placeholder="Indirizzo"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            required
          />

          <Input
            placeholder="Città"
            value={formData.city}
            onChange={(e) =>
              setFormData({ ...formData, city: e.target.value })
            }
          />

          <Input
            placeholder="Telefono"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />

          <Input
            placeholder="Instagram URL"
            value={formData.instagram_url}
            onChange={(e) =>
              setFormData({ ...formData, instagram_url: e.target.value })
            }
          />

          <Input
            placeholder="Immagine URL"
            value={formData.image_url}
            onChange={(e) =>
              setFormData({ ...formData, image_url: e.target.value })
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

      {venues.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <Store className="w-12 h-12 mx-auto text-indigo-600 mb-3" />
          <h2 className="text-lg font-bold text-gray-900 mb-1">
            Nessun locale ancora
          </h2>
          <p className="text-gray-600 text-sm">
            Crea il tuo primo locale per iniziare a pubblicare eventi.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {venues.map((venue) => (
            <div
              key={venue.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {venue.name}
                    </h2>
                    <p className="text-sm text-indigo-600 font-medium">
                      {venue.venue_type_name}
                    </p>
                  </div>

                  <Store className="w-6 h-6 text-gray-400" />
                </div>

                {venue.description && (
                  <p className="text-gray-600 text-sm mt-3">
                    {venue.description}
                  </p>
                )}

                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {venue.address}
                      {venue.city ? `, ${venue.city}` : ''}
                    </span>
                  </div>

                  {venue.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{venue.phone}</span>
                    </div>
                  )}

                  {venue.instagram_url && (
                    <div className="flex items-center gap-2">
                      <Instagram className="w-4 h-4" />
                      <span>{venue.instagram_url}</span>
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => setSelectedVenue(venue)}
                  className="w-full mt-4 h-11 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                  variant="ghost"
                >
                  Gestisci eventi
                </Button>
                
                <Button
                    onClick={() => handleDeleteVenue(venue.id)}
                    className="w-full mt-2 h-11 rounded-xl bg-red-50 text-red-600 hover:bg-red-100"
                    variant="ghost"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Elimina locale
                  </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
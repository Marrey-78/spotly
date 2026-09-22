import { useEffect, useState } from 'react';
import { Shield, Store, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { getVenueTypes } from '../api/venues';
import { createAdminVenue } from '../api/admin';

interface VenueType {
  id: string;
  code: string;
  name: string;
}

export function AdminView() {
  const [venueTypes, setVenueTypes] = useState<VenueType[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    venue_type_id: '',
    name: '',
    description: '',
    address: '',
    city: 'Torino',
    phone: '',
    email: '',
    website_url: '',
    instagram_url: '',
    image_url: '',
    source_url: '',
  });

  useEffect(() => {
    const loadVenueTypes = async () => {
      try {
        const data = await getVenueTypes();

        setVenueTypes(data);

        if (data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            venue_type_id: data[0].id,
          }));
        }
      } catch (error) {
        console.error(error);
        alert('Errore caricamento tipologie locali');
      }
    };

    loadVenueTypes();
  }, []);

  const resetForm = () => {
    setFormData({
      venue_type_id: venueTypes[0]?.id || '',
      name: '',
      description: '',
      address: '',
      city: 'Torino',
      phone: '',
      email: '',
      website_url: '',
      instagram_url: '',
      image_url: '',
      source_url: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSaving(true);

      await createAdminVenue({
        venue_type_id: formData.venue_type_id,
        name: formData.name,
        description: formData.description || undefined,
        address: formData.address,
        city: formData.city,
        phone: formData.phone || undefined,
        email: formData.email || undefined,
        website_url: formData.website_url || undefined,
        instagram_url: formData.instagram_url || undefined,
        image_url: formData.image_url || undefined,
        source_url: formData.source_url || undefined,
      });

      alert('Locale Flode creato correttamente');

      resetForm();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : 'Errore durante la creazione del locale'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50 p-4 pb-24">

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Flode Admin
            </h1>

            <p className="text-sm text-gray-500">
              Gestione contenuti della piattaforma
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Store className="w-5 h-5 text-indigo-600" />

          <h2 className="text-lg font-bold text-gray-900">
            Inserisci locale
          </h2>
        </div>

        <p className="text-sm text-gray-500 mb-5">
          Il locale verrà creato come non rivendicato e senza proprietario.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <div>
            <label className="text-sm font-medium text-gray-700">
              Tipo locale
            </label>

            <select
              value={formData.venue_type_id}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  venue_type_id: e.target.value,
                })
              }
              className="mt-1 w-full h-12 rounded-xl border border-gray-300 px-3"
              required
            >
              {venueTypes.map((type) => (
                <option
                  key={type.id}
                  value={type.id}
                >
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            placeholder="Nome locale"
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
            required
          />

          <Input
            placeholder="Descrizione"
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value,
              })
            }
          />

          <Input
            placeholder="Indirizzo"
            value={formData.address}
            onChange={(e) =>
              setFormData({
                ...formData,
                address: e.target.value,
              })
            }
            required
          />

          <Input
            placeholder="Città"
            value={formData.city}
            onChange={(e) =>
              setFormData({
                ...formData,
                city: e.target.value,
              })
            }
            required
          />

          <Input
            placeholder="Telefono"
            value={formData.phone}
            onChange={(e) =>
              setFormData({
                ...formData,
                phone: e.target.value,
              })
            }
          />

          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value,
              })
            }
          />

          <Input
            placeholder="Sito web"
            value={formData.website_url}
            onChange={(e) =>
              setFormData({
                ...formData,
                website_url: e.target.value,
              })
            }
          />

          <Input
            placeholder="Instagram URL"
            value={formData.instagram_url}
            onChange={(e) =>
              setFormData({
                ...formData,
                instagram_url: e.target.value,
              })
            }
          />

          <Input
            placeholder="Immagine URL"
            value={formData.image_url}
            onChange={(e) =>
              setFormData({
                ...formData,
                image_url: e.target.value,
              })
            }
          />

          <div className="pt-2 border-t border-gray-100">
            <label className="text-sm font-medium text-gray-700">
              Fonte
            </label>

            <Input
              className="mt-1"
              placeholder="URL fonte informazioni"
              value={formData.source_url}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  source_url: e.target.value,
                })
              }
            />

            <p className="text-xs text-gray-400 mt-1">
              Pagina utilizzata per verificare le informazioni del locale.
            </p>
          </div>

          <Button
            type="submit"
            disabled={isSaving}
            className="w-full h-12 rounded-xl bg-indigo-600 text-white font-semibold"
          >
            <Plus className="w-5 h-5 mr-2" />

            {isSaving
              ? 'Inserimento...'
              : 'Aggiungi locale a Flode'}
          </Button>

        </form>
      </div>
    </div>
  );
}
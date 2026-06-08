import { useEffect, useState } from 'react';
import { Store, Plus, MapPin, Phone, Instagram , Heart} from 'lucide-react';
import { getVenueTypes, getMyVenues, createVenue, deleteVenue, updateVenue } from '../api/venues';
import { Trash2, Pencil} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { EventsManagerView } from './EventsManagerView';
import { getMyOrganizers, createOrganizer, deleteOrganizer, updateOrganizer} from '../api/organizers';
import { OrganizerEventsManagerView } from './OrganizerEventsManager';

interface VenueType {
  id: string;
  code: string;
  name: string;
}

interface Venue {
  id: string;
  venue_type_id: string;
  name: string;
  description?: string;
  address: string;
  city?: string;
  phone?: string;
  email?: string;
  website_url?: string;
  instagram_url?: string;
  image_url?: string;
  venue_type_name?: string;
}

interface Organizer {
  id: string;
  name: string;
  description?: string;
  phone?: string;
  email?: string;
  website_url?: string;
  instagram_url?: string;
  image_url?: string;
}

interface VenuesViewProps {
  venueFavorites?: Set<string>;
  organizerFavorites?: Set<string>;
  onToggleVenueFavorite?: (venueId: string) => void;
  onToggleOrganizerFavorite?: (organizerId: string) => void;
}

export function VenuesView({
  venueFavorites = new Set(),
  organizerFavorites = new Set(),
  onToggleVenueFavorite,
  onToggleOrganizerFavorite,
}: VenuesViewProps = {}) {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [venueTypes, setVenueTypes] = useState<VenueType[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [activeTab, setActiveTab] = useState<'venues' | 'organizers'>('venues');
  const [showOrganizerForm, setShowOrganizerForm] = useState(false);
  const [selectedOrganizer, setSelectedOrganizer] = useState<Organizer | null>(null);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [editingOrganizer, setEditingOrganizer] = useState<Organizer | null>(null);
  

  const [organizerFormData, setOrganizerFormData] = useState({
    name: '',
    description: '',
    phone: '',
    email: '',
    website_url: '',
    instagram_url: '',
    image_url: '',
  });

  
  const [formData, setFormData] = useState({
    venue_type_id: '',
    name: '',
    description: '',
    address: '',
    city: '',
    phone: '',
    email: '',
    website_url: '',
    instagram_url: '',
    image_url: '',
  });

  const loadData = async () => {
    try {
      const [typesData, venuesData, organizersData] = await Promise.all([
        getVenueTypes(),
        getMyVenues(),
        getMyOrganizers(),
      ]);

      setVenueTypes(typesData);
      setVenues(venuesData);
      setOrganizers(organizersData);

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

  const resetVenueForm = () => {
    setFormData({
      venue_type_id: venueTypes[0]?.id || '',
      name: '',
      description: '',
      address: '',
      city: '',
      phone: '',
      email: '',
      website_url: '',
      instagram_url: '',
      image_url: '',
    });
  };

  const resetOrganizerForm = () => {
    setOrganizerFormData({
      name: '',
      description: '',
      phone: '',
      email: '',
      website_url: '',
      instagram_url: '',
      image_url: '',
    });
  };

  const handleCreateVenue = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
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
      };

      if (editingVenue) {
        await updateVenue(editingVenue.id, payload);
      } else {
        await createVenue(payload);
      }

      setEditingVenue(null);

      resetVenueForm();

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
  
  const handleCreateOrganizer = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const payload = {
        name: organizerFormData.name,
        description: organizerFormData.description || undefined,
        phone: organizerFormData.phone || undefined,
        email: organizerFormData.email || undefined,
        website_url: organizerFormData.website_url || undefined,
        instagram_url: organizerFormData.instagram_url || undefined,
        image_url: organizerFormData.image_url || undefined,
      };
    
      if (editingOrganizer) {
        await updateOrganizer(editingOrganizer.id, payload);
      } else {
        await createOrganizer(payload);
      }
    
      setEditingOrganizer(null);
      resetOrganizerForm();
      setShowOrganizerForm(false);
      await loadData();
    } catch (error) {
      console.error(error);
      alert('Errore durante il salvataggio organizzatore');
    }
  };

  const handleDeleteOrganizer = async (organizerId: string) => {
    const confirmed = window.confirm(
      'Sei sicuro di voler eliminare questo organizzatore? Verranno eliminati anche gli eventi collegati.'
    );

    if (!confirmed) return;

    try {
      await deleteOrganizer(organizerId);
      await loadData();
    } catch (error) {
      console.error(error);
      alert('Errore durante eliminazione organizzatore');
    }
  };

  const startEditOrganizer = (organizer: Organizer) => {
    setEditingOrganizer(organizer);

    setOrganizerFormData({
      name: organizer.name || '',
      description: organizer.description || '',
      phone: organizer.phone || '',
      email: organizer.email || '',
      website_url: organizer.website_url || '',
      instagram_url: organizer.instagram_url || '',
      image_url: organizer.image_url || '',
    });
  };

  const startEditVenue = (venue: Venue) => {
    setEditingVenue(venue);

    setFormData({
      venue_type_id: venue.venue_type_id || venueTypes[0]?.id || '',
      name: venue.name || '',
      description: venue.description || '',
      address: venue.address || '',
      city: venue.city || '',
      phone: venue.phone || '',
      email: venue.email || '',
      website_url: venue.website_url || '',
      instagram_url: venue.instagram_url || '',
      image_url: venue.image_url || '',
    });
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

  if (selectedOrganizer) {
    return (
      <OrganizerEventsManagerView
        organizer={selectedOrganizer}
        onBack={() => setSelectedOrganizer(null)}
      />
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50 p-4 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">I miei locali</h1>
        <div className="grid grid-cols-2 gap-2 mb-6">
          <button
            onClick={() => setActiveTab('venues')}
            className={`h-11 rounded-xl font-semibold ${
              activeTab === 'venues'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600'
            }`}
          >
            Locali
          </button>
          
          <button
            onClick={() => setActiveTab('organizers')}
            className={`h-11 rounded-xl font-semibold ${
              activeTab === 'organizers'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600'
            }`}
          >
            Organizzatori
          </button>
        </div>
        <p className="text-gray-600">
          Gestisci i locali collegati al tuo account.
        </p>
      </div>
      {activeTab === 'venues' && (  
          <>    
        {!showForm && (
          <Button
           onClick={() => {
                setEditingVenue(null);
                resetVenueForm();
                setShowForm(true);
              }}
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
                onClick={() => {
                  setEditingVenue(null);
                  resetVenueForm();
                  setShowForm(false);
                }}
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
            {venues.map((venue) => {
              const isEditing = editingVenue?.id === venue.id;

              return (
                <div
                  key={venue.id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden"
                >
                  
                {isEditing ? (
                                  
                  <form
                    onSubmit={handleCreateVenue}
                    className="p-4 space-y-4"
                  >
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Nome locale"
                      required
                    />

                    <Input
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="Descrizione"
                    />

                    <Input
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      placeholder="Indirizzo"
                      required
                    />

                    <Input
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      placeholder="Città"
                      required
                    />

                    <Input
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="Telefono"
                    />

                    <Input
                      value={formData.instagram_url}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          instagram_url: e.target.value,
                        })
                      }
                      placeholder="Instagram"
                    />

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEditingVenue(null)}
                        className="flex-1"
                      >
                        Annulla
                      </Button>
                    
                      <Button
                        type="submit"
                        className="flex-1 bg-indigo-600 text-white"
                      >
                        Salva modifiche
                      </Button>
                    </div>
                  </form>

                ) : (
                
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

                    

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onToggleVenueFavorite?.(venue.id)}
                        className="w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center"
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            venueFavorites.has(venue.id)
                              ? 'fill-red-500 text-red-500'
                              : 'text-gray-400'
                          }`}
                        />
                      </button>
                        
                      <Store className="w-6 h-6 text-gray-400" />
                    </div>
                    
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
                      onClick={() => startEditVenue(venue)}
                      className="w-full mt-2 h-11 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                      variant="ghost"
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Modifica locale
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

                )}
                </div>
              );
        })}
          </div>
        )}
        </>
      )}
      {activeTab === 'organizers' && (
        <>
        
          {!showOrganizerForm && (
            <Button
              onClick={() => {
                setEditingOrganizer(null);
                resetOrganizerForm();
                setShowOrganizerForm(true);
              }}
              className="w-full h-12 rounded-xl bg-indigo-600 text-white font-semibold mb-6"
            >
              + Crea organizzatore
            </Button>
          )}

          {showOrganizerForm && (
            <form
              onSubmit={handleCreateOrganizer}
              className="bg-white rounded-2xl shadow-md p-4 space-y-4 mb-6"
            >
              <h2 className="text-lg font-bold text-gray-900">
                {editingOrganizer ? 'Modifica organizzatore' : 'Nuovo organizzatore'}
              </h2>
          
              <Input
                placeholder="Nome organizzazione"
                value={organizerFormData.name}
                onChange={(e) =>
                  setOrganizerFormData({
                    ...organizerFormData,
                    name: e.target.value,
                  })
                }
                required
              />

              <Input
                placeholder="Descrizione"
                value={organizerFormData.description}
                onChange={(e) =>
                  setOrganizerFormData({
                    ...organizerFormData,
                    description: e.target.value,
                  })
                }
              />

              <Input
                placeholder="Telefono"
                value={organizerFormData.phone}
                onChange={(e) =>
                  setOrganizerFormData({
                    ...organizerFormData,
                    phone: e.target.value,
                  })
                }
              />

              <Input
                placeholder="Email"
                value={organizerFormData.email}
                onChange={(e) =>
                  setOrganizerFormData({
                    ...organizerFormData,
                    email: e.target.value,
                  })
                }
              />

              <Input
                placeholder="Website URL"
                value={organizerFormData.website_url}
                onChange={(e) =>
                  setOrganizerFormData({
                    ...organizerFormData,
                    website_url: e.target.value,
                  })
                }
              />

              <Input
                placeholder="Instagram URL"
                value={organizerFormData.instagram_url}
                onChange={(e) =>
                  setOrganizerFormData({
                    ...organizerFormData,
                    instagram_url: e.target.value,
                  })
                }
              />

              <Input
                placeholder="Immagine URL"
                value={organizerFormData.image_url}
                onChange={(e) =>
                  setOrganizerFormData({
                    ...organizerFormData,
                    image_url: e.target.value,
                  })
                }
              />

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                      setEditingOrganizer(null);
                      resetOrganizerForm();
                      setShowOrganizerForm(false);
                  }}
                  className="flex-1 h-12 rounded-xl"
                >
                  Annulla
                </Button>
              
                <Button
                  type="submit"
                  className="flex-1 h-12 rounded-xl bg-indigo-600 text-white"
                >
                  {editingOrganizer ? 'Salva modifiche' : 'Salva'}
                </Button>
              </div>
            </form>
          )}

          {organizers.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-6 text-center">
              <h2 className="text-lg font-bold text-gray-900 mb-1">
                Nessun organizzatore ancora
              </h2>
              <p className="text-gray-600 text-sm">
                Crea un organizzatore per pubblicare eventi in città.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {organizers.map((organizer) => {
                const isEditingOrganizer = editingOrganizer?.id === organizer.id;

                return (  
                  <div
                    key={organizer.id}
                    className="bg-white rounded-2xl shadow-md overflow-hidden"
                  >
                  {isEditingOrganizer ? (

                    <form
                      onSubmit={handleCreateOrganizer}
                      className="p-4 space-y-4"
                    >
                      <Input
                        value={organizerFormData.name}
                        onChange={(e) =>
                          setOrganizerFormData({
                            ...organizerFormData,
                            name: e.target.value,
                          })
                        }
                        placeholder="Nome organizzatore"
                        required
                      />

                      <Input
                        value={organizerFormData.description}
                        onChange={(e) =>
                          setOrganizerFormData({
                            ...organizerFormData,
                            description: e.target.value,
                          })
                        }
                        placeholder="Descrizione"
                      />

                      <Input
                        value={organizerFormData.phone}
                        onChange={(e) =>
                          setOrganizerFormData({
                            ...organizerFormData,
                            phone: e.target.value,
                          })
                        }
                        placeholder="Telefono"
                      />

                      <Input
                        value={organizerFormData.instagram_url}
                        onChange={(e) =>
                          setOrganizerFormData({
                            ...organizerFormData,
                            instagram_url: e.target.value,
                          })
                        }
                        placeholder="Instagram"
                      />

                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setEditingOrganizer(null);
                            resetOrganizerForm();
                          }}
                          className="flex-1"
                        >
                          Annulla
                        </Button>
                      
                        <Button
                          type="submit"
                          className="flex-1 bg-indigo-600 text-white"
                        >
                          Salva modifiche
                        </Button>
                      </div>
                    </form>

                  ) : (
                  
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <h2 className="text-lg font-bold text-gray-900">
                          {organizer.name}
                        </h2>

                        <button
                          type="button"
                          onClick={() => onToggleOrganizerFavorite?.(organizer.id)}
                          className="w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center"
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              organizerFavorites.has(organizer.id)
                                ? 'fill-red-500 text-red-500'
                                : 'text-gray-400'
                            }`}
                          />
                        </button>
                      </div>
                  
                      {organizer.description && (
                        <p className="text-gray-600 text-sm mt-2">
                          {organizer.description}
                        </p>
                      )}

                      {organizer.phone && (
                        <p className="text-gray-600 text-sm mt-2">
                          {organizer.phone}
                        </p>
                      )}

                      <Button
                        onClick={() => setSelectedOrganizer(organizer)}
                        className="w-full mt-4 h-11 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                        variant="ghost"
                      >
                        Gestisci eventi
                      </Button>
                    
                      <Button
                        onClick={() => startEditOrganizer(organizer)}
                        className="w-full mt-2 h-11 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                        variant="ghost"
                      >
                        <Pencil className="w-4 h-4 mr-2" />
                        Modifica organizzatore
                      </Button>
                    
                      <Button
                        onClick={() => handleDeleteOrganizer(organizer.id)}
                        className="w-full mt-2 h-11 rounded-xl bg-red-50 text-red-600 hover:bg-red-100"
                        variant="ghost"
                      >
                        Elimina organizzatore
                      </Button>
                    </div>

                  )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
import { useState, useEffect } from 'react';
import { DateSelector } from './app/components/DateSelector';
import { BottomNav, type NavSection } from './app/components/BottomNav';
import { MapView } from './app/components/MapView';
import { EventsList } from './app/components/EventsList';
import { ProfileView } from './app/components/ProfileView';
import { EventDetailModal } from './app/components/EventDetailModal';
import type { Event } from './app/types/event';
import { LoginView } from './app/components/LoginView';
import { VenuesView } from './app/components/VenuesView';
import { getPublicEvents, getNearbyEvents, getEventsByCity } from './app/api/publicEvents';
import { getFavoriteEvents, addFavoriteEvent, removeFavoriteEvent, getFavoriteVenues, addFavoriteVenue, removeFavoriteVenue,
  getFavoriteOrganizers, addFavoriteOrganizer, removeFavoriteOrganizer} from './app/api/favorites';
import { getMyProfile, updateMyProfile } from './app/api/users';

// Login
interface UserData {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'user' | 'venue_owner';
}

export default function App() {
  // Set today's date as default
  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Benvenuto più login
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  
  
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [activeSection, setActiveSection] = useState<NavSection>('home');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Events
  const [events, setEvents] = useState<Event[]>([]);
  const [isEventsLoading, setIsEventsLoading] = useState(true);
  const filteredEvents = events.filter((event) => event.date === selectedDate);
  const favoriteEvents = events.filter((event) => favorites.has(event.id));
  const [selectedCity, setSelectedCity] = useState<string>('nearby');
  // Da scommentare per il filtro sulla città
  const [cityInput, setCityInput] = useState('');
  const [showCityModal, setShowCityModal] = useState(false);

  // Mappa
  const [navigationEvent, setNavigationEvent] = useState<Event | null>(null);

    //Pop up
  const [travelMode, setTravelMode] = useState<google.maps.TravelMode | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  //Preferiti 
  const [favoriteVenues, setFavoriteVenues] = useState<any[]>([]);
  const [favoriteOrganizers, setFavoriteOrganizers] = useState<any[]>([]);
  const [venueFavorites, setVenueFavorites] = useState<Set<string>>(new Set());
  const [organizerFavorites, setOrganizerFavorites] = useState<Set<string>>(new Set());

  
  const applyCityFilter = (city: string) => {
    const cleanedCity = city.trim();
    
    if (!cleanedCity) {
      setSelectedCity('nearby');
      return;
    }
  
    setSelectedCity(cleanedCity);
  };
  
  const resetCityFilter = () => {
    setSelectedCity('nearby');
    setCityInput('');
  };

  

  const mapBackendEvents = (data: any[]): Event[] => {
    return data.map((event: any) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.start_time,
      venue: event.venue_name,
      latitude: Number(event.latitude),
      longitude: Number(event.longitude),
      type: event.category || 'event',
      price: event.price ? `€${event.price}` : 'Gratis',
      image: event.image_url,
    }));
  };

  const loadEventsByFilter = async () => {
    try {
      setIsEventsLoading(true);
      
      if (selectedCity !== 'nearby') {
        const data = await getEventsByCity(selectedCity);
        setEvents(mapBackendEvents(data));
        return;
      }
        

      if (!navigator.geolocation) {
        const data = await getPublicEvents();
        setEvents(mapBackendEvents(data));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const data = await getNearbyEvents(
            position.coords.latitude,
            position.coords.longitude,
            20
          );

          setEvents(mapBackendEvents(data));
          setIsEventsLoading(false);
        },
        async () => {
          const data = await getPublicEvents();
          setEvents(mapBackendEvents(data));
          setIsEventsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: 60000,
        }
      );
    } catch (error) {
      console.error(error);
    } finally {
      if (selectedCity !== 'nearby' || !navigator.geolocation) {
        setIsEventsLoading(false);
      }
    }
  };

  const loadFavoriteEvents = async () => {
    try {
      const data = await getFavoriteEvents();
      setFavorites(new Set(data.map((event: any) => event.id)));
    } catch (error) {
      console.error('Errore caricamento preferiti:', error);
    }
  };

  const loadMyProfile = async () => {
    try {
      const profile = await getMyProfile();
      setUserData(profile);
    } catch (error) {
      console.error('Errore caricamento profilo:', error);
    }
  };
  


  // Load favorites from localStorage on mount
  useEffect(() => {
    
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('userData');
    if (storedUser && storedToken) {
      setUserData(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);


  // Save user data to localStorage when it changes
  useEffect(() => {
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
    }
  }, [userData]);


  useEffect(() => {
    if (isLoggedIn) {
      loadEventsByFilter();
      loadFavoriteEvents();
      loadVenueFavorites();
      loadOrganizerFavorites();
      loadMyProfile();
    }
  }, [isLoggedIn, selectedCity]);

  const toggleFavorite = async (eventId: string) => {
    try {
      const isFavorite = favorites.has(eventId);
    
      if (isFavorite) {
        await removeFavoriteEvent(eventId);
      
        setFavorites((prev) => {
          const next = new Set(prev);
          next.delete(eventId);
          return next;
        });
      } else {
        await addFavoriteEvent(eventId);
      
        setFavorites((prev) => {
          const next = new Set(prev);
          next.add(eventId);
          return next;
        });
      }
    } catch (error) {
      console.error('Errore aggiornamento preferito:', error);
      alert('Errore aggiornamento preferito');
    }
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  
  const handleLogin = (user: UserData) => {
    setUserData(user);
    setIsLoggedIn(true);
    localStorage.setItem('userData', JSON.stringify(user));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    setActiveSection('home');
    
  };

    // Show login view if not logged in
  if (!isLoggedIn) {
    return <LoginView onLogin={handleLogin} />;
  }

  const handleUpdateProfile = (data: { name: string; email: string }) => {
    if (userData) {
      const updatedUser = { ...userData, ...data };
      setUserData(updatedUser);
    }
  };


  const handleNavigate = (event: Event, mode: google.maps.TravelMode) => {
    setActiveSection('home');
    setNavigationEvent(event);
    setTravelMode(mode);
    setSelectedEvent(null);
  };

  // Delete navigation 
  const handleCancelNavigation = () => {
    setNavigationEvent(null);
    setTravelMode(null);
  };

  const loadVenueFavorites = async () => {
    try {
      const data = await getFavoriteVenues();
      setFavoriteVenues(data);
      setVenueFavorites(new Set(data.map((venue: any) => venue.id)));
    } catch (error) {
      console.error('Errore caricamento locali preferiti:', error);
    }
  };

  const loadOrganizerFavorites = async () => {
    try {
      const data = await getFavoriteOrganizers();
      setFavoriteOrganizers(data);
      setOrganizerFavorites(new Set(data.map((organizer: any) => organizer.id)));
    } catch (error) {
      console.error('Errore caricamento organizzazioni preferite:', error);
    }
  };

  const toggleVenueFavorite = async (venueId: string) => {
    try {
      const isFavorite = venueFavorites.has(venueId);

      if (isFavorite) {
        await removeFavoriteVenue(venueId);

        setVenueFavorites((prev) => {
          const next = new Set(prev);
          next.delete(venueId);
          return next;
        });

        setFavoriteVenues((prev) =>
          prev.filter((venue) => venue.id !== venueId)
        );
      } else {
        await addFavoriteVenue(venueId);
        await loadVenueFavorites();
      }
    } catch (error) {
      console.error('Errore aggiornamento locale preferito:', error);
      alert('Errore aggiornamento locale preferito');
    }
  };

  const toggleOrganizerFavorite = async (organizerId: string) => {
    try {
      const isFavorite = organizerFavorites.has(organizerId);

      if (isFavorite) {
        await removeFavoriteOrganizer(organizerId);

        setOrganizerFavorites((prev) => {
          const next = new Set(prev);
          next.delete(organizerId);
          return next;
        });

        setFavoriteOrganizers((prev) =>
          prev.filter((organizer) => organizer.id !== organizerId)
        );
      } else {
        await addFavoriteOrganizer(organizerId);
        await loadOrganizerFavorites();
      }
    } catch (error) {
      console.error('Errore aggiornamento organizzazione preferita:', error);
      alert('Errore aggiornamento organizzazione preferita');
    }
  };


  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Date Selector - only for home */}
      {activeSection === 'home' && (
        <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {activeSection === 'home' && (
          <div className="relative h-full">
            {/* Da scommentare per il filtro sulla città 
            <div className="absolute top-4 left-4 right-4 z-40 flex gap-2">
              <button
                onClick={() => setShowCityModal(true)}
                className="flex-1 h-11 rounded-xl bg-white shadow-md border border-gray-200 px-4 text-left text-sm font-medium text-gray-700"
              >
                {selectedCity === 'nearby'
                  ? '📍 Eventi vicino a me'
                  : `📍 ${selectedCity}`}
              </button>
                
              {selectedCity !== 'nearby' && (
                <button
                  onClick={resetCityFilter}
                  className="h-11 px-4 rounded-xl bg-white shadow-md border border-gray-200 text-sm font-semibold text-red-500"
                >
                  Reset
                </button>
              )}
            </div>
            */}

            <MapView
              events={filteredEvents}
              onEventClick={handleEventClick}
              navigationEvent={navigationEvent}
              travelMode={travelMode}
              onCancelNavigation={handleCancelNavigation}
            />
          </div>
        )}
        
        {activeSection === 'events' && (
          <div className="h-full overflow-y-auto pb-20">
            {/* Da scommentare per il filtro sulla città 
            <div className="p-4 bg-gray-50">
              <div className="bg-white rounded-2xl shadow-md p-4">
                <label className="text-sm font-semibold text-gray-700">
                  Cerca eventi per città
                </label>
                    
                <div className="flex gap-2 mt-3">
                  <input
                    value={cityInput}
                    onChange={(e) => setCityInput(e.target.value)}
                    placeholder="Es. Torino"
                    className="flex-1 h-11 rounded-xl border border-gray-300 px-4"
                  />
            
                  <button
                    onClick={() => applyCityFilter(cityInput)}
                    className="h-11 px-4 rounded-xl bg-indigo-600 text-white font-semibold"
                  >
                    Cerca
                  </button>
                </div>
                    
                {selectedCity !== 'nearby' && (
                  <button
                    onClick={resetCityFilter}
                    className="mt-3 text-sm font-semibold text-red-500"
                  >
                    Rimuovi filtro città
                  </button>
                )}
              </div>
            </div>
            */}
            
            <EventsList
              events={events}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onEventClick={handleEventClick}
              showFilters={true}
            />
          </div>
        )}
        
        {activeSection === 'profile' &&  userData && (
          <ProfileView
            favoriteEvents={favoriteEvents}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onEventClick={handleEventClick}
            userData={userData}
            onLogout={handleLogout}
            favoritesCount={favorites.size}
            favoriteVenues={favoriteVenues}
            favoriteOrganizers={favoriteOrganizers}
            venueFavorites={venueFavorites}
            organizerFavorites={organizerFavorites}
            onToggleVenueFavorite={toggleVenueFavorite}
            onToggleOrganizerFavorite={toggleOrganizerFavorite}
            onUpdateProfile={async (data) => {
            const updated = await updateMyProfile(data);
            setUserData(updated);
            }}
          />
        )}
        {activeSection === 'venues' && userData?.role === 'venue_owner' && (
          <VenuesView
            venueFavorites={venueFavorites}
            organizerFavorites={organizerFavorites}
            onToggleVenueFavorite={toggleVenueFavorite}
            onToggleOrganizerFavorite={toggleOrganizerFavorite}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeSection={activeSection} onSectionChange={setActiveSection}  isVenueOwner={userData?.role === 'venue_owner'} />

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          isFavorite={favorites.has(selectedEvent.id)}
          onClose={handleCloseModal}
          onToggleFavorite={toggleFavorite}
          onNavigate={handleNavigate}
        />
      )}
{/* Da scommentare per il filtro sulla città
      {showCityModal && (
        <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center px-4">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-5">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Cerca città
            </h2>

            <p className="text-sm text-gray-600 mb-4">
              Inserisci la città in cui vuoi vedere gli eventi.
            </p>

            <input
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              placeholder="Es. Torino, Milano, Roma"
              className="w-full h-12 rounded-xl border border-gray-300 px-4 mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowCityModal(false)}
                className="flex-1 h-11 rounded-xl border border-gray-300 font-semibold text-gray-700"
              >
                Annulla
              </button>

              <button
                onClick={() => {
                  applyCityFilter(cityInput);
                  setShowCityModal(false);
                }}
                className="flex-1 h-11 rounded-xl bg-indigo-600 text-white font-semibold"
              >
                Cerca
              </button>
            </div>
          </div>
        </div>
      )}
        */}
    </div>
  );
}
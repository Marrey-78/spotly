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
import { getPublicEvents } from './app/api/publicEvents';

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

  // Mappa
  const [navigationEvent, setNavigationEvent] = useState<Event | null>(null);

    //Pop up
  const [travelMode, setTravelMode] = useState<google.maps.TravelMode | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(new Set(JSON.parse(storedFavorites)));
    }
    
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('userData');
    if (storedUser && storedToken) {
      setUserData(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  // Save user data to localStorage when it changes
  useEffect(() => {
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
    }
  }, [userData]);

    // use effect per gli eventi 
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await getPublicEvents();

        const mappedEvents = data.map((event: any) => ({
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

        setEvents(mappedEvents);
      } catch (error) {
        console.error(error);
      } finally {
        setIsEventsLoading(false);
      }
    };

    if (isLoggedIn) {
      loadEvents();
    }
  }, [isLoggedIn]);


  const toggleFavorite = (eventId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(eventId)) {
        newFavorites.delete(eventId);
      } else {
        newFavorites.add(eventId);
      }
      return newFavorites;
    });
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




  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Date Selector - only for home */}
      {activeSection === 'home' && (
        <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {activeSection === 'home' && (
          <MapView 
            events={filteredEvents} 
            onEventClick={handleEventClick} 
            navigationEvent={navigationEvent}
            travelMode={travelMode}
            onCancelNavigation={handleCancelNavigation}
            />
        )}
        
        {activeSection === 'events' && (
          <EventsList
            events={events}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onEventClick={handleEventClick}
            showFilters={true}
          />
        )}
        
        {activeSection === 'profile' &&  userData && (
          <ProfileView
            favoriteEvents={favoriteEvents}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onEventClick={handleEventClick}
            userData={userData}
            onLogout={handleLogout}
            onUpdateProfile={handleUpdateProfile}
          />
        )}
        {activeSection === 'venues' && userData?.role === 'venue_owner' && (
          <VenuesView />
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
    </div>
  );
}
import { Heart, User, Settings, LogOut, Calendar, MapPin, Star, Trophy, Edit2 } from 'lucide-react';
import type { Event } from '../types/event';
import { EventCard } from './EventCard';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { useState } from 'react';

interface ProfileViewProps {
  favoriteEvents: Event[];
  favorites: Set<string>;
  onToggleFavorite: (eventId: string) => void;
  onEventClick: (event: Event) => void;
  userData: { name: string; email: string; avatar: string };
  onLogout: () => void;
  onUpdateProfile: (data: { name: string; email: string }) => void;
}

export function ProfileView({ 
  favoriteEvents, 
  favorites, 
  onToggleFavorite, 
  onEventClick,
  userData,
  onLogout,
  onUpdateProfile
}: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: userData.name,
    email: userData.email,
  });

  const handleSaveProfile = () => {
    onUpdateProfile(editData);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditData({ name: userData.name, email: userData.email });
    setIsEditing(false);
  };

  // Calcola statistiche
  const upcomingEvents = favoriteEvents.filter(e => new Date(e.date) >= new Date()).length;
  const pastEvents = favoriteEvents.filter(e => new Date(e.date) < new Date()).length;
  
  // Conta eventi per tipo
  const eventsByType = favoriteEvents.reduce((acc, event) => {
    acc[event.type] = (acc[event.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const favoriteType = Object.entries(eventsByType).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Nessuno';

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-20 bg-gradient-to-b from-gray-50 to-white">
      {/* Header con profilo utente */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white pt-8 pb-24 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 px-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative">
                <img 
                  src={userData.avatar} 
                  alt={userData.name}
                  className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30"
                />
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-400 rounded-full border-4 border-indigo-600"></div>
              </div>
              
              {/* User info */}
              <div>
                <h2 className="text-2xl font-bold mb-1">{userData.name}</h2>
                <p className="text-indigo-100 text-sm">{userData.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                  <span className="text-sm font-medium">VIP Member</span>
                </div>
              </div>
            </div>
            
            <Button
              onClick={onLogout}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/20">
              <Heart className="w-6 h-6 mx-auto mb-2 fill-white text-white" />
              <p className="text-2xl font-bold">{favoriteEvents.length}</p>
              <p className="text-xs text-white/80">Preferiti</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/20">
              <Calendar className="w-6 h-6 mx-auto mb-2" />
              <p className="text-2xl font-bold">{upcomingEvents}</p>
              <p className="text-xs text-white/80">In arrivo</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/20">
              <Trophy className="w-6 h-6 mx-auto mb-2" />
              <p className="text-2xl font-bold">{pastEvents}</p>
              <p className="text-xs text-white/80">Visitati</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content con Tabs */}
      <div className="px-6 -mt-16 relative z-20">
        <Tabs defaultValue="favorites" className="w-full">
          <TabsList className="w-full bg-white shadow-lg rounded-2xl p-1 h-14 mb-6">
            <TabsTrigger 
              value="favorites" 
              className="flex-1 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <Heart className="w-4 h-4 mr-2" />
              Preferiti
            </TabsTrigger>
            <TabsTrigger 
              value="stats"
              className="flex-1 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Statistiche
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              className="flex-1 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <Settings className="w-4 h-4 mr-2" />
              Profilo
            </TabsTrigger>
          </TabsList>

          {/* Tab Preferiti */}
          <TabsContent value="favorites" className="space-y-4">
            {favoriteEvents.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-10 h-10 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Nessun evento salvato</h3>
                <p className="text-gray-600 mb-1">
                  Scopri gli eventi più cool e salvali nei preferiti
                </p>
                <p className="text-sm text-gray-500">
                  Tocca il cuore ❤️ su un evento per aggiungerlo qui
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {favoriteEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isFavorite={favorites.has(event.id)}
                    onToggleFavorite={onToggleFavorite}
                    onEventClick={onEventClick}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tab Statistiche */}
          <TabsContent value="stats" className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Le tue statistiche</h3>
              
              <div className="space-y-4">
                {/* Tipo preferito */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                      <Star className="w-6 h-6 text-white fill-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tipo preferito</p>
                      <p className="font-bold text-gray-900">{favoriteType}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-indigo-600">
                      {eventsByType[favoriteType] || 0}
                    </p>
                    <p className="text-xs text-gray-500">eventi</p>
                  </div>
                </div>

                {/* Eventi per tipo */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Eventi per categoria</h4>
                  {Object.entries(eventsByType).length > 0 ? (
                    Object.entries(eventsByType).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-gray-700">{type}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                              style={{ width: `${(count / favoriteEvents.length) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold text-gray-900 w-8 text-right">{count}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">Nessun dato disponibile</p>
                  )}
                </div>

                {/* Achievement badges */}
                <div className="pt-4 border-t border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-3">I tuoi achievement</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className={`text-center p-3 rounded-xl ${favoriteEvents.length >= 1 ? 'bg-yellow-50' : 'bg-gray-50 opacity-50'}`}>
                      <div className="text-3xl mb-1">🎉</div>
                      <p className="text-xs font-medium">Primo Evento</p>
                    </div>
                    <div className={`text-center p-3 rounded-xl ${favoriteEvents.length >= 5 ? 'bg-yellow-50' : 'bg-gray-50 opacity-50'}`}>
                      <div className="text-3xl mb-1">🔥</div>
                      <p className="text-xs font-medium">Party Animal</p>
                    </div>
                    <div className={`text-center p-3 rounded-xl ${favoriteEvents.length >= 10 ? 'bg-yellow-50' : 'bg-gray-50 opacity-50'}`}>
                      <div className="text-3xl mb-1">👑</div>
                      <p className="text-xs font-medium">Night King</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Tab Impostazioni */}
          <TabsContent value="settings" className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Informazioni personali</h3>
                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Modifica
                  </Button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Nome</label>
                    <Input
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Email</label>
                    <Input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={handleSaveProfile}
                      className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    >
                      Salva modifiche
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      variant="outline"
                      className="flex-1 rounded-xl"
                    >
                      Annulla
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Nome</p>
                      <p className="font-medium text-gray-900">{userData.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{userData.email}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Preferenze */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Preferenze</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Posizione</p>
                      <p className="text-sm text-gray-600">Milano, Italia</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-indigo-600">
                    Modifica
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Notifiche</p>
                      <p className="text-sm text-gray-600">Attive per nuovi eventi</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-indigo-600">
                    Gestisci
                  </Button>
                </div>
              </div>
            </div>

            {/* Logout button */}
            <Button
              onClick={onLogout}
              variant="outline"
              className="w-full h-12 rounded-xl border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Disconnetti
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
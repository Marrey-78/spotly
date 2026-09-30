import { Heart, User, Settings, LogOut, Calendar, MapPin, Star, Trophy, Edit2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Event } from '../types/event';
import { EventCard } from './EventCard';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { changeMyPassword, uploadMyAvatar } from '../api/users';

interface ProfileViewProps {
  favoriteEvents: Event[];
  favorites: Set<string>;
  onToggleFavorite: (eventId: string) => void;
  onEventClick: (event: Event) => void;
  userData: {
    name: string;
    email: string;
    avatar?: string;
    city?: string;
  };
  onLogout: () => void;


  favoriteVenues: any[];
  favoriteOrganizers: any[];
  venueFavorites: Set<string>;
  organizerFavorites: Set<string>;
  onToggleVenueFavorite: (venueId: string) => void;
  onToggleOrganizerFavorite: (organizerId: string) => void;

  onUpdateProfile: (data: {
    name: string;
    email: string;
    city?: string;
    avatar?: string;
  }) => Promise<void>;
}

export function ProfileView({
  favoriteEvents,
  favoriteVenues,
  favoriteOrganizers,
  favorites,
  venueFavorites,
  organizerFavorites,
  onToggleFavorite,
  onToggleVenueFavorite,
  onToggleOrganizerFavorite,
  onEventClick,
  userData,
  onLogout,
  onUpdateProfile,
}: ProfileViewProps) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    city: userData?.city || '',
    avatar: userData?.avatar || '',
  });

  const [passwordForm, setPasswordForm] = useState({
    old_password: '',
    new_password: '',
  });

  useEffect(() => {
    setProfileForm({
      name: userData?.name || '',
      email: userData?.email || '',
      city: userData?.city || '',
      avatar: userData?.avatar || '',
    });
  }, [userData]);

  const today = new Date().toISOString().split('T')[0];

  const upcomingFavoriteEvents = favoriteEvents.filter((event) => event.date >= today);
  const pastFavoriteEvents = favoriteEvents.filter((event) => event.date < today);

  const upcomingEvents = upcomingFavoriteEvents.length;
  const pastEvents = pastFavoriteEvents.length;

  const eventsByType = favoriteEvents.reduce((acc, event) => {
    acc[event.type] = (acc[event.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const favoriteType = Object.entries(eventsByType).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Nessuno';

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'club':
        return 'Discoteca';
      case 'concert':
      case 'live_music':
        return 'Concerto';
      case 'theater':
        return 'Teatro';
      case 'cinema':
        return 'Cinema';
      case 'restaurant':
        return 'Ristorante';
      case 'pub':
        return 'Pub';
      case 'bar':
        return 'Bar';
      default:
        return type === 'Nessuno' ? 'Nessuno' : type;
    }
  };

  const totalFavorites =
    favorites.size +
    venueFavorites.size +
    organizerFavorites.size;

  const handleAvatarUpload = async (file: File) => {
    try {
      const result = await uploadMyAvatar(file);
      setProfileForm((prev) => ({ ...prev, avatar: result.avatar }));
    } catch (error) {
      console.error(error);
      alert('Errore caricamento immagine profilo');
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await onUpdateProfile(profileForm);
      setIsEditingProfile(false);
    } catch (error) {
      console.error(error);
      alert('Errore aggiornamento profilo');
    }
  };

  const handleCancelProfileEdit = () => {
    setProfileForm({
      name: userData?.name || '',
      email: userData?.email || '',
      city: userData?.city || '',
      avatar: userData?.avatar || '',
    });
    setIsEditingProfile(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await changeMyPassword(passwordForm);
      setPasswordForm({ old_password: '', new_password: '' });
      alert('Password aggiornata');
    } catch (error) {
      console.error(error);
      alert('Errore cambio password');
    }
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-20 bg-slate-50">
      <div className="bg-[#050914] text-white pt-8 pb-24 relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 px-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={userData.avatar || 'https://ui-avatars.com/api/?name=User&background=6366f1&color=fff'}
                  alt={userData.name}
                  className="w-20 h-20 rounded-full object-cover bg-white/20 backdrop-blur-sm border-4 border-white/20"
                />
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-cyan-400 rounded-full border-4 border-[#050914]"></div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-1">{userData.name}</h2>
                <p className="text-slate-300 text-sm">{userData.email}</p>
                <p className="text-slate-300 text-sm mt-1">{userData.city || 'Città non impostata'}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                  <span className="text-sm font-medium">Utente</span>
                </div>
              </div>
            </div>

            <Button onClick={onLogout} variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#111B2E]/80 backdrop-blur-md rounded-2xl p-4 text-center border border-white/10">
              <Heart className="w-6 h-6 mx-auto mb-2 fill-white text-white" />
              <p className="text-2xl font-bold">{totalFavorites}</p>
              <p className="text-xs text-white/80">Preferiti</p>
            </div>
            <div className="bg-[#111B2E]/80 backdrop-blur-md rounded-2xl p-4 text-center border border-white/10">
              <Calendar className="w-6 h-6 mx-auto mb-2" />
              <p className="text-2xl font-bold">{upcomingEvents}</p>
              <p className="text-xs text-white/80">In arrivo</p>
            </div>
            <div className="bg-[#111B2E]/80 backdrop-blur-md rounded-2xl p-4 text-center border border-white/10">
              <Trophy className="w-6 h-6 mx-auto mb-2" />
              <p className="text-2xl font-bold">{pastEvents}</p>
              <p className="text-xs text-white/80">Visitati</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-16 relative z-20">
        <Tabs defaultValue="favorites" className="w-full">
          <TabsList className="w-full bg-[#0B1220] border border-white/10 shadow-[0_12px_30px_rgba(0,0,0,0.20)] rounded-2xl p-1 h-14 mb-6">
            <TabsTrigger value="favorites" className="flex-1 rounded-xl text-slate-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-400 data-[state=active]:via-blue-500 data-[state=active]:to-violet-500 data-[state=active]:text-white">
              <Heart className="w-4 h-4 mr-2" />
              Preferiti
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex-1 rounded-xl text-slate-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-400 data-[state=active]:via-blue-500 data-[state=active]:to-violet-500 data-[state=active]:text-white">
              <Trophy className="w-4 h-4 mr-2" />
              Statistiche
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex-1 rounded-xl text-slate-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-400 data-[state=active]:via-blue-500 data-[state=active]:to-violet-500 data-[state=active]:text-white">
              <Settings className="w-4 h-4 mr-2" />
              Profilo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="favorites" className="space-y-5">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900">Prossimi eventi</h3>
                <span className="text-sm text-gray-500">{upcomingFavoriteEvents.length}</span>
              </div>

              {upcomingFavoriteEvents.length === 0 ? (
                <p className="text-gray-500 text-sm">Nessun evento futuro salvato.</p>
              ) : (
                <div className="space-y-4">
                  {upcomingFavoriteEvents.map((event) => (
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
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900">Locali preferiti</h3>
                <span className="text-sm text-gray-500">{favoriteVenues.length}</span>
              </div>

              {favoriteVenues.length === 0 ? (
                <p className="text-gray-500 text-sm">Nessun locale preferito.</p>
              ) : (
                <div className="space-y-3">
                  {favoriteVenues.map((venue) => (
                    <div key={venue.id} className="rounded-xl border border-gray-100 p-3">
                      <div className="flex justify-between gap-3">
                        <div>
                          <h4 className="font-bold text-gray-900">{venue.name}</h4>
                          <p className="text-sm text-cyan-600">{venue.venue_type_name}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            {venue.address}{venue.city ? `, ${venue.city}` : ''}
                          </p>
                        </div>
                        <button onClick={() => onToggleVenueFavorite(venue.id)} className="text-red-500 text-xl">❤️</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900">Organizzazioni preferite</h3>
                <span className="text-sm text-gray-500">{favoriteOrganizers.length}</span>
              </div>

              {favoriteOrganizers.length === 0 ? (
                <p className="text-gray-500 text-sm">Nessuna organizzazione preferita.</p>
              ) : (
                <div className="space-y-3">
                  {favoriteOrganizers.map((organizer) => (
                    <div key={organizer.id} className="rounded-xl border border-gray-100 p-3">
                      <div className="flex justify-between gap-3">
                        <div>
                          <h4 className="font-bold text-gray-900">{organizer.name}</h4>
                          {organizer.description && <p className="text-sm text-gray-600 mt-1">{organizer.description}</p>}
                        </div>
                        <button onClick={() => onToggleOrganizerFavorite(organizer.id)} className="text-red-500 text-xl">❤️</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900">Eventi passati</h3>
                <span className="text-sm text-gray-500">{pastFavoriteEvents.length}</span>
              </div>

              {pastFavoriteEvents.length === 0 ? (
                <p className="text-gray-500 text-sm">Nessun evento passato.</p>
              ) : (
                <div className="space-y-4">
                  {pastFavoriteEvents.map((event) => (
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
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <div className="overflow-hidden rounded-3xl bg-[#0B1220] border border-white/10 shadow-[0_16px_36px_rgba(15,23,42,0.16)]">
              <div className="relative p-5 border-b border-white/10 overflow-hidden">
                <div className="absolute -top-16 -right-12 w-40 h-40 rounded-full bg-cyan-400/10 blur-3xl" />
                <div className="absolute -bottom-20 -left-10 w-40 h-40 rounded-full bg-violet-500/10 blur-3xl" />

                <div className="relative">
                  <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-cyan-400">
                    Il tuo profilo Flode
                  </p>
                  <h3 className="mt-1 text-xl font-bold text-white">
                    Le tue statistiche
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Un riepilogo dei contenuti che hai salvato.
                  </p>
                </div>
              </div>

              <div className="p-4 grid grid-cols-3 gap-2">
                <div className="rounded-2xl bg-[#111B2E] border border-white/5 px-3 py-4 text-center">
                  <Heart className="w-5 h-5 mx-auto mb-2 text-cyan-400 fill-cyan-400/20" />
                  <p className="text-xl font-bold text-white">{totalFavorites}</p>
                  <p className="mt-0.5 text-[10px] text-slate-500">Preferiti</p>
                </div>

                <div className="rounded-2xl bg-[#111B2E] border border-white/5 px-3 py-4 text-center">
                  <Calendar className="w-5 h-5 mx-auto mb-2 text-blue-400" />
                  <p className="text-xl font-bold text-white">{upcomingEvents}</p>
                  <p className="mt-0.5 text-[10px] text-slate-500">In arrivo</p>
                </div>

                <div className="rounded-2xl bg-[#111B2E] border border-white/5 px-3 py-4 text-center">
                  <Trophy className="w-5 h-5 mx-auto mb-2 text-violet-400" />
                  <p className="text-xl font-bold text-white">{pastEvents}</p>
                  <p className="mt-0.5 text-[10px] text-slate-500">Passati</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-cyan-50 via-blue-50 to-violet-50 border border-cyan-100/70">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 shrink-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500 rounded-xl flex items-center justify-center shadow-[0_0_14px_rgba(34,211,238,0.18)]">
                    <Star className="w-5 h-5 text-white fill-white/20" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">Categoria preferita</p>
                    <p className="font-bold text-slate-900 truncate">
                      {getEventTypeLabel(favoriteType)}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-2xl font-bold text-cyan-600">
                    {eventsByType[favoriteType] || 0}
                  </p>
                  <p className="text-[10px] text-slate-500">eventi salvati</p>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-slate-900">Eventi per categoria</h4>
                  <span className="text-xs text-slate-400">{favoriteEvents.length} totali</span>
                </div>

                {Object.entries(eventsByType).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(eventsByType)
                      .sort((a, b) => b[1] - a[1])
                      .map(([type, count]) => {
                        const percentage = favoriteEvents.length
                          ? Math.round((count / favoriteEvents.length) * 100)
                          : 0;

                        return (
                          <div key={type}>
                            <div className="flex items-center justify-between gap-3 mb-2">
                              <span className="text-sm font-medium text-slate-700">
                                {getEventTypeLabel(type)}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400">{percentage}%</span>
                                <span className="min-w-6 text-right text-sm font-bold text-slate-900">
                                  {count}
                                </span>
                              </div>
                            </div>

                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <Star className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm font-medium text-slate-600">
                      Nessun dato disponibile
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Salva qualche evento per vedere le tue statistiche.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Informazioni personali</h3>
                {!isEditingProfile && (
                  <Button onClick={() => setIsEditingProfile(true)} variant="outline" size="sm" className="rounded-xl">
                    <Edit2 className="w-4 h-4 mr-2" />
                    Modifica
                  </Button>
                )}
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={profileForm.avatar || 'https://ui-avatars.com/api/?name=User&background=6366f1&color=fff'}
                      alt="Avatar"
                      className="w-20 h-20 rounded-full object-cover bg-gray-100"
                    />
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleAvatarUpload(file);
                      }}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Nome</label>
                    <Input value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} className="rounded-xl" required />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Email</label>
                    <Input type="email" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} className="rounded-xl" required />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Città</label>
                    <Input value={profileForm.city} onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })} placeholder="Es. Torino" className="rounded-xl" />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button type="submit" className="flex-1 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500">
                      Salva modifiche
                    </Button>
                    <Button type="button" onClick={handleCancelProfileEdit} variant="outline" className="flex-1 rounded-xl">
                      Annulla
                    </Button>
                  </div>
                </form>
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
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Città</p>
                      <p className="font-medium text-gray-900">{userData.city || 'Non impostata'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Cambia password</h3>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <Input
                  type="password"
                  placeholder="Password attuale"
                  value={passwordForm.old_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, old_password: e.target.value })}
                  required
                />
                <Input
                  type="password"
                  placeholder="Nuova password"
                  value={passwordForm.new_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                  required
                />
                <Button type="submit" className="w-full h-11 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 text-white">
                  Aggiorna password
                </Button>
              </form>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Preferenze</h3>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Notifiche</p>
                    <p className="text-sm text-gray-600">In arrivo</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-cyan-600">
                  Gestisci
                </Button>
              </div>
            </div>

            <Button onClick={onLogout} variant="outline" className="w-full h-12 rounded-xl border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300">
              <LogOut className="w-5 h-5 mr-2" />
              Disconnetti
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
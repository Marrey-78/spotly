export type EventType = 'club' | 'live_music' | 'theater' | 'cinema' | 'concert'| 'restaurant' | 'pub' | 'bar' ;

export interface Event {
  id: string;
  title: string;
  type: EventType;
  venue: string | null;
  date: string;
  time: string;
  description: string | null;
  image: string;
  price: string;
  latitude: number;
  longitude: number;
  ticket_url?: string;
}

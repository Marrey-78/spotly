export type EventType = 'club' | 'live_music' | 'theater' | 'cinema' | 'restaurant' | 'pub' | 'bar' ;

export interface Event {
  id: string;
  title: string;
  type: EventType;
  venue: string;
  date: string;
  time: string;
  description: string;
  image: string;
  price: string;
  latitude: number;
  longitude: number;
}

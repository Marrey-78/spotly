import type { Event } from '../types/event';

// Helper function to generate dates starting from today
const generateDate = (daysFromToday: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  return date.toISOString().split('T')[0];
};

// Event templates to be rotated
const eventTemplates = [
  {
    id: '1',
    title: 'Notte Elettronica',
    type: 'club' as const,
    venue: 'Club Maximo',
    time: '23:00',
    description: 'La migliore serata techno della città con DJ internazionali',
    image: 'https://images.unsplash.com/photo-1657208431551-cbf415b8ef26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodGNsdWIlMjBwYXJ0eSUyMGxpZ2h0c3xlbnwxfHx8fDE3Njc0NDk4Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    price: '€20',
    latitude: 45.4685,
    longitude: 9.1824,
  },
  {
    id: '2',
    title: 'Indie Rock Live',
    type: 'concert' as const,
    venue: 'Alcatraz Milano',
    time: '21:00',
    description: 'Concerto live dei The Midnight Sons',
    image: 'https://images.unsplash.com/photo-1656283384093-1e227e621fad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwY3Jvd2QlMjBtdXNpY3xlbnwxfHx8fDE3Njc0MzYzNzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    price: '€35',
    latitude: 45.4860,
    longitude: 9.2038,
  },
  {
    id: '3',
    title: 'Romeo e Giulietta',
    type: 'theater' as const,
    venue: 'Teatro alla Scala',
    time: '20:30',
    description: 'Spettacolo teatrale classico',
    image: 'https://images.unsplash.com/photo-1761618291331-535983ae4296?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVhdGVyJTIwc3RhZ2UlMjBwZXJmb3JtYW5jZXxlbnwxfHx8fDE3NjczNTA5Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    price: '€45',
    latitude: 45.4673,
    longitude: 9.1897,
  },
  {
    id: '4',
    title: 'Inception - Proiezione Speciale',
    type: 'cinema' as const,
    venue: 'Cinema Odeon',
    time: '21:30',
    description: 'Proiezione del capolavoro di Nolan',
    image: 'https://images.unsplash.com/photo-1739433437912-cca661ba902f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWElMjBtb3ZpZSUyMHRoZWF0ZXJ8ZW58MXx8fHwxNzY3NDE1ODU1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    price: '€12',
    latitude: 45.4642,
    longitude: 9.1900,
  },
  {
    id: '5',
    title: 'Cena Gourmet',
    type: 'restaurant' as const,
    venue: 'Ristorante Cracco',
    time: '20:00',
    description: 'Esperienza culinaria stellata',
    image: 'https://images.unsplash.com/photo-1616538994032-f7619b8bebb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZGluaW5nJTIwZXZlbmluZ3xlbnwxfHx8fDE3Njc0NTcyOTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    price: '€80',
    latitude: 45.4654,
    longitude: 9.1859,
  },
  {
    id: '6',
    title: 'Jazz Night',
    type: 'concert' as const,
    venue: 'Blue Note Milano',
    time: '22:00',
    description: 'Serata jazz con artisti internazionali',
    image: 'https://images.unsplash.com/photo-1708743536025-ecfe7ffb75b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXp6JTIwbGl2ZSUyMG11c2ljfGVufDF8fHx8MTc2NzQ1NzI5NXww&ixlib=rb-4.1.0&q=80&w=1080',
    price: '€25',
    latitude: 45.4797,
    longitude: 9.1775,
  },
  {
    id: '7',
    title: 'House Music Festival',
    type: 'club' as const,
    venue: 'Fabrique',
    time: '23:30',
    description: 'Festival di musica house con i migliori DJ europei',
    image: 'https://images.unsplash.com/photo-1657208431551-cbf415b8ef26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodGNsdWIlMjBwYXJ0eSUyMGxpZ2h0c3xlbnwxfHx8fDE3Njc0NDk4Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    price: '€30',
    latitude: 45.4520,
    longitude: 9.1802,
  },
  {
    id: '8',
    title: 'Stand Up Comedy',
    type: 'theater' as const,
    venue: 'Teatro Nazionale',
    time: '21:00',
    description: 'Serata di comicità con i migliori comici italiani',
    image: 'https://images.unsplash.com/photo-1761618291331-535983ae4296?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVhdGVyJTIwc3RhZ2UlMjBwZXJmb3JtYW5jZXxlbnwxfHx8fDE3NjczNTA5Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    price: '€18',
    latitude: 45.4710,
    longitude: 9.1850,
  },
  {
    id: '9',
    title: 'Aperitivo & DJ Set',
    type: 'restaurant' as const,
    venue: 'Terrazza Aperol',
    time: '19:00',
    description: 'Aperitivo con vista e musica lounge',
    image: 'https://images.unsplash.com/photo-1616538994032-f7619b8bebb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZGluaW5nJTIwZXZlbmluZ3xlbnwxfHx8fDE3Njc0NTcyOTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    price: '€15',
    latitude: 45.4640,
    longitude: 9.1895,
  },
  {
    id: '10',
    title: 'Film Festival',
    type: 'cinema' as const,
    venue: 'Anteo Palazzo del Cinema',
    time: '20:00',
    description: 'Rassegna di film indipendenti',
    image: 'https://images.unsplash.com/photo-1739433437912-cca661ba902f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWElMjBtb3ZpZSUyMHRoZWF0ZXJ8ZW58MXx8fHwxNzY3NDE1ODU1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    price: '€10',
    latitude: 45.4750,
    longitude: 9.1920,
  },
];

// Generate events for the next 20 days
const generateMockEvents = (): Event[] => {
  const events: Event[] = [];
  
  // For each of the next 20 days
  for (let day = 0; day < 20; day++) {
    const date = generateDate(day);
    
    // Add 3-5 events per day by rotating through templates
    const eventsPerDay = 3 + (day % 3); // Varies between 3-5 events per day
    
    for (let i = 0; i < eventsPerDay; i++) {
      const templateIndex = (day * eventsPerDay + i) % eventTemplates.length;
      const template = eventTemplates[templateIndex];
      
      events.push({
        ...template,
        id: `${day}-${i}`,
        date: date,
      });
    }
  }
  
  return events;
};

export const mockEvents: Event[] = generateMockEvents();
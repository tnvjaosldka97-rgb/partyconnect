export interface Party {
  id: string;
  title: string;
  image: string;
  date: string;
  dateTimestamp: number;
  location: string;
  city: string;
  price: number;
  priceFormatted: string;
  attendees: number;
  maxAttendees: number;
  ageRange: string;
  type: string;
  theme: string;
  description: string;
  hostName: string;
  rating: number;
}

export interface FilterOptions {
  searchQuery: string;
  city: string;
  priceRange: [number, number];
  dateRange: string;
  themes: string[];
  ageRange: [number, number];
  sortBy: 'date' | 'price-low' | 'price-high' | 'popular' | 'rating';
}


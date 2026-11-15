export type ServiceCategory =
  | 'Groom / Tratador'
  | 'Ferrador'
  | 'Veterinário / Emergência'
  | 'Transporte'
  | 'Treinador';

export type Region =
  | 'Lisboa & Tejo'
  | 'Ribatejo / Golegã'
  | 'Algarve / Vilamoura'
  | 'Porto & Norte'
  | 'Alentejo';

export type RateUnit = 'hora' | 'dia' | 'cavalo' | 'serviço' | 'km';

export interface Review {
  id: string;
  author: string;
  role: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Professional {
  id: string;
  name: string;
  category: ServiceCategory;
  headline: string;
  region: Region;
  city: string;
  coordinates: { x: number; y: number }; // % positions on the Portugal map view
  avatar: string;
  dailyRate: number;
  rateUnit: RateUnit;
  experienceYears: number;
  verifiedIdentity: boolean;
  verifiedExperience: boolean;
  acceptingNewClients: boolean;
  availableNow: boolean;
  emergencyReady?: boolean;
  rating: number;
  reviewCount: number;
  completedJobs: number;
  responseTime: string;
  disciplines: string[];
  specialties: string[];
  bio: string;
  availabilityDays: { day: string; label: string; available: boolean }[];
  reviews: Review[];
}

export type ProfessionalProfileUpdate = Pick<
  Professional,
  | 'name'
  | 'category'
  | 'avatar'
  | 'dailyRate'
  | 'rateUnit'
  | 'region'
  | 'city'
  | 'experienceYears'
  | 'bio'
>;

export interface Competition {
  id: string;
  name: string;
  discipline: string;
  location: string;
  region: Region;
  dates: string;
  organizer: string;
  availableProsCount: number;
  featured: boolean;
}

export interface OpenRequest {
  id: string;
  title: string;
  category: ServiceCategory;
  region: Region;
  dateNeeded: string;
  horsesCount: number;
  budget: string;
  author: string;
  description: string;
  createdAt: string;
  responsesCount: number;
}

export type BookingStatus = 'Pedido' | 'Confirmado' | 'Pago (MB WAY)' | 'Concluído' | 'Recusado';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'pro';
  text: string;
  time: string;
}

export interface Booking {
  id: string;
  professionalId: string;
  professionalName: string;
  professionalAvatar: string;
  professionalCategory: ServiceCategory;
  eventOrLocation: string;
  startDate: string;
  days: number;
  horsesCount: number;
  dailyRate: number;
  rateUnit?: RateUnit;
  platformFee: number;
  total: number;
  status: BookingStatus;
  paymentMethod: 'MB WAY' | 'Transferência';
  notes: string;
  messages: ChatMessage[];
}

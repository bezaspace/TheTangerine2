export interface Practitioner {
  id: string;
  name: string;
  title: string;
  specializations: string[];
  experience: number; // years
  rating: number;
  reviewCount: number;
  location: string;
  bio: string;
  imageUrl?: string;
  consultationFee: number;
  availableSlots: TimeSlot[];
  languages: string[];
  certifications: string[];
}

export interface TimeSlot {
  id: string;
  date: string; // ISO date string
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  isAvailable: boolean;
  consultationType: 'in-person' | 'video' | 'phone';
}

export interface BookingRequest {
  practitionerId: string;
  slotId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  consultationType: 'in-person' | 'video' | 'phone';
  symptoms?: string;
  notes?: string;
}

export interface Booking {
  id: string;
  practitioner: Practitioner;
  slot: TimeSlot;
  patient: {
    name: string;
    email: string;
    phone: string;
  };
  consultationType: 'in-person' | 'video' | 'phone';
  symptoms?: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface PractitionerSearchFilters {
  specialization?: string;
  location?: string;
  maxFee?: number;
  minRating?: number;
  availableDate?: string;
  consultationType?: 'in-person' | 'video' | 'phone';
  language?: string;
}

export interface PractitionerSearchResult {
  practitioners: Practitioner[];
  totalCount: number;
  searchQuery: string;
  filters: PractitionerSearchFilters;
}
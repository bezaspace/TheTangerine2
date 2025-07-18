import { Practitioner, PractitionerSearchResult, BookingRequest, Booking } from './practitioner';

export interface FunctionCall {
  name: string;
  args: Record<string, any>;
}

export interface FunctionResponse {
  name: string;
  response: {
    result: any;
  };
}

// Function call types for practitioner search
export interface SearchPractitionersArgs {
  query?: string;
  specialization?: string;
  location?: string;
  maxFee?: number;
  minRating?: number;
  availableDate?: string;
  consultationType?: 'in-person' | 'video' | 'phone';
  language?: string;
  limit?: number;
}

export interface SearchPractitionersResult {
  practitioners: Practitioner[];
  totalCount: number;
  searchSummary: string;
}

// Function call types for booking
export interface BookAppointmentArgs {
  practitionerId: string;
  slotId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  consultationType: 'in-person' | 'video' | 'phone';
  symptoms?: string;
  notes?: string;
}

export interface BookAppointmentResult {
  booking: Booking;
  success: boolean;
  message: string;
}

// Function call types for availability check
export interface CheckAvailabilityArgs {
  practitionerId: string;
  date?: string;
  consultationType?: 'in-person' | 'video' | 'phone';
}

export interface CheckAvailabilityResult {
  practitioner: Practitioner;
  availableSlots: Array<{
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    consultationType: 'in-person' | 'video' | 'phone';
  }>;
  message: string;
}

// Enhanced interaction types for multi-step booking flow
export interface InteractionContext {
  selectedPractitioner?: any;
  selectedSlot?: any;
  bookingStep?: 'search' | 'availability' | 'booking' | 'confirmation';
}
import { 
  Practitioner, 
  PractitionerSearchFilters, 
  PractitionerSearchResult,
  BookingRequest,
  Booking,
  TimeSlot 
} from '@/types/practitioner';
import { getMockPractitioners } from './mockData';
import uuid from 'react-native-uuid';

class PractitionerService {
  private practitioners: Practitioner[] = [];
  private bookings: Booking[] = [];

  constructor() {
    this.practitioners = getMockPractitioners();
  }

  async searchPractitioners(filters: PractitionerSearchFilters = {}): Promise<PractitionerSearchResult> {
    let filteredPractitioners = [...this.practitioners];

    // Apply filters
    if (filters.specialization) {
      filteredPractitioners = filteredPractitioners.filter(p =>
        p.specializations.some(spec => 
          spec.toLowerCase().includes(filters.specialization!.toLowerCase())
        )
      );
    }

    if (filters.location) {
      filteredPractitioners = filteredPractitioners.filter(p =>
        p.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    if (filters.maxFee) {
      filteredPractitioners = filteredPractitioners.filter(p =>
        p.consultationFee <= filters.maxFee!
      );
    }

    if (filters.minRating) {
      filteredPractitioners = filteredPractitioners.filter(p =>
        p.rating >= filters.minRating!
      );
    }

    if (filters.language) {
      filteredPractitioners = filteredPractitioners.filter(p =>
        p.languages.some(lang => 
          lang.toLowerCase().includes(filters.language!.toLowerCase())
        )
      );
    }

    if (filters.availableDate) {
      filteredPractitioners = filteredPractitioners.filter(p =>
        p.availableSlots.some(slot => 
          slot.date === filters.availableDate && slot.isAvailable
        )
      );
    }

    if (filters.consultationType) {
      filteredPractitioners = filteredPractitioners.filter(p =>
        p.availableSlots.some(slot => 
          slot.consultationType === filters.consultationType && slot.isAvailable
        )
      );
    }

    // Sort by rating (highest first)
    filteredPractitioners.sort((a, b) => b.rating - a.rating);

    return {
      practitioners: filteredPractitioners,
      totalCount: filteredPractitioners.length,
      searchQuery: this.buildSearchQuery(filters),
      filters,
    };
  }

  async getPractitionerById(id: string): Promise<Practitioner | null> {
    return this.practitioners.find(p => p.id === id) || null;
  }

  async getAvailableSlots(practitionerId: string, date?: string): Promise<TimeSlot[]> {
    const practitioner = await this.getPractitionerById(practitionerId);
    if (!practitioner) return [];

    let slots = practitioner.availableSlots.filter(slot => slot.isAvailable);
    
    if (date) {
      slots = slots.filter(slot => slot.date === date);
    }

    return slots;
  }

  async bookAppointment(bookingRequest: BookingRequest): Promise<Booking> {
    const practitioner = await this.getPractitionerById(bookingRequest.practitionerId);
    if (!practitioner) {
      throw new Error('Practitioner not found');
    }

    const slot = practitioner.availableSlots.find(s => s.id === bookingRequest.slotId);
    if (!slot || !slot.isAvailable) {
      throw new Error('Time slot not available');
    }

    // Mark slot as unavailable
    slot.isAvailable = false;

    const booking: Booking = {
      id: uuid.v4() as string,
      practitioner,
      slot,
      patient: {
        name: bookingRequest.patientName,
        email: bookingRequest.patientEmail,
        phone: bookingRequest.patientPhone,
      },
      consultationType: bookingRequest.consultationType,
      symptoms: bookingRequest.symptoms,
      notes: bookingRequest.notes,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.bookings.push(booking);
    return booking;
  }

  private buildSearchQuery(filters: PractitionerSearchFilters): string {
    const parts: string[] = [];
    
    if (filters.specialization) parts.push(`specialization: ${filters.specialization}`);
    if (filters.location) parts.push(`location: ${filters.location}`);
    if (filters.maxFee) parts.push(`max fee: $${filters.maxFee}`);
    if (filters.minRating) parts.push(`min rating: ${filters.minRating}`);
    if (filters.language) parts.push(`language: ${filters.language}`);
    if (filters.availableDate) parts.push(`available: ${filters.availableDate}`);
    if (filters.consultationType) parts.push(`type: ${filters.consultationType}`);

    return parts.length > 0 ? parts.join(', ') : 'all practitioners';
  }

  // Function calling implementations
  async searchPractitionersForChat(args: {
    query?: string;
    specialization?: string;
    location?: string;
    maxFee?: number;
    minRating?: number;
    availableDate?: string;
    consultationType?: 'in-person' | 'video' | 'phone';
    language?: string;
    limit?: number;
  }) {
    const filters: PractitionerSearchFilters = {
      specialization: args.specialization,
      location: args.location,
      maxFee: args.maxFee,
      minRating: args.minRating,
      availableDate: args.availableDate,
      consultationType: args.consultationType,
      language: args.language,
    };

    const result = await this.searchPractitioners(filters);
    
    // Limit results if specified
    if (args.limit && args.limit > 0) {
      result.practitioners = result.practitioners.slice(0, args.limit);
    }

    return {
      practitioners: result.practitioners,
      totalCount: result.totalCount,
      searchSummary: `Found ${result.practitioners.length} practitioners${args.query ? ` for "${args.query}"` : ''} with filters: ${result.searchQuery}`,
    };
  }

  async checkAvailabilityForChat(args: {
    practitionerId: string;
    date?: string;
    consultationType?: 'in-person' | 'video' | 'phone';
  }) {
    const practitioner = await this.getPractitionerById(args.practitionerId);
    if (!practitioner) {
      throw new Error('Practitioner not found');
    }

    let availableSlots = await this.getAvailableSlots(args.practitionerId, args.date);
    
    if (args.consultationType) {
      availableSlots = availableSlots.filter(slot => 
        slot.consultationType === args.consultationType
      );
    }

    return {
      practitioner,
      availableSlots: availableSlots.map(slot => ({
        id: slot.id,
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        consultationType: slot.consultationType,
      })),
      message: `Dr. ${practitioner.name} has ${availableSlots.length} available slots${args.date ? ` on ${args.date}` : ''}${args.consultationType ? ` for ${args.consultationType} consultations` : ''}.`,
    };
  }

  async bookAppointmentForChat(args: {
    practitionerId: string;
    slotId: string;
    patientName: string;
    patientEmail: string;
    patientPhone: string;
    consultationType: 'in-person' | 'video' | 'phone';
    symptoms?: string;
    notes?: string;
  }) {
    try {
      const booking = await this.bookAppointment(args);
      
      return {
        booking,
        success: true,
        message: `Successfully booked appointment with Dr. ${booking.practitioner.name} on ${booking.slot.date} at ${booking.slot.startTime}. Booking ID: ${booking.id}`,
      };
    } catch (error: any) {
      return {
        booking: null,
        success: false,
        message: `Failed to book appointment: ${error.message}`,
      };
    }
  }
}

export const practitionerService = new PractitionerService();
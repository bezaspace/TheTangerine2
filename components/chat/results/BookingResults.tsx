import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckCircle, XCircle, Calendar, Clock, User, Phone } from 'lucide-react-native';
import { Booking } from '@/types/practitioner';
import Colors from '@/constants/Colors';

interface BookingResultsProps {
  booking?: Booking;
  success: boolean;
  message: string;
  onNewSearch?: () => void;
  onViewBookings?: () => void;
}

export const BookingResults: React.FC<BookingResultsProps> = ({
  booking,
  success,
  message,
  onNewSearch,
  onViewBookings,
}) => {
  return (
    <View style={styles.container}>
      {/* Status Header */}
      <View style={[
        styles.statusHeader,
        { backgroundColor: success ? Colors.successLight : Colors.errorLight }
      ]}>
        {success ? (
          <CheckCircle size={24} color={Colors.success} />
        ) : (
          <XCircle size={24} color={Colors.error} />
        )}
        <Text style={[
          styles.statusText,
          { color: success ? Colors.success : Colors.error }
        ]}>
          {success ? 'Booking Confirmed!' : 'Booking Failed'}
        </Text>
      </View>

      {/* Message */}
      <Text style={styles.message}>{message}</Text>

      {/* Booking Details */}
      {success && booking && (
        <View style={styles.bookingDetails}>
          <Text style={styles.detailsTitle}>Appointment Details</Text>
          
          <View style={styles.detailRow}>
            <User size={16} color={Colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Practitioner</Text>
              <Text style={styles.detailValue}>
                {booking.practitioner.name}
              </Text>
              <Text style={styles.detailSubvalue}>
                {booking.practitioner.title}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Calendar size={16} color={Colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Date & Time</Text>
              <Text style={styles.detailValue}>
                {booking.slot.date}
              </Text>
              <Text style={styles.detailSubvalue}>
                {booking.slot.startTime} - {booking.slot.endTime}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Phone size={16} color={Colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Consultation Type</Text>
              <Text style={[styles.detailValue, styles.consultationType]}>
                {booking.consultationType.charAt(0).toUpperCase() + booking.consultationType.slice(1)}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <User size={16} color={Colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Patient Details</Text>
              <Text style={styles.detailValue}>
                {booking.patient.name}
              </Text>
              <Text style={styles.detailSubvalue}>
                {booking.patient.email}
              </Text>
              <Text style={styles.detailSubvalue}>
                {booking.patient.phone}
              </Text>
            </View>
          </View>

          {booking.symptoms && (
            <View style={styles.detailRow}>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Symptoms/Notes</Text>
                <Text style={styles.detailValue}>
                  {booking.symptoms}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.bookingIdContainer}>
            <Text style={styles.bookingIdLabel}>Booking ID</Text>
            <Text style={styles.bookingId}>{booking.id}</Text>
          </View>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        {success ? (
          <>
            {onViewBookings && (
              <TouchableOpacity
                style={[styles.actionButton, styles.secondaryButton]}
                onPress={onViewBookings}
              >
                <Text style={styles.secondaryButtonText}>View All Bookings</Text>
              </TouchableOpacity>
            )}
            {onNewSearch && (
              <TouchableOpacity
                style={[styles.actionButton, styles.primaryButton]}
                onPress={onNewSearch}
              >
                <Text style={styles.primaryButtonText}>Book Another Appointment</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <>
            {onNewSearch && (
              <TouchableOpacity
                style={[styles.actionButton, styles.primaryButton]}
                onPress={onNewSearch}
              >
                <Text style={styles.primaryButtonText}>Try Again</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>

      {/* Additional Info */}
      {success && (
        <View style={styles.additionalInfo}>
          <Text style={styles.infoText}>
            📧 A confirmation email has been sent to your registered email address.
          </Text>
          <Text style={styles.infoText}>
            📱 You will receive an SMS reminder 24 hours before your appointment.
          </Text>
          {booking?.consultationType === 'video' && (
            <Text style={styles.infoText}>
              🔗 Video consultation link will be shared 30 minutes before the appointment.
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  message: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  bookingDetails: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailContent: {
    flex: 1,
    marginLeft: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
    marginBottom: 2,
  },
  detailSubvalue: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  consultationType: {
    textTransform: 'capitalize',
  },
  bookingIdContainer: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  bookingIdLabel: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
    marginBottom: 4,
  },
  bookingId: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  secondaryButton: {
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  primaryButtonText: {
    color: Colors.textInverse,
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  additionalInfo: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    padding: 12,
  },
  infoText: {
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 18,
    marginBottom: 4,
  },
});
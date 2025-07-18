import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Calendar, Clock, ArrowLeft } from 'lucide-react-native';
import { Practitioner } from '@/types/practitioner';
import Colors from '@/constants/Colors';

interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  consultationType: 'in-person' | 'video' | 'phone';
}

interface AvailabilityResultsProps {
  practitioner: Practitioner;
  availableSlots: TimeSlot[];
  message?: string;
  onSlotSelect: (practitioner: Practitioner, slot: TimeSlot) => void;
  onBack?: () => void;
}

export const AvailabilityResults: React.FC<AvailabilityResultsProps> = ({
  practitioner,
  availableSlots,
  message,
  onSlotSelect,
  onBack,
}) => {
  const getConsultationTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return Colors.primary;
      case 'phone':
        return Colors.success;
      case 'in-person':
        return Colors.warning;
      default:
        return Colors.textMuted;
    }
  };

  const getConsultationTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return '📹';
      case 'phone':
        return '📞';
      case 'in-person':
        return '🏥';
      default:
        return '📅';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with practitioner info */}
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <ArrowLeft size={20} color={Colors.primary} />
          </TouchableOpacity>
        )}
        
        <View style={styles.practitionerInfo}>
          <Image
            source={{ 
              uri: practitioner.imageUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400' 
            }}
            style={styles.avatar}
          />
          <View style={styles.practitionerDetails}>
            <Text style={styles.practitionerName}>{practitioner.name}</Text>
            <Text style={styles.practitionerTitle}>{practitioner.title}</Text>
            <Text style={styles.consultationFee}>
              ${practitioner.consultationFee} consultation
            </Text>
          </View>
        </View>
      </View>

      {/* Message */}
      {message && (
        <Text style={styles.message}>{message}</Text>
      )}

      {/* Available slots */}
      {availableSlots.length > 0 ? (
        <View style={styles.slotsContainer}>
          <Text style={styles.slotsTitle}>Available Time Slots</Text>
          
          {availableSlots.map((slot) => (
            <TouchableOpacity
              key={slot.id}
              style={styles.slotCard}
              onPress={() => onSlotSelect(practitioner, slot)}
              activeOpacity={0.7}
            >
              <View style={styles.slotInfo}>
                <View style={styles.slotDateTime}>
                  <View style={styles.dateRow}>
                    <Calendar size={16} color={Colors.primary} />
                    <Text style={styles.slotDate}>{slot.date}</Text>
                  </View>
                  <View style={styles.timeRow}>
                    <Clock size={16} color={Colors.textMuted} />
                    <Text style={styles.slotTime}>
                      {slot.startTime} - {slot.endTime}
                    </Text>
                  </View>
                </View>
                
                <View style={[
                  styles.consultationType,
                  { backgroundColor: `${getConsultationTypeColor(slot.consultationType)}20` }
                ]}>
                  <Text style={styles.consultationTypeIcon}>
                    {getConsultationTypeIcon(slot.consultationType)}
                  </Text>
                  <Text style={[
                    styles.consultationTypeText,
                    { color: getConsultationTypeColor(slot.consultationType) }
                  ]}>
                    {slot.consultationType}
                  </Text>
                </View>
              </View>
              
              <View style={styles.selectButton}>
                <Text style={styles.selectButtonText}>Select</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.noSlotsContainer}>
          <Text style={styles.noSlotsText}>
            No available slots found for Dr. {practitioner.name}
          </Text>
          <Text style={styles.noSlotsSubtext}>
            Please try selecting a different date or contact the practitioner directly.
          </Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  practitionerInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  practitionerDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  practitionerName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  practitionerTitle: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  consultationFee: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  message: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 16,
    lineHeight: 20,
  },
  slotsContainer: {
    marginTop: 8,
  },
  slotsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  slotCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  slotInfo: {
    flex: 1,
  },
  slotDateTime: {
    marginBottom: 8,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slotDate: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginLeft: 6,
  },
  slotTime: {
    fontSize: 14,
    color: Colors.textMuted,
    marginLeft: 6,
  },
  consultationType: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  consultationTypeIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  consultationTypeText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  selectButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  selectButtonText: {
    color: Colors.textInverse,
    fontSize: 14,
    fontWeight: '600',
  },
  noSlotsContainer: {
    alignItems: 'center',
    padding: 24,
  },
  noSlotsText: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '500',
  },
  noSlotsSubtext: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Star, MapPin, Clock, DollarSign } from 'lucide-react-native';
import { Practitioner } from '@/types/practitioner';
import Colors from '@/constants/Colors';

interface PractitionerCardProps {
  practitioner: Practitioner;
  onPress?: () => void;
  onBookPress?: () => void;
  showBookButton?: boolean;
}

export const PractitionerCard: React.FC<PractitionerCardProps> = ({
  practitioner,
  onPress,
  onBookPress,
  showBookButton = true,
}) => {
  const availableSlots = practitioner.availableSlots?.filter(slot => slot.isAvailable) || [];
  const nextAvailableSlot = availableSlots[0];

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Image
          source={{ uri: practitioner.imageUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400' }}
          style={styles.avatar}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{practitioner.name}</Text>
          <Text style={styles.title}>{practitioner.title}</Text>
          <View style={styles.ratingContainer}>
            <Star size={16} color={Colors.primary} fill={Colors.primary} />
            <Text style={styles.rating}>
              {practitioner.rating} ({practitioner.reviewCount} reviews)
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.specializations}>
        {practitioner.specializations.slice(0, 3).map((spec, index) => (
          <View key={index} style={styles.specializationTag}>
            <Text style={styles.specializationText}>{spec}</Text>
          </View>
        ))}
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <MapPin size={14} color={Colors.textMuted} />
          <Text style={styles.detailText}>{practitioner.location}</Text>
        </View>

        <View style={styles.detailRow}>
          <DollarSign size={14} color={Colors.textMuted} />
          <Text style={styles.detailText}>${practitioner.consultationFee} consultation</Text>
        </View>

        <View style={styles.detailRow}>
          <Clock size={14} color={Colors.textMuted} />
          <Text style={styles.detailText}>
            {practitioner.experience} years experience
          </Text>
        </View>

        {nextAvailableSlot && (
          <View style={styles.detailRow}>
            <Clock size={14} color={Colors.success} />
            <Text style={[styles.detailText, { color: Colors.success }]}>
              Next available: {nextAvailableSlot.date} at {nextAvailableSlot.startTime}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.languages}>
        <Text style={styles.languagesLabel}>Languages: </Text>
        <Text style={styles.languagesText}>
          {practitioner.languages.join(', ')}
        </Text>
      </View>

      {showBookButton && (
        <TouchableOpacity
          style={styles.bookButton}
          onPress={onBookPress}
          activeOpacity={0.8}
        >
          <Text style={styles.bookButtonText}>Book Consultation</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  title: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 4,
  },
  specializations: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  specializationTag: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  specializationText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  details: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: Colors.textMuted,
    marginLeft: 6,
  },
  languages: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  languagesLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  languagesText: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  bookButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonText: {
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
  },
});
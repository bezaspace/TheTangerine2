import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Star, MapPin, Clock, DollarSign, Award, Heart } from 'lucide-react-native';
import { Practitioner } from '@/types/practitioner';
import Colors from '@/constants/Colors';

interface PractitionerRecommendation {
  practitioner: Practitioner;
  recommendationReason: string;
  matchScore: number;
  keyBenefits: string[];
  personalizedNote: string;
}

interface PractitionerRecommendationCardProps {
  recommendation: PractitionerRecommendation;
  onPress?: () => void;
  onBookPress?: () => void;
  showBookButton?: boolean;
}

export const PractitionerRecommendationCard: React.FC<PractitionerRecommendationCardProps> = ({
  recommendation,
  onPress,
  onBookPress,
  showBookButton = true,
}) => {
  const { practitioner, recommendationReason, matchScore, keyBenefits, personalizedNote } = recommendation;
  const availableSlots = practitioner.availableSlots?.filter(slot => slot.isAvailable) || [];
  const nextAvailableSlot = availableSlots[0];

  const getMatchScoreColor = (score: number) => {
    if (score >= 9) return Colors.success;
    if (score >= 7) return Colors.primary;
    if (score >= 5) return Colors.warning;
    return Colors.textMuted;
  };

  const getMatchScoreText = (score: number) => {
    if (score >= 9) return 'Excellent Match';
    if (score >= 7) return 'Great Match';
    if (score >= 5) return 'Good Match';
    return 'Suitable Match';
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Match Score Badge */}
      <View style={[styles.matchBadge, { backgroundColor: getMatchScoreColor(matchScore) }]}>
        <Text style={styles.matchBadgeText}>{getMatchScoreText(matchScore)}</Text>
        <Text style={styles.matchScore}>{matchScore}/10</Text>
      </View>

      {/* Practitioner Header */}
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

      {/* AI Recommendation Section */}
      <View style={styles.recommendationSection}>
        <View style={styles.recommendationHeader}>
          <Heart size={16} color={Colors.primary} />
          <Text style={styles.recommendationTitle}>Why I recommend this practitioner</Text>
        </View>
        <Text style={styles.recommendationReason}>{recommendationReason}</Text>
        <Text style={styles.personalizedNote}>{personalizedNote}</Text>
      </View>

      {/* Key Benefits */}
      <View style={styles.benefitsSection}>
        <Text style={styles.benefitsTitle}>Key Benefits for You:</Text>
        <View style={styles.benefitsList}>
          {keyBenefits.map((benefit, index) => (
            <View key={index} style={styles.benefitItem}>
              <Award size={12} color={Colors.success} />
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Specializations */}
      <View style={styles.specializations}>
        {practitioner.specializations.slice(0, 3).map((spec, index) => (
          <View key={index} style={styles.specializationTag}>
            <Text style={styles.specializationText}>{spec}</Text>
          </View>
        ))}
      </View>

      {/* Practitioner Details */}
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

      {/* Languages */}
      <View style={styles.languages}>
        <Text style={styles.languagesLabel}>Languages: </Text>
        <Text style={styles.languagesText}>
          {practitioner.languages.join(', ')}
        </Text>
      </View>

      {/* Book Button */}
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
    borderRadius: 16,
    padding: 20,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
  },
  matchBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: 80,
  },
  matchBadgeText: {
    color: Colors.textInverse,
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  matchScore: {
    color: Colors.textInverse,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 16,
    marginRight: 100, // Space for match badge
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 6,
    fontWeight: '500',
  },
  recommendationSection: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginLeft: 8,
  },
  recommendationReason: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
    marginBottom: 8,
  },
  personalizedNote: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  benefitsSection: {
    marginBottom: 16,
  },
  benefitsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  benefitsList: {
    gap: 6,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  specializations: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  specializationTag: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 6,
  },
  specializationText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  details: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: Colors.textMuted,
    marginLeft: 8,
  },
  languages: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  bookButtonText: {
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: '700',
  },
});
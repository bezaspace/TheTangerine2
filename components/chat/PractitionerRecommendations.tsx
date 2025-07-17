import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { PractitionerRecommendationCard } from './PractitionerRecommendationCard';
import { Practitioner } from '@/types/practitioner';
import Colors from '@/constants/Colors';

interface PractitionerRecommendation {
  practitioner: Practitioner;
  recommendationReason: string;
  matchScore: number;
  keyBenefits: string[];
  personalizedNote: string;
}

interface PractitionerRecommendationsProps {
  recommendations: PractitionerRecommendation[];
  overallSummary?: string;
  onPractitionerPress?: (practitioner: Practitioner) => void;
  onBookPress?: (practitioner: Practitioner) => void;
}

export const PractitionerRecommendations: React.FC<PractitionerRecommendationsProps> = ({
  recommendations,
  overallSummary,
  onPractitionerPress,
  onBookPress,
}) => {
  if (!recommendations || recommendations.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No practitioners found matching your criteria. Try adjusting your search filters.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {overallSummary && (
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>AI Recommendations</Text>
          <Text style={styles.summaryText}>{overallSummary}</Text>
        </View>
      )}
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        {recommendations.map((recommendation, index) => (
          <PractitionerRecommendationCard
            key={recommendation.practitioner.id}
            recommendation={recommendation}
            onPress={() => onPractitionerPress?.(recommendation.practitioner)}
            onBookPress={() => onBookPress?.(recommendation.practitioner)}
            showBookButton={true}
          />
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Showing {recommendations.length} personalized recommendation{recommendations.length !== 1 ? 's' : ''}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 600,
    marginVertical: 8,
  },
  summaryContainer: {
    backgroundColor: Colors.primaryLight,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  summaryTitle: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '700',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
    lineHeight: 20,
  },
  scrollView: {
    flex: 1,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginVertical: 8,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingTop: 12,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500',
  },
});
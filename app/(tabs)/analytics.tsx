import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { Activity, Heart, Utensils, Pill, Dumbbell, Brain, TrendingUp, Calendar, Clock } from 'lucide-react-native';
import Colors from '@/constants/Colors';

const { width } = Dimensions.get('window');

const healthMetrics = {
  heartRate: { current: 72, target: 70, unit: 'bpm', trend: 'up' },
  weight: { current: 68.5, target: 65, unit: 'kg', trend: 'down' },
  sleep: { current: 7.2, target: 8, unit: 'hrs', trend: 'up' },
  steps: { current: 8420, target: 10000, unit: 'steps', trend: 'up' },
};

const weeklyData = [
  { day: 'Mon', meditation: 20, yoga: 45, workout: 30, sleep: 7.5 },
  { day: 'Tue', meditation: 15, yoga: 60, workout: 0, sleep: 6.8 },
  { day: 'Wed', meditation: 25, yoga: 30, workout: 45, sleep: 7.2 },
  { day: 'Thu', meditation: 30, yoga: 45, workout: 30, sleep: 8.1 },
  { day: 'Fri', meditation: 20, yoga: 0, workout: 60, sleep: 7.0 },
  { day: 'Sat', meditation: 35, yoga: 90, workout: 0, sleep: 8.5 },
  { day: 'Sun', meditation: 40, yoga: 60, workout: 30, sleep: 8.2 },
];

const medications = [
  { name: 'Ashwagandha', time: '8:00 AM', taken: true, type: 'supplement' },
  { name: 'Turmeric Capsule', time: '12:00 PM', taken: true, type: 'supplement' },
  { name: 'Triphala', time: '8:00 PM', taken: false, type: 'supplement' },
];

const dietLog = [
  { meal: 'Breakfast', items: ['Oatmeal with berries', 'Green tea'], calories: 320, time: '8:30 AM' },
  { meal: 'Lunch', items: ['Quinoa salad', 'Herbal soup'], calories: 450, time: '1:00 PM' },
  { meal: 'Snack', items: ['Almonds', 'Apple'], calories: 180, time: '4:00 PM' },
  { meal: 'Dinner', items: ['Grilled vegetables', 'Brown rice'], calories: 380, time: '7:30 PM' },
];

export default function AnalyticsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const renderMetricCard = (key, metric) => (
    <View key={key} style={styles.metricCard}>
      <View style={styles.metricHeader}>
        <Text style={styles.metricTitle}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
        <View style={[styles.trendIndicator, metric.trend === 'up' ? styles.trendUp : styles.trendDown]}>
          <TrendingUp size={12} color={metric.trend === 'up' ? Colors.success : Colors.primary} />
        </View>
      </View>
      <Text style={styles.metricValue}>{metric.current} {metric.unit}</Text>
      <Text style={styles.metricTarget}>Target: {metric.target} {metric.unit}</Text>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${Math.min((metric.current / metric.target) * 100, 100)}%` }
          ]} 
        />
      </View>
    </View>
  );

  const renderWeeklyChart = () => (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Weekly Activity Overview</Text>
      <View style={styles.chart}>
        {weeklyData.map((day, index) => (
          <View key={index} style={styles.chartDay}>
            <View style={styles.chartBars}>
              <View style={[styles.chartBar, styles.meditationBar, { height: day.meditation * 2 }]} />
              <View style={[styles.chartBar, styles.yogaBar, { height: day.yoga }]} />
              <View style={[styles.chartBar, styles.workoutBar, { height: day.workout }]} />
            </View>
            <Text style={styles.chartDayLabel}>{day.day}</Text>
          </View>
        ))}
      </View>
      <View style={styles.chartLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, styles.meditationBar]} />
          <Text style={styles.legendText}>Meditation</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, styles.yogaBar]} />
          <Text style={styles.legendText}>Yoga</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, styles.workoutBar]} />
          <Text style={styles.legendText}>Workout</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Health Analytics</Text>
          <Text style={styles.subtitle}>Track your wellness journey</Text>
        </View>

        <View style={styles.periodSelector}>
          {['week', 'month', 'year'].map((period) => (
            <TouchableOpacity
              key={period}
              style={[styles.periodButton, selectedPeriod === period && styles.activePeriodButton]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[styles.periodText, selectedPeriod === period && styles.activePeriodText]}>
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.metricsGrid}>
          {Object.entries(healthMetrics).map(([key, metric]) => renderMetricCard(key, metric))}
        </View>

        {renderWeeklyChart()}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Pill size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Today's Medications</Text>
          </View>
          
          {medications.map((med, index) => (
            <View key={index} style={styles.medicationItem}>
              <View style={styles.medicationInfo}>
                <Text style={styles.medicationName}>{med.name}</Text>
                <View style={styles.medicationDetails}>
                  <Clock size={14} color={Colors.textSecondary} />
                  <Text style={styles.medicationTime}>{med.time}</Text>
                  <View style={[styles.medicationType, med.type === 'supplement' && styles.supplementType]}>
                    <Text style={styles.medicationTypeText}>{med.type}</Text>
                  </View>
                </View>
              </View>
              <View style={[styles.medicationStatus, med.taken && styles.medicationTaken]}>
                <Text style={[styles.statusText, med.taken && styles.takenText]}>
                  {med.taken ? 'Taken' : 'Pending'}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Utensils size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Today's Diet Log</Text>
          </View>
          
          {dietLog.map((meal, index) => (
            <View key={index} style={styles.dietItem}>
              <View style={styles.dietHeader}>
                <Text style={styles.mealName}>{meal.meal}</Text>
                <Text style={styles.mealTime}>{meal.time}</Text>
              </View>
              <View style={styles.mealItems}>
                {meal.items.map((item, itemIndex) => (
                  <Text key={itemIndex} style={styles.mealItem}>• {item}</Text>
                ))}
              </View>
              <Text style={styles.mealCalories}>{meal.calories} calories</Text>
            </View>
          ))}
          
          <View style={styles.caloriesSummary}>
            <Text style={styles.caloriesTotal}>Total: 1,330 calories</Text>
            <Text style={styles.caloriesTarget}>Target: 1,800 calories</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Brain size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Wellness Insights</Text>
          </View>
          
          <View style={styles.insightCard}>
            <Text style={styles.insightTitle}>Great Progress!</Text>
            <Text style={styles.insightText}>
              Your meditation consistency has improved by 40% this week. Keep up the excellent work!
            </Text>
          </View>
          
          <View style={styles.insightCard}>
            <Text style={styles.insightTitle}>Recommendation</Text>
            <Text style={styles.insightText}>
              Consider adding 15 minutes of evening yoga to improve your sleep quality.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    backgroundColor: Colors.backgroundSecondary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activePeriodButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  periodText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  activePeriodText: {
    color: Colors.textInverse,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  metricCard: {
    width: (width - 52) / 2,
    backgroundColor: Colors.backgroundCard,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  trendIndicator: {
    padding: 4,
    borderRadius: 12,
  },
  trendUp: {
    backgroundColor: Colors.backgroundSecondary,
  },
  trendDown: {
    backgroundColor: Colors.backgroundSecondary,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  metricTarget: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  chartContainer: {
    backgroundColor: Colors.backgroundCard,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 16,
  },
  chartDay: {
    alignItems: 'center',
    flex: 1,
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 100,
    marginBottom: 8,
  },
  chartBar: {
    width: 8,
    marginHorizontal: 1,
    borderRadius: 4,
  },
  meditationBar: {
    backgroundColor: Colors.success,
  },
  yogaBar: {
    backgroundColor: Colors.primary,
  },
  workoutBar: {
    backgroundColor: '#3B82F6',
  },
  chartDayLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
  },
  medicationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  medicationDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medicationTime: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 4,
    marginRight: 8,
  },
  medicationType: {
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  supplementType: {
    backgroundColor: Colors.backgroundSecondary,
  },
  medicationTypeText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  medicationStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.warning,
  },
  medicationTaken: {
    backgroundColor: Colors.success,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textInverse,
  },
  takenText: {
    color: Colors.textInverse,
  },
  dietItem: {
    backgroundColor: Colors.backgroundCard,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dietHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  mealTime: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  mealItems: {
    marginBottom: 8,
  },
  mealItem: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  mealCalories: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  caloriesSummary: {
    backgroundColor: Colors.backgroundCard,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  caloriesTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  caloriesTarget: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  insightCard: {
    backgroundColor: Colors.backgroundCard,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 6,
  },
  insightText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
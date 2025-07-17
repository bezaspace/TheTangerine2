import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { Activity, Heart, Utensils, Pill, Dumbbell, Brain, TrendingUp, Calendar, Clock } from 'lucide-react-native';

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
          <TrendingUp size={12} color={metric.trend === 'up' ? '#87A96B' : '#FF8C42'} />
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
            <Pill size={20} color="#FF8C42" />
            <Text style={styles.sectionTitle}>Today's Medications</Text>
          </View>
          
          {medications.map((med, index) => (
            <View key={index} style={styles.medicationItem}>
              <View style={styles.medicationInfo}>
                <Text style={styles.medicationName}>{med.name}</Text>
                <View style={styles.medicationDetails}>
                  <Clock size={14} color="#6B7280" />
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
            <Utensils size={20} color="#FF8C42" />
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
            <Brain size={20} color="#FF8C42" />
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
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
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
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activePeriodButton: {
    backgroundColor: '#FF8C42',
    borderColor: '#FF8C42',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activePeriodText: {
    color: '#FFFFFF',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  metricCard: {
    width: (width - 52) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    color: '#6B7280',
  },
  trendIndicator: {
    padding: 4,
    borderRadius: 12,
  },
  trendUp: {
    backgroundColor: '#F0F9FF',
  },
  trendDown: {
    backgroundColor: '#FFF7F0',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  metricTarget: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF8C42',
    borderRadius: 2,
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
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
    backgroundColor: '#87A96B',
  },
  yogaBar: {
    backgroundColor: '#FF8C42',
  },
  workoutBar: {
    backgroundColor: '#3B82F6',
  },
  chartDayLabel: {
    fontSize: 12,
    color: '#6B7280',
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
    color: '#6B7280',
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
    color: '#1F2937',
    marginLeft: 8,
  },
  medicationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  medicationDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medicationTime: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
    marginRight: 8,
  },
  medicationType: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  supplementType: {
    backgroundColor: '#FFF7F0',
  },
  medicationTypeText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  medicationStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#FEF3C7',
  },
  medicationTaken: {
    backgroundColor: '#D1FAE5',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D97706',
  },
  takenText: {
    color: '#059669',
  },
  dietItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
    color: '#1F2937',
  },
  mealTime: {
    fontSize: 14,
    color: '#6B7280',
  },
  mealItems: {
    marginBottom: 8,
  },
  mealItem: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  mealCalories: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF8C42',
  },
  caloriesSummary: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  caloriesTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  caloriesTarget: {
    fontSize: 14,
    color: '#6B7280',
  },
  insightCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#87A96B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
  },
  insightText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});
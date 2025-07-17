import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Calendar, Clock, Utensils, Pill, Activity, User, CircleCheck as CheckCircle, Circle } from 'lucide-react-native';

const scheduleItems = [
  {
    id: 1,
    type: 'medication',
    title: 'Ashwagandha Capsule',
    time: '7:00 AM',
    description: 'Take with warm water',
    completed: true,
    icon: Pill,
    color: '#87A96B',
  },
  {
    id: 2,
    type: 'diet',
    title: 'Breakfast',
    time: '8:00 AM',
    description: 'Oatmeal with berries and green tea',
    completed: true,
    icon: Utensils,
    color: '#FF8C42',
  },
  {
    id: 3,
    type: 'yoga',
    title: 'Morning Yoga',
    time: '9:00 AM',
    description: '30 minutes of Hatha yoga',
    completed: false,
    icon: Activity,
    color: '#3B82F6',
  },
  {
    id: 4,
    type: 'medication',
    title: 'Turmeric Capsule',
    time: '12:00 PM',
    description: 'Take after lunch',
    completed: false,
    icon: Pill,
    color: '#87A96B',
  },
  {
    id: 5,
    type: 'diet',
    title: 'Lunch',
    time: '1:00 PM',
    description: 'Quinoa salad with herbal soup',
    completed: false,
    icon: Utensils,
    color: '#FF8C42',
  },
  {
    id: 6,
    type: 'appointment',
    title: 'Dr. Priya Sharma',
    time: '2:00 PM',
    description: 'Ayurvedic consultation',
    completed: false,
    icon: User,
    color: '#8B5CF6',
  },
  {
    id: 7,
    type: 'diet',
    title: 'Afternoon Snack',
    time: '4:00 PM',
    description: 'Almonds and herbal tea',
    completed: false,
    icon: Utensils,
    color: '#FF8C42',
  },
  {
    id: 8,
    type: 'workout',
    title: 'Evening Walk',
    time: '6:00 PM',
    description: '30 minutes brisk walk',
    completed: false,
    icon: Activity,
    color: '#10B981',
  },
  {
    id: 9,
    type: 'diet',
    title: 'Dinner',
    time: '7:30 PM',
    description: 'Grilled vegetables with brown rice',
    completed: false,
    icon: Utensils,
    color: '#FF8C42',
  },
  {
    id: 10,
    type: 'medication',
    title: 'Triphala',
    time: '8:00 PM',
    description: 'Take before bedtime',
    completed: false,
    icon: Pill,
    color: '#87A96B',
  },
  {
    id: 11,
    type: 'yoga',
    title: 'Evening Meditation',
    time: '9:00 PM',
    description: '15 minutes mindfulness meditation',
    completed: false,
    icon: Activity,
    color: '#3B82F6',
  },
];

export default function ScheduleScreen() {
  const [items, setItems] = useState(scheduleItems);

  const toggleCompletion = (id) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'medication': return 'Medication';
      case 'diet': return 'Diet';
      case 'yoga': return 'Yoga';
      case 'workout': return 'Workout';
      case 'appointment': return 'Appointment';
      default: return 'Activity';
    }
  };

  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Today's Schedule</Text>
          <Text style={styles.subtitle}>March 15, 2024</Text>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressText}>
                {completedCount} of {totalCount} completed
              </Text>
              <Text style={styles.progressPercentage}>
                {Math.round(progressPercentage)}%
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[styles.progressFill, { width: `${progressPercentage}%` }]} 
              />
            </View>
          </View>
        </View>

        <View style={styles.timeline}>
          {items.map((item, index) => (
            <View key={item.id} style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <Text style={styles.timeText}>{item.time}</Text>
                <View style={styles.timelineDot}>
                  <View style={[
                    styles.dot,
                    { backgroundColor: item.completed ? item.color : '#E5E7EB' }
                  ]} />
                  {index < items.length - 1 && (
                    <View style={styles.timelineLine} />
                  )}
                </View>
              </View>
              
              <TouchableOpacity 
                style={[
                  styles.activityCard,
                  item.completed && styles.completedCard
                ]}
                onPress={() => toggleCompletion(item.id)}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.activityInfo}>
                    <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
                      <item.icon size={20} color={item.color} />
                    </View>
                    <View style={styles.activityDetails}>
                      <View style={styles.titleRow}>
                        <Text style={[
                          styles.activityTitle,
                          item.completed && styles.completedText
                        ]}>
                          {item.title}
                        </Text>
                        <View style={[styles.typeBadge, { backgroundColor: `${item.color}20` }]}>
                          <Text style={[styles.typeText, { color: item.color }]}>
                            {getTypeLabel(item.type)}
                          </Text>
                        </View>
                      </View>
                      <Text style={[
                        styles.activityDescription,
                        item.completed && styles.completedDescription
                      ]}>
                        {item.description}
                      </Text>
                    </View>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.checkButton}
                    onPress={() => toggleCompletion(item.id)}
                  >
                    {item.completed ? (
                      <CheckCircle size={24} color={item.color} />
                    ) : (
                      <Circle size={24} color="#9CA3AF" />
                    )}
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </View>
          ))}
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
    marginBottom: 20,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF8C42',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF8C42',
    borderRadius: 3,
  },
  timeline: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 16,
    width: 60,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  timelineDot: {
    alignItems: 'center',
    position: 'relative',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    zIndex: 1,
  },
  timelineLine: {
    position: 'absolute',
    top: 12,
    width: 2,
    height: 60,
    backgroundColor: '#E5E7EB',
  },
  activityCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  completedCard: {
    backgroundColor: '#F9FAFB',
    opacity: 0.8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityDetails: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  activityDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
  },
  completedDescription: {
    color: '#9CA3AF',
  },
  checkButton: {
    padding: 4,
  },
});
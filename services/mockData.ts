import { Practitioner, TimeSlot } from '@/types/practitioner';

// Generate mock time slots for the next 30 days
const generateTimeSlots = (practitionerId: string): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const today = new Date();
  
  for (let day = 1; day <= 30; day++) {
    const date = new Date(today);
    date.setDate(today.getDate() + day);
    
    // Skip weekends for some practitioners
    if (practitionerId === '1' && (date.getDay() === 0 || date.getDay() === 6)) {
      continue;
    }
    
    const timeSlots = ['09:00', '10:30', '14:00', '15:30', '17:00'];
    
    timeSlots.forEach((time, index) => {
      // Randomly make some slots unavailable
      const isAvailable = Math.random() > 0.3;
      
      slots.push({
        id: `${practitionerId}-${date.toISOString().split('T')[0]}-${index}`,
        date: date.toISOString().split('T')[0],
        startTime: time,
        endTime: addMinutes(time, 60),
        isAvailable,
        consultationType: Math.random() > 0.5 ? 'video' : 'in-person',
      });
    });
  }
  
  return slots;
};

const addMinutes = (time: string, minutes: number): string => {
  const [hours, mins] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, mins + minutes);
  return date.toTimeString().slice(0, 5);
};

export const mockPractitioners: Practitioner[] = [
  {
    id: '1',
    name: 'Dr. Priya Sharma',
    title: 'Senior Ayurvedic Physician',
    specializations: ['Panchakarma', 'Women\'s Health', 'Digestive Disorders'],
    experience: 15,
    rating: 4.8,
    reviewCount: 127,
    location: 'Mumbai, India',
    bio: 'Dr. Priya Sharma is a renowned Ayurvedic physician with over 15 years of experience in traditional healing. She specializes in Panchakarma treatments and has helped thousands of patients achieve optimal health through personalized Ayurvedic protocols.',
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
    consultationFee: 150,
    availableSlots: [],
    languages: ['English', 'Hindi', 'Marathi'],
    certifications: ['BAMS', 'MD (Ayurveda)', 'Panchakarma Specialist'],
  },
  {
    id: '2',
    name: 'Dr. Rajesh Kumar',
    title: 'Ayurvedic Consultant & Herbalist',
    specializations: ['Respiratory Disorders', 'Skin Conditions', 'Stress Management'],
    experience: 12,
    rating: 4.6,
    reviewCount: 89,
    location: 'Delhi, India',
    bio: 'Dr. Rajesh Kumar combines traditional Ayurvedic wisdom with modern diagnostic techniques. His expertise in herbal medicine and respiratory health has made him a sought-after practitioner for chronic conditions.',
    imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
    consultationFee: 120,
    availableSlots: [],
    languages: ['English', 'Hindi', 'Punjabi'],
    certifications: ['BAMS', 'Diploma in Yoga & Naturopathy'],
  },
  {
    id: '3',
    name: 'Dr. Meera Nair',
    title: 'Ayurvedic Lifestyle Coach',
    specializations: ['Nutrition & Diet', 'Mental Health', 'Preventive Care'],
    experience: 8,
    rating: 4.9,
    reviewCount: 156,
    location: 'Kochi, India',
    bio: 'Dr. Meera Nair focuses on preventive Ayurveda and lifestyle modification. Her holistic approach to mental and physical wellness has transformed the lives of many seeking natural healing solutions.',
    imageUrl: 'https://images.unsplash.com/photo-1594824475317-1c4b8b6b8e8e?w=400',
    consultationFee: 100,
    availableSlots: [],
    languages: ['English', 'Malayalam', 'Tamil'],
    certifications: ['BAMS', 'Certified Ayurvedic Lifestyle Counselor'],
  },
  {
    id: '4',
    name: 'Dr. Arjun Patel',
    title: 'Traditional Ayurvedic Healer',
    specializations: ['Joint & Bone Health', 'Chronic Pain', 'Detoxification'],
    experience: 20,
    rating: 4.7,
    reviewCount: 203,
    location: 'Ahmedabad, India',
    bio: 'With two decades of experience, Dr. Arjun Patel is an expert in traditional Ayurvedic treatments for musculoskeletal disorders. His specialized therapies have provided relief to countless patients with chronic pain.',
    imageUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400',
    consultationFee: 180,
    availableSlots: [],
    languages: ['English', 'Hindi', 'Gujarati'],
    certifications: ['BAMS', 'MD (Ayurveda)', 'Specialized in Panchakarma'],
  },
  {
    id: '5',
    name: 'Dr. Lakshmi Iyer',
    title: 'Ayurvedic Pediatric Specialist',
    specializations: ['Child Health', 'Immunity Building', 'Growth & Development'],
    experience: 10,
    rating: 4.8,
    reviewCount: 94,
    location: 'Bangalore, India',
    bio: 'Dr. Lakshmi Iyer specializes in pediatric Ayurveda, helping children achieve optimal health through gentle, natural treatments. Her expertise in child immunity and development is highly valued by parents.',
    imageUrl: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400',
    consultationFee: 130,
    availableSlots: [],
    languages: ['English', 'Tamil', 'Kannada'],
    certifications: ['BAMS', 'Diploma in Child Health (Ayurveda)'],
  },
];

// Initialize time slots for all practitioners
mockPractitioners.forEach(practitioner => {
  practitioner.availableSlots = generateTimeSlots(practitioner.id);
});

export const getMockPractitioners = (): Practitioner[] => {
  return mockPractitioners.map(p => ({ ...p }));
};
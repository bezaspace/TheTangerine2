import { Type } from '@google/genai';

// Structured output schema for alternating practitioner recommendations
export interface AlternatingRecommendationSchema {
  recommendations: AlternatingRecommendationItem[];
  overallSummary: string;
}

export interface AlternatingRecommendationItem {
  type: 'explanation' | 'practitioner-card';
  explanation?: string;
  practitionerId?: string;
  recommendationReason?: string;
  keyBenefits?: string[];
  matchScore?: number;
}

// Gemini schema definition for alternating recommendations
export const ALTERNATING_RECOMMENDATION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    recommendations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: {
            type: Type.STRING,
            enum: ['explanation', 'practitioner-card'],
            description: 'Type of content - explanation text or practitioner card'
          },
          explanation: {
            type: Type.STRING,
            description: 'Detailed explanation text when type is explanation'
          },
          practitionerId: {
            type: Type.STRING,
            description: 'Practitioner ID when type is practitioner-card'
          },
          recommendationReason: {
            type: Type.STRING,
            description: 'Why this practitioner is recommended'
          },
          keyBenefits: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Key benefits this practitioner offers'
          },
          matchScore: {
            type: Type.INTEGER,
            description: 'Match score from 1-10'
          }
        },
        required: ['type'],
        propertyOrdering: ['type', 'explanation', 'practitionerId', 'recommendationReason', 'keyBenefits', 'matchScore']
      }
    },
    overallSummary: {
      type: Type.STRING,
      description: 'Overall summary of all recommendations'
    }
  },
  required: ['recommendations', 'overallSummary'],
  propertyOrdering: ['recommendations', 'overallSummary']
};

// Streaming chunk interface for real-time processing
export interface StreamingChunk {
  type: 'explanation' | 'practitioner-card' | 'summary';
  content: string;
  practitionerId?: string;
  isComplete: boolean;
  sequenceIndex: number;
}
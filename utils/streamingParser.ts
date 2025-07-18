import { StreamingChunk, AlternatingRecommendationItem } from '@/types/structuredOutput';
import { StreamingRecommendationChunk } from '@/types/chat';

export interface StreamingPractitionerData {
  id: string;
  name: string;
  explanation: string;
}

export interface ParsedStreamingContent {
  textContent: string;
  practitionerData: StreamingPractitionerData | null;
  isComplete: boolean;
}

export class StreamingParser {
  private static PRACTITIONER_MARKER = '[SHOW_PRACTITIONER:';
  private static MARKER_END = ']';

  // Legacy methods for backward compatibility
  static parsePractitionerMarker(text: string): { practitionerId: string; cleanText: string } | null {
    const markerStart = text.indexOf(this.PRACTITIONER_MARKER);
    if (markerStart === -1) return null;

    const markerEndPos = text.indexOf(this.MARKER_END, markerStart);
    if (markerEndPos === -1) return null;

    const practitionerId = text.substring(
      markerStart + this.PRACTITIONER_MARKER.length,
      markerEndPos
    );

    const cleanText = text.substring(0, markerStart) + text.substring(markerEndPos + 1);

    return { practitionerId, cleanText };
  }

  // New structured streaming parser
  static parseStructuredRecommendations(
    structuredData: any,
    practitioners: any[]
  ): StreamingRecommendationChunk[] {
    const chunks: StreamingRecommendationChunk[] = [];
    
    if (!structuredData?.recommendations) return chunks;

    structuredData.recommendations.forEach((item: AlternatingRecommendationItem, index: number) => {
      if (item.type === 'explanation' && item.explanation) {
        chunks.push({
          type: 'explanation',
          content: item.explanation,
          isComplete: true
        });
      } else if (item.type === 'practitioner-card' && item.practitionerId) {
        const practitioner = practitioners.find(p => p.id === item.practitionerId);
        if (practitioner) {
          chunks.push({
            type: 'practitioner-card',
            content: '',
            practitionerId: item.practitionerId,
            practitioner: practitioner,
            isComplete: true
          });
        }
      }
    });

    // Add summary chunk if available
    if (structuredData.overallSummary) {
      chunks.push({
        type: 'summary',
        content: structuredData.overallSummary,
        isComplete: true
      });
    }

    return chunks;
  }

  // Stream individual words for realistic typing effect
  static async *streamText(text: string, delayMs: number = 50): AsyncGenerator<string, void, unknown> {
    const words = text.split(' ');
    let currentText = '';
    
    for (let i = 0; i < words.length; i++) {
      currentText += (i > 0 ? ' ' : '') + words[i];
      yield currentText;
      
      if (i < words.length - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs + Math.random() * 50));
      }
    }
  }

  // Create streaming chunks from structured data with proper sequencing
  static createSequentialChunks(
    structuredData: any,
    practitioners: any[]
  ): Array<{ type: 'explanation' | 'practitioner-card'; content: string; practitioner?: any }> {
    const chunks: Array<{ type: 'explanation' | 'practitioner-card'; content: string; practitioner?: any }> = [];
    
    if (!structuredData?.recommendations) return chunks;

    // Process recommendations in order to create alternating pattern
    structuredData.recommendations.forEach((item: AlternatingRecommendationItem) => {
      if (item.type === 'explanation' && item.explanation) {
        chunks.push({
          type: 'explanation',
          content: item.explanation
        });
      } else if (item.type === 'practitioner-card' && item.practitionerId) {
        const practitioner = practitioners.find(p => p.id === item.practitionerId);
        if (practitioner) {
          chunks.push({
            type: 'practitioner-card',
            content: '',
            practitioner: practitioner
          });
        }
      }
    });

    return chunks;
  }

  static extractPractitionerExplanations(fullText: string): Array<{
    explanation: string;
    practitionerId?: string;
  }> {
    const sections = [];
    let currentText = fullText;
    let lastIndex = 0;

    while (true) {
      const markerStart = currentText.indexOf(this.PRACTITIONER_MARKER, lastIndex);
      if (markerStart === -1) {
        // No more markers, add remaining text
        if (lastIndex < currentText.length) {
          const remainingText = currentText.substring(lastIndex).trim();
          if (remainingText) {
            sections.push({ explanation: remainingText });
          }
        }
        break;
      }

      // Add text before marker
      if (markerStart > lastIndex) {
        const explanation = currentText.substring(lastIndex, markerStart).trim();
        if (explanation) {
          sections.push({ explanation });
        }
      }

      // Find marker end
      const markerEndPos = currentText.indexOf(this.MARKER_END, markerStart);
      if (markerEndPos === -1) break;

      const practitionerId = currentText.substring(
        markerStart + this.PRACTITIONER_MARKER.length,
        markerEndPos
      );

      sections.push({ explanation: '', practitionerId });
      lastIndex = markerEndPos + 1;
    }

    return sections;
  }
}
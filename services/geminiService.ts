import { GoogleGenAI } from '@google/genai';
import { GeminiConfig, GeminiResponse, GeminiError } from '@/types/gemini';
import Constants from 'expo-constants';

class GeminiService {
  private ai: GoogleGenAI;
  private defaultConfig: GeminiConfig = {
    model: 'gemini-2.5-flash',
    temperature: 0.7,
    maxOutputTokens: 2048,
  };

  constructor() {
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
    
    if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.trim() === '') {
      console.warn('Gemini API key not configured. Please set EXPO_PUBLIC_GEMINI_API_KEY in your .env file');
      // For demo purposes, we'll create a mock service
      this.ai = null as any;
      return;
    }

    this.ai = new GoogleGenAI({
      apiKey: apiKey,
    });
  }

  private getSystemInstruction(): string {
    return `You are a helpful AI assistant for Tangerine, an Ayurvedic wellness and practitioner booking app. 

Your role is to:
- Help users understand Ayurvedic principles and practices
- Provide general wellness guidance based on Ayurvedic traditions
- Assist with questions about the app's features and services
- Offer supportive and compassionate responses about health and wellness
- Guide users toward appropriate practitioners when needed

Important guidelines:
- Always emphasize that your advice is for general wellness and not a substitute for professional medical care
- Encourage users to consult with qualified Ayurvedic practitioners for personalized treatment
- Be warm, supportive, and knowledgeable about holistic wellness
- Keep responses concise but informative
- If asked about serious health conditions, always recommend consulting healthcare professionals

Respond in a friendly, knowledgeable tone that reflects the app's focus on natural healing and wellness.`;
  }

  async generateResponse(
    message: string,
    config?: Partial<GeminiConfig>
  ): Promise<GeminiResponse> {
    // Mock response when API key is not configured
    if (!this.ai) {
      return this.getMockResponse(message);
    }

    try {
      const finalConfig = { ...this.defaultConfig, ...config };
      
      const response = await this.ai.models.generateContent({
        model: finalConfig.model,
        contents: message,
        config: {
          systemInstruction: this.getSystemInstruction(),
          temperature: finalConfig.temperature,
          maxOutputTokens: finalConfig.maxOutputTokens,
          topP: finalConfig.topP,
          topK: finalConfig.topK,
        },
      });

      return {
        text: response.text || 'I apologize, but I couldn\'t generate a response. Please try again.',
      };
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      
      const geminiError: GeminiError = {
        message: error.message || 'An unexpected error occurred',
        code: error.code,
        status: error.status,
      };

      throw geminiError;
    }
  }

  private getMockResponse(message: string): Promise<GeminiResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const responses = [
          "Hello! I'm your Ayurvedic wellness assistant. While I'm currently in demo mode (API key not configured), I'm here to help you understand Ayurvedic principles and guide you on your wellness journey.",
          "That's a great question about Ayurveda! In a fully configured setup, I would provide detailed guidance about holistic wellness practices. For now, I recommend consulting with one of our qualified practitioners through the app.",
          "Ayurveda emphasizes balance between mind, body, and spirit. Each person has a unique constitution (prakriti) that determines their optimal lifestyle and dietary choices. Would you like to learn more about finding the right practitioner for you?",
          "Wellness is a journey, not a destination. Ayurvedic practices focus on prevention and maintaining harmony within your body's natural systems. I'd love to help you explore these concepts further once fully configured!",
          "Thank you for using Tangerine! While I'm in demo mode, I can still guide you through the app's features. Try exploring our practitioner profiles or booking system to find the perfect match for your wellness needs."
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        resolve({
          text: `${randomResponse}\n\n*Note: This is a demo response. Configure your Gemini API key in the .env file for full AI functionality.*`,
        });
      }, 1000 + Math.random() * 2000); // Simulate API delay
    });
  }

  async *generateStreamResponse(
    message: string,
    config?: Partial<GeminiConfig>
  ): AsyncGenerator<string, void, unknown> {
    // Mock streaming when API key is not configured
    if (!this.ai) {
      const mockResponse = await this.getMockResponse(message);
      const words = mockResponse.text.split(' ');
      
      for (let i = 0; i < words.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
        yield words.slice(0, i + 1).join(' ');
      }
      return;
    }

    try {
      const finalConfig = { ...this.defaultConfig, ...config };
      
      const response = await this.ai.models.generateContentStream({
        model: finalConfig.model,
        contents: message,
        config: {
          systemInstruction: this.getSystemInstruction(),
          temperature: finalConfig.temperature,
          maxOutputTokens: finalConfig.maxOutputTokens,
          topP: finalConfig.topP,
          topK: finalConfig.topK,
        },
      });

      for await (const chunk of response) {
        if (chunk.text) {
          yield chunk.text;
        }
      }
    } catch (error: any) {
      console.error('Gemini Streaming Error:', error);
      throw new Error(error.message || 'Streaming failed');
    }
  }

  async generateChatResponse(
    messages: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }>,
    config?: Partial<GeminiConfig>
  ): Promise<GeminiResponse> {
    try {
      const finalConfig = { ...this.defaultConfig, ...config };
      
      const chat = this.ai.chats.create({
        model: finalConfig.model,
        history: messages.slice(0, -1), // All messages except the last one
        config: {
          systemInstruction: this.getSystemInstruction(),
          temperature: finalConfig.temperature,
          maxOutputTokens: finalConfig.maxOutputTokens,
        },
      });

      const lastMessage = messages[messages.length - 1];
      const response = await chat.sendMessage({
        message: lastMessage.parts[0].text,
      });

      return {
        text: response.text || 'I apologize, but I couldn\'t generate a response. Please try again.',
      };
    } catch (error: any) {
      console.error('Gemini Chat Error:', error);
      throw new Error(error.message || 'Chat response failed');
    }
  }
}

export const geminiService = new GeminiService();
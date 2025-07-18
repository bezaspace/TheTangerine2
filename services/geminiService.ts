import { GoogleGenAI, Type } from '@google/genai';
import { GeminiConfig, GeminiResponse, GeminiError } from '@/types/gemini';
import { FunctionCall, FunctionResponse } from '@/types/functionCalling';
import { practitionerService } from './practitionerService';

class GeminiService {
  private ai: GoogleGenAI;
  private chat: any = null; // Store the chat instance
  private defaultConfig: GeminiConfig = {
    model: 'gemini-2.5-flash',
    temperature: 0.7,
    maxOutputTokens: 2048,
  };

  // Function declarations following Gemini guide patterns
  private functionDeclarations = [
    {
      name: 'search_practitioners_with_recommendations',
      description: 'Search for Ayurvedic practitioners and generate structured alternating recommendations with explanations and practitioner cards. Use this when users ask to find doctors, practitioners, or need health guidance.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          query: {
            type: Type.STRING,
            description: 'General search query or health concern (e.g., "digestive issues", "stress management")',
          },
          specialization: {
            type: Type.STRING,
            description: 'Specific Ayurvedic specialization (e.g., "Panchakarma", "Women\'s Health", "Digestive Disorders")',
          },
          location: {
            type: Type.STRING,
            description: 'City or location preference (e.g., "Mumbai", "Delhi")',
          },
          maxFee: {
            type: Type.NUMBER,
            description: 'Maximum consultation fee in USD',
          },
          minRating: {
            type: Type.NUMBER,
            description: 'Minimum practitioner rating (1-5 scale)',
          },
          availableDate: {
            type: Type.STRING,
            description: 'Preferred appointment date in YYYY-MM-DD format',
          },
          consultationType: {
            type: Type.STRING,
            enum: ['in-person', 'video', 'phone'],
            description: 'Type of consultation preferred',
          },
          language: {
            type: Type.STRING,
            description: 'Preferred language for consultation (e.g., "English", "Hindi")',
          },
          limit: {
            type: Type.NUMBER,
            description: 'Maximum number of practitioners to return (default: 3)',
          },
        },
        required: [],
      },
    },
    {
      name: 'check_availability',
      description: 'Check available appointment slots for a specific practitioner. Use this when users want to see available times for booking.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          practitionerId: {
            type: Type.STRING,
            description: 'The unique ID of the practitioner',
          },
          date: {
            type: Type.STRING,
            description: 'Specific date to check availability in YYYY-MM-DD format (optional)',
          },
          consultationType: {
            type: Type.STRING,
            enum: ['in-person', 'video', 'phone'],
            description: 'Type of consultation to check availability for (optional)',
          },
        },
        required: ['practitionerId'],
      },
    },
    {
      name: 'book_appointment',
      description: 'Book an appointment with a practitioner for a specific time slot. Use this when users want to confirm a booking.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          practitionerId: {
            type: Type.STRING,
            description: 'The unique ID of the practitioner',
          },
          slotId: {
            type: Type.STRING,
            description: 'The unique ID of the time slot to book',
          },
          patientName: {
            type: Type.STRING,
            description: 'Full name of the patient',
          },
          patientEmail: {
            type: Type.STRING,
            description: 'Email address of the patient',
          },
          patientPhone: {
            type: Type.STRING,
            description: 'Phone number of the patient',
          },
          consultationType: {
            type: Type.STRING,
            enum: ['in-person', 'video', 'phone'],
            description: 'Type of consultation',
          },
          symptoms: {
            type: Type.STRING,
            description: 'Patient symptoms or health concerns (optional)',
          },
          notes: {
            type: Type.STRING,
            description: 'Additional notes or special requests (optional)',
          },
        },
        required: ['practitionerId', 'slotId', 'patientName', 'patientEmail', 'patientPhone', 'consultationType'],
      },
    },
  ];

  // Tool functions mapping
  private toolFunctions = {
    search_practitioners_with_recommendations: (args: any) => this.generateAlternatingPractitionerRecommendations(args),
    check_availability: (args: any) => practitionerService.checkAvailabilityForChat(args),
    book_appointment: (args: any) => practitionerService.bookAppointmentForChat(args),
  };

  // Streaming practitioner recommendations method
  async *generateStreamingPractitionerRecommendations(args: {
    query?: string;
    specialization?: string;
    location?: string;
    maxFee?: number;
    minRating?: number;
    availableDate?: string;
    consultationType?: 'in-person' | 'video' | 'phone';
    language?: string;
    limit?: number;
  }): AsyncGenerator<string, { practitioners: any[] }, unknown> {
    try {
      // First, get practitioners from the service
      const searchResult = await practitionerService.searchPractitionersForChat(args);
      
      if (!searchResult.practitioners || searchResult.practitioners.length === 0) {
        yield "I couldn't find any practitioners matching your criteria. Try adjusting your search parameters.";
        return { practitioners: [] };
      }

      // If API key is not configured, return mock streaming
      if (!this.ai) {
        yield* this.getMockStreamingPractitionerRecommendations(searchResult.practitioners, args.query || '');
        return { practitioners: searchResult.practitioners };
      }

      // Create the streaming prompt for practitioner recommendations
      const prompt = this.buildStreamingPractitionerPrompt(searchResult.practitioners, args);

      // Use streaming generation
      const response = await this.ai.models.generateContentStream({
        model: this.defaultConfig.model,
        contents: prompt,
        config: {
          systemInstruction: this.getSystemInstruction(),
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      });

      for await (const chunk of response) {
        if (chunk.text) {
          yield chunk.text;
        }
      }

      return { practitioners: searchResult.practitioners };

    } catch (error: any) {
      console.error('Error generating streaming practitioner recommendations:', error);
      
      // Fallback to basic search result
      const searchResult = await practitionerService.searchPractitionersForChat(args);
      yield `I found ${searchResult.practitioners.length} practitioners for you. Let me show you the recommendations:`;
      
      for (const practitioner of searchResult.practitioners.slice(0, 3)) {
        yield `\n\nI recommend Dr. ${practitioner.name} because of their expertise in ${practitioner.specializations[0]} with ${practitioner.experience} years of experience and a ${practitioner.rating} star rating. [SHOW_PRACTITIONER:${practitioner.id}]`;
      }
      
      return { practitioners: searchResult.practitioners };
    }
  }

  // New structured output method for alternating practitioner recommendations
  async generateAlternatingPractitionerRecommendations(args: {
    query?: string;
    specialization?: string;
    location?: string;
    maxFee?: number;
    minRating?: number;
    availableDate?: string;
    consultationType?: 'in-person' | 'video' | 'phone';
    language?: string;
    limit?: number;
  }) {
    try {
      // First, get practitioners from the service
      const searchResult = await practitionerService.searchPractitionersForChat(args);
      
      if (!searchResult.practitioners || searchResult.practitioners.length === 0) {
        return {
          recommendations: [],
          overallSummary: "I couldn't find any practitioners matching your criteria. Try adjusting your search parameters.",
          totalCount: 0,
          practitioners: []
        };
      }

      // If API key is not configured, return mock alternating recommendations
      if (!this.ai) {
        return this.getMockAlternatingRecommendations(searchResult.practitioners, args.query || '');
      }

      // Create the alternating recommendation prompt
      const prompt = this.buildAlternatingRecommendationPrompt(searchResult.practitioners, args);

      // Import the structured schema
      const { ALTERNATING_RECOMMENDATION_SCHEMA } = await import('@/types/structuredOutput');

      // Call Gemini with structured output
      const response = await this.ai.models.generateContent({
        model: this.defaultConfig.model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: ALTERNATING_RECOMMENDATION_SCHEMA,
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      });

      const structuredData = JSON.parse(response.text || '{}');
      
      return {
        structuredData,
        practitioners: searchResult.practitioners,
        overallSummary: structuredData.overallSummary,
        totalCount: searchResult.practitioners.length
      };

    } catch (error: any) {
      console.error('Error generating alternating practitioner recommendations:', error);
      
      // Fallback to mock alternating recommendations
      const searchResult = await practitionerService.searchPractitionersForChat(args);
      return this.getMockAlternatingRecommendations(searchResult.practitioners, args.query || '');
    }
  }

  // Legacy method for backward compatibility
  async generatePractitionerRecommendations(args: {
    query?: string;
    specialization?: string;
    location?: string;
    maxFee?: number;
    minRating?: number;
    availableDate?: string;
    consultationType?: 'in-person' | 'video' | 'phone';
    language?: string;
    limit?: number;
  }) {
    // Redirect to new alternating method
    return this.generateAlternatingPractitionerRecommendations(args);
  }

  private buildRecommendationPrompt(practitioners: any[], args: any): string {
    const userQuery = args.query || 'finding a suitable Ayurvedic practitioner';
    const practitionerList = practitioners.map(p => 
      `ID: ${p.id}, Name: ${p.name}, Specializations: ${p.specializations.join(', ')}, Experience: ${p.experience} years, Rating: ${p.rating}, Location: ${p.location}, Fee: $${p.consultationFee}, Languages: ${p.languages.join(', ')}`
    ).join('\n');

    return `You are an expert Ayurvedic wellness advisor. A user is looking for help with: "${userQuery}"

Here are the available practitioners:
${practitionerList}

Please analyze each practitioner and provide personalized recommendations. Consider:
- How well their specializations match the user's needs
- Their experience and rating
- Location and language preferences
- Consultation fees
- Overall suitability for the user's specific health concerns

For each practitioner, provide:
- A clear reason why they're recommended
- A match score (1-10) based on how well they fit the user's needs
- 2-3 key benefits they offer
- A personalized note explaining why they're a good fit

Also provide an overall summary of the recommendations.`;
  }

  private getMockAlternatingRecommendations(practitioners: any[], query: string) {
    const selectedPractitioners = practitioners.slice(0, 3);
    const recommendations = [];
    
    // Create alternating pattern: explanation -> practitioner-card -> explanation -> practitioner-card
    selectedPractitioners.forEach((practitioner, index) => {
      // Add explanation
      recommendations.push({
        type: 'explanation',
        explanation: `I highly recommend Dr. ${practitioner.name} for your ${query}. With ${practitioner.experience} years of specialized experience in ${practitioner.specializations[0]}, they have an excellent ${practitioner.rating}-star rating from ${practitioner.reviewCount} patients. Their expertise in ${practitioner.specializations.slice(0, 2).join(' and ')} makes them particularly well-suited for your needs.`
      });
      
      // Add practitioner card
      recommendations.push({
        type: 'practitioner-card',
        practitionerId: practitioner.id,
        recommendationReason: `Excellent match for ${query} with specialized expertise in ${practitioner.specializations[0]}`,
        keyBenefits: practitioner.specializations.slice(0, 2),
        matchScore: 9 - index
      });
    });

    return {
      structuredData: {
        recommendations,
        overallSummary: `I found ${selectedPractitioners.length} excellent practitioners who are well-suited for your needs. Each has been carefully selected based on their specializations and experience.`
      },
      practitioners: selectedPractitioners,
      overallSummary: `I found ${selectedPractitioners.length} excellent practitioners who are well-suited for your needs.`,
      totalCount: selectedPractitioners.length
    };
  }

  private buildAlternatingRecommendationPrompt(practitioners: any[], args: any): string {
    const userQuery = args.query || 'finding a suitable Ayurvedic practitioner';
    const practitionerList = practitioners.map(p => 
      `ID: ${p.id}, Name: ${p.name}, Specializations: ${p.specializations.join(', ')}, Experience: ${p.experience} years, Rating: ${p.rating}, Location: ${p.location}, Fee: ${p.consultationFee}, Languages: ${p.languages.join(', ')}`
    ).join('\n');

    return `You are an expert Ayurvedic wellness advisor. A user is looking for help with: "${userQuery}"

Here are the available practitioners:
${practitionerList}

Create an alternating sequence of explanations and practitioner cards. For each practitioner you recommend:

1. First, create an "explanation" entry with detailed reasoning why you recommend them
2. Then, create a "practitioner-card" entry with their ID and structured recommendation data

The pattern should be: explanation -> practitioner-card -> explanation -> practitioner-card

Focus on:
- How their specializations match the user's needs
- Their experience and qualifications  
- Why they're a good fit for the specific health concerns
- Their location and availability advantages
- Match score based on suitability (1-10)
- Key benefits they offer

Limit to top 3 practitioners and provide an overall summary.`;
  }

  private getMockStructuredRecommendations(practitioners: any[], query: string) {
    const mockRecommendations = practitioners.slice(0, 3).map((practitioner, index) => ({
      practitioner,
      recommendationReason: `Excellent match for ${query} with specialized expertise in ${practitioner.specializations[0]}`,
      matchScore: 9 - index,
      keyBenefits: practitioner.specializations.slice(0, 2),
      personalizedNote: `Dr. ${practitioner.name} has ${practitioner.experience} years of experience and a ${practitioner.rating} star rating, making them highly qualified for your needs.`
    }));

    return {
      recommendations: mockRecommendations,
      overallSummary: `I found ${mockRecommendations.length} excellent practitioners who are well-suited for your needs. Each has been carefully selected based on their specializations and experience.`,
      totalCount: mockRecommendations.length
    };
  }

  private buildStreamingPractitionerPrompt(practitioners: any[], args: any): string {
    const userQuery = args.query || 'finding a suitable Ayurvedic practitioner';
    const practitionerList = practitioners.map(p => 
      `ID: ${p.id}, Name: ${p.name}, Specializations: ${p.specializations.join(', ')}, Experience: ${p.experience} years, Rating: ${p.rating}, Location: ${p.location}, Fee: ${p.consultationFee}, Languages: ${p.languages.join(', ')}`
    ).join('\n');

    return `You are an expert Ayurvedic wellness advisor. A user is looking for help with: "${userQuery}"

Here are the available practitioners:
${practitionerList}

Please provide personalized recommendations for each practitioner. For each practitioner, write a detailed explanation of why you recommend them, then add the marker [SHOW_PRACTITIONER:practitioner_id] to display their card.

Format your response like this:
- Start with a brief introduction
- For each practitioner, provide a detailed explanation of why they're recommended
- Immediately after each explanation, add [SHOW_PRACTITIONER:their_id]
- Continue with the next practitioner

Focus on:
- How their specializations match the user's needs
- Their experience and qualifications
- Why they're a good fit for the specific health concerns
- Their location and availability advantages

Keep explanations conversational and helpful.`;
  }

  private async *getMockStreamingPractitionerRecommendations(practitioners: any[], query: string): AsyncGenerator<string, void, unknown> {
    const selectedPractitioners = practitioners.slice(0, 3);
    
    yield "I found some excellent Ayurvedic practitioners for you! Let me share my personalized recommendations:\n\n";
    
    await new Promise(resolve => setTimeout(resolve, 500));

    for (let i = 0; i < selectedPractitioners.length; i++) {
      const practitioner = selectedPractitioners[i];
      
      const explanation = `I highly recommend Dr. ${practitioner.name} for your ${query}. With ${practitioner.experience} years of specialized experience in ${practitioner.specializations[0]}, they have an excellent ${practitioner.rating}-star rating from ${practitioner.reviewCount} patients. Their expertise in ${practitioner.specializations.slice(0, 2).join(' and ')} makes them particularly well-suited for your needs. Located in ${practitioner.location}, they offer consultations at $${practitioner.consultationFee} and speak ${practitioner.languages.join(', ')}.`;
      
      // Stream the explanation word by word
      const words = explanation.split(' ');
      for (let j = 0; j < words.length; j++) {
        await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
        yield words.slice(0, j + 1).join(' ');
      }
      
      await new Promise(resolve => setTimeout(resolve, 300));
      yield explanation + ` [SHOW_PRACTITIONER:${practitioner.id}]`;
      
      if (i < selectedPractitioners.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
        yield explanation + ` [SHOW_PRACTITIONER:${practitioner.id}]\n\n`;
      }
    }
  }

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
- Assist with finding and booking appointments with qualified Ayurvedic practitioners
- Offer supportive and compassionate responses about health and wellness
- Use function calling to search for practitioners, check availability, and book appointments

Function Calling Guidelines:
- Use search_practitioners_with_recommendations when users ask to find doctors, practitioners, or need help with specific health concerns
- Use check_availability when users want to see available appointment slots for a specific practitioner
- Use book_appointment when users want to confirm a booking with specific details
- Always provide helpful context and explanations along with function call results

Important guidelines:
- Always emphasize that your advice is for general wellness and not a substitute for professional medical care
- Encourage users to consult with qualified Ayurvedic practitioners for personalized treatment
- Be warm, supportive, and knowledgeable about holistic wellness
- When suggesting practitioners, highlight their specializations and how they match user needs
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

  // Method for streaming messages using chat functionality
  async *sendMessageStream(message: string): AsyncGenerator<string, void, unknown> {
    if (!this.ai) {
      // Mock streaming for demo
      const mockResponse = await this.getMockResponse(message);
      const words = mockResponse.text.split(' ');

      for (let i = 0; i < words.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
        yield words.slice(0, i + 1).join(' ');
      }
      return;
    }

    try {
      if (!this.chat) {
        // Initialize chat if not already done
        this.initializeChat();
      }

      const response = await this.chat.sendMessageStream({
        message: message,
      });

      let fullText = '';
      for await (const chunk of response) {
        if (chunk.text) {
          fullText += chunk.text;
          yield fullText;
        }
      }
    } catch (error: any) {
      console.error('Gemini Chat Streaming Error:', error);
      // Fallback to regular streaming
      yield* this.generateStreamResponse(message);
    }
  }

  // Main function calling method following Gemini guide's 4-step process
  async generateResponseWithFunctionCalling(
    message: string,
    config?: Partial<GeminiConfig>
  ): Promise<GeminiResponse & { functionCalls?: FunctionCall[]; functionResults?: any[] }> {
    // Mock response when API key is not configured
    if (!this.ai) {
      return this.getMockFunctionCallingResponse(message);
    }

    try {
      const finalConfig = { ...this.defaultConfig, ...config };

      // Step 1 & 2: Call model with function declarations
      const response = await this.ai.models.generateContent({
        model: finalConfig.model,
        contents: message,
        config: {
          systemInstruction: this.getSystemInstruction(),
          temperature: finalConfig.temperature,
          maxOutputTokens: finalConfig.maxOutputTokens,
          topP: finalConfig.topP,
          topK: finalConfig.topK,
          tools: [{
            functionDeclarations: this.functionDeclarations as any
          }],
        },
      });

      // Step 3: Check for function calls and execute them
      if (response.functionCalls && response.functionCalls.length > 0) {
        const functionResults = [];
        const convertedFunctionCalls: FunctionCall[] = [];

        for (const functionCall of response.functionCalls) {
          const { name, args } = functionCall;

          if (!name || !this.toolFunctions[name as keyof typeof this.toolFunctions]) {
            console.warn(`Unknown function call: ${name}`);
            continue;
          }

          // Execute the function
          try {
            const toolResponse = await this.toolFunctions[name as keyof typeof this.toolFunctions](args || {});
            functionResults.push(toolResponse);

            // Convert to our format
            convertedFunctionCalls.push({
              name: name,
              args: args || {}
            });
          } catch (funcError: any) {
            console.error(`Error executing function ${name}:`, funcError);
            functionResults.push({
              error: `Failed to execute ${name}: ${funcError.message}`
            });
          }
        }

        // For now, return the function results without the second API call
        // This avoids the thought signature issue while still providing function calling
        return {
          text: this.generateFunctionCallSummary(convertedFunctionCalls, functionResults),
          functionCalls: convertedFunctionCalls,
          functionResults: functionResults,
        };
      } else {
        // No function calls, return regular response
        return {
          text: response.text || 'I apologize, but I couldn\'t generate a response. Please try again.',
        };
      }
    } catch (error: any) {
      console.error('Gemini Function Calling Error:', error);

      // Fallback to regular response if function calling fails
      try {
        const fallbackResponse = await this.generateResponse(message, config);
        return {
          text: fallbackResponse.text,
        };
      } catch (fallbackError) {
        const geminiError: GeminiError = {
          message: error.message || 'An unexpected error occurred',
          code: error.code,
          status: error.status,
        };
        throw geminiError;
      }
    }
  }

  private generateFunctionCallSummary(functionCalls: FunctionCall[], functionResults: any[]): string {
    if (functionCalls.length === 0) {
      return "I'm here to help you find Ayurvedic practitioners and book appointments!";
    }

    const firstCall = functionCalls[0];
    const firstResult = functionResults[0];

    switch (firstCall.name) {
      case 'search_practitioners_with_recommendations':
        if (firstResult?.recommendations?.length > 0) {
          return `${firstResult.overallSummary || `I found ${firstResult.recommendations.length} excellent Ayurvedic practitioner${firstResult.recommendations.length > 1 ? 's' : ''} with personalized recommendations for you!`} Each recommendation includes why they're a great match for your specific needs.`;
        } else {
          return "I searched for practitioners but couldn't find any matching your criteria. Try adjusting your search parameters or browse all available practitioners.";
        }

      case 'check_availability':
        if (firstResult?.availableSlots?.length > 0) {
          return `I found ${firstResult.availableSlots.length} available appointment slot${firstResult.availableSlots.length > 1 ? 's' : ''} for ${firstResult.practitioner?.name || 'the practitioner'}. You can select a time that works best for you.`;
        } else {
          return `Unfortunately, ${firstResult.practitioner?.name || 'the practitioner'} doesn't have any available slots for your requested criteria. Try checking different dates or consultation types.`;
        }

      case 'book_appointment':
        if (firstResult?.success) {
          return `Great news! Your appointment has been successfully booked. ${firstResult.message || ''} You should receive a confirmation shortly.`;
        } else {
          return `I encountered an issue while booking your appointment: ${firstResult.message || 'Please try again or contact support.'}`;
        }

      default:
        return "I've processed your request and found some information for you!";
    }
  }

  // Compositional function calling for complex multi-step requests
  async generateResponseWithComposition(
    message: string,
    config?: Partial<GeminiConfig>
  ): Promise<GeminiResponse & { functionCalls?: FunctionCall[]; functionResults?: any[] }> {
    if (!this.ai) {
      return this.getMockFunctionCallingResponse(message);
    }

    try {
      const finalConfig = { ...this.defaultConfig, ...config };
      const allFunctionCalls: FunctionCall[] = [];
      const allFunctionResults: any[] = [];

      let contents = [
        {
          role: 'user' as const,
          parts: [{ text: message }]
        }
      ];

      // Loop until no more function calls are needed (compositional calling)
      while (true) {
        const result = await this.ai.models.generateContent({
          model: finalConfig.model,
          contents,
          config: {
            systemInstruction: this.getSystemInstruction(),
            temperature: finalConfig.temperature,
            maxOutputTokens: finalConfig.maxOutputTokens,
            tools: [{
              functionDeclarations: this.functionDeclarations
            }],
          },
        });

        if (result.functionCalls && result.functionCalls.length > 0) {
          const functionCall = result.functionCalls[0]; // Handle one at a time for composition
          const { name, args } = functionCall;

          if (!this.toolFunctions[name as keyof typeof this.toolFunctions]) {
            throw new Error(`Unknown function call: ${name}`);
          }

          // Execute the function
          const toolResponse = await this.toolFunctions[name as keyof typeof this.toolFunctions](args);

          allFunctionCalls.push(functionCall);
          allFunctionResults.push(toolResponse);

          const functionResponsePart = {
            name: functionCall.name,
            response: {
              result: toolResponse,
            },
          };

          // Add to conversation history
          contents.push({
            role: 'model' as const,
            parts: [{ functionCall: functionCall }],
          });
          contents.push({
            role: 'user' as const,
            parts: [{ functionResponse: functionResponsePart }],
          });
        } else {
          // No more function calls, return final response
          return {
            text: result.text || 'Here\'s what I found for you!',
            functionCalls: allFunctionCalls,
            functionResults: allFunctionResults,
          };
        }
      }
    } catch (error: any) {
      console.error('Gemini Compositional Function Calling Error:', error);
      throw new Error(error.message || 'Compositional function calling failed');
    }
  }

  private getMockFunctionCallingResponse(message: string): Promise<GeminiResponse & { functionCalls?: FunctionCall[]; functionResults?: any[] }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate function calling for practitioner search
        if (message.toLowerCase().includes('find') || message.toLowerCase().includes('doctor') || message.toLowerCase().includes('practitioner')) {
          const mockFunctionCall: FunctionCall = {
            name: 'search_practitioners_with_recommendations',
            args: { limit: 3 }
          };

          const mockResult = {
            recommendations: [
              {
                practitioner: {
                  id: '1',
                  name: 'Dr. Priya Sharma',
                  title: 'Senior Ayurvedic Physician',
                  specializations: ['Panchakarma', 'Women\'s Health'],
                  rating: 4.8,
                  consultationFee: 150,
                  location: 'Mumbai, India',
                  experience: 15,
                  reviewCount: 127,
                  languages: ['English', 'Hindi'],
                  availableSlots: []
                },
                recommendationReason: 'Excellent match for your wellness needs with specialized expertise in Panchakarma',
                matchScore: 9,
                keyBenefits: ['Panchakarma', 'Women\'s Health'],
                personalizedNote: 'Dr. Priya Sharma has 15 years of experience and a 4.8 star rating, making her highly qualified for your needs.'
              }
            ],
            overallSummary: 'Found 1 excellent practitioner with personalized recommendations for your needs',
            totalCount: 1
          };

          resolve({
            text: `I found some excellent Ayurvedic practitioners for you! Here are the top matches based on your requirements.\n\n*Note: This is a demo response. Configure your Gemini API key for full functionality.*`,
            functionCalls: [mockFunctionCall],
            functionResults: [mockResult],
          });
        } else {
          resolve({
            text: `I'm here to help you with Ayurvedic wellness and finding practitioners. Try asking me to "find a doctor" or "search for practitioners" to see the function calling in action!\n\n*Note: This is a demo response. Configure your Gemini API key for full functionality.*`,
          });
        }
      }, 1500);
    });
  }

  // Initialize or get existing chat instance
  initializeChat(history?: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }>): void {
    if (!this.ai) return;

    try {
      const finalConfig = { ...this.defaultConfig };
      
      this.chat = this.ai.chats.create({
        model: finalConfig.model,
        history: history || [],
        config: {
          systemInstruction: this.getSystemInstruction(),
          temperature: finalConfig.temperature,
          maxOutputTokens: finalConfig.maxOutputTokens,
        },
      });
    } catch (error: any) {
      console.error('Chat initialization error:', error);
      this.chat = null;
    }
  }



  // Send regular message using native chat API
  async sendMessage(message: string): Promise<GeminiResponse> {
    // Mock response when API key is not configured
    if (!this.ai || !this.chat) {
      return this.getMockResponse(message);
    }

    try {
      const response = await this.chat.sendMessage({
        message: message,
      });

      return {
        text: response.text || 'I apologize, but I couldn\'t generate a response. Please try again.',
      };
    } catch (error: any) {
      console.error('Chat message error:', error);
      throw new Error(error.message || 'Chat message failed');
    }
  }

  // Reset chat instance
  resetChat(): void {
    this.chat = null;
  }

  // Get chat history (if needed for debugging)
  getChatHistory(): any {
    return this.chat?.history || [];
  }
}

export const geminiService = new GeminiService();
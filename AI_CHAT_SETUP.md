# AI Chat Feature Setup Guide

## Overview
This guide will help you set up the AI Chat feature in your Tangerine app, powered by Google's Gemini AI.

## Prerequisites
- Expo development environment set up
- Google AI Studio account for Gemini API access

## Setup Instructions

### 1. Get Your Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Configure Environment Variables
1. Open the `.env` file in your project root
2. Replace `your_gemini_api_key_here` with your actual API key:
   ```
   EXPO_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here
   ```

### 3. Install Dependencies
Run the following command to install the new dependencies:
```bash
npm install
```

### 4. Start the Development Server
```bash
npm run dev
```

## Features Implemented

### ✅ Core Features
- **AI Chat Interface**: Natural conversation with Gemini AI
- **Ayurvedic Context**: AI assistant specialized in wellness guidance
- **Message History**: Persistent chat sessions with secure storage
- **Real-time Typing**: Typing indicators and smooth UX
- **Error Handling**: Graceful error handling with user feedback
- **Demo Mode**: Works without API key for testing UI

### ✅ UI Components
- **Chat Bubbles**: Styled message bubbles for user/AI messages
- **Chat Input**: Multi-line input with send button
- **Typing Indicator**: Animated dots showing AI is thinking
- **Empty State**: Welcoming introduction with usage hints
- **Navigation Tab**: New "AI Chat" tab in bottom navigation

### ✅ Technical Features
- **Secure Storage**: Messages stored securely on device
- **State Management**: React hooks for chat state
- **Service Layer**: Modular architecture with separate services
- **TypeScript**: Full type safety throughout
- **Error Boundaries**: Comprehensive error handling

## Usage

### Starting a Conversation
1. Open the app and tap the "AI Chat" tab
2. You'll see a welcome message with suggested topics
3. Type your message and tap the send button
4. The AI will respond with helpful, contextual information

### What You Can Ask
- **Ayurvedic Principles**: "What are the three doshas?"
- **Wellness Guidance**: "How can I improve my sleep naturally?"
- **App Features**: "How do I book an appointment?"
- **General Health**: "What foods are good for digestion?"

## Demo Mode
If you haven't configured your API key yet, the app will run in demo mode:
- Shows realistic mock responses
- Demonstrates the full UI experience
- Includes typing animations and delays
- Perfect for testing the interface

## Troubleshooting

### Common Issues

**"API key not configured" warning**
- Make sure you've set `EXPO_PUBLIC_GEMINI_API_KEY` in your `.env` file
- Restart the development server after adding the API key

**Chat not loading**
- Check your internet connection
- Verify your API key is valid
- Look for error messages in the console

**Messages not persisting**
- Ensure `expo-secure-store` is properly installed
- Check device storage permissions

### Getting Help
- Check the console for detailed error messages
- Verify your Gemini API key has proper permissions
- Ensure all dependencies are installed correctly

## Architecture

### File Structure
```
├── services/
│   ├── geminiService.ts     # Gemini AI integration
│   └── chatService.ts       # Chat management logic
├── hooks/
│   └── useChat.ts          # Chat state management
├── components/chat/
│   ├── ChatBubble.tsx      # Message bubble component
│   ├── ChatInput.tsx       # Input component
│   ├── ChatMessage.tsx     # Message wrapper
│   └── TypingIndicator.tsx # Typing animation
├── types/
│   ├── chat.ts             # Chat type definitions
│   └── gemini.ts           # AI response types
└── app/(tabs)/
    └── chat.tsx            # Main chat screen
```

### Key Services
- **GeminiService**: Handles all AI API interactions
- **ChatService**: Manages chat sessions and message storage
- **StorageUtils**: Secure local storage for chat history

## Customization

### Modifying AI Behavior
Edit the system instruction in `services/geminiService.ts`:
```typescript
private getSystemInstruction(): string {
  return `Your custom AI personality and instructions here...`;
}
```

### Styling
All styles are in component files using StyleSheet. Key colors:
- Primary: `#FF8C42` (Tangerine orange)
- Secondary: `#87A96B` (Wellness green)
- Background: `#F8F9FA` (Light gray)

### Adding Features
- **Streaming**: Change `streaming: false` to `true` in chat screen
- **Voice Input**: Add speech-to-text integration
- **Image Support**: Extend Gemini service for multimodal inputs

## Security Notes
- API keys are stored in environment variables
- Chat history is encrypted with expo-secure-store
- No sensitive data is sent to external services
- All API calls are made securely over HTTPS

## Next Steps
1. Configure your API key for full functionality
2. Test the chat interface thoroughly
3. Customize the AI personality for your brand
4. Consider adding advanced features like voice or image support

Happy chatting! 🤖✨
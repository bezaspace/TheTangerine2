// Simple test to verify Gemini streaming implementation
import { geminiService } from './services/geminiService.js';

async function testStreaming() {
  console.log('Testing Gemini streaming...');
  
  try {
    // Initialize chat
    geminiService.initializeChat();
    
    // Test streaming
    const streamGenerator = geminiService.sendMessageStream('Hello, how are you?');
    
    for await (const chunk of streamGenerator) {
      console.log('Chunk:', chunk);
    }
    
    console.log('Streaming test completed!');
  } catch (error) {
    console.error('Streaming test failed:', error);
  }
}

testStreaming();
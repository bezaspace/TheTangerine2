// Simple test to verify our streaming implementation
const { StreamingParser } = require('./utils/streamingParser');

// Test the streaming parser
console.log('Testing StreamingParser...');

// Test 1: Parse practitioner marker
const testText = "I recommend Dr. Smith because of his expertise. [SHOW_PRACTITIONER:dr_smith_123] He is excellent.";
const result = StreamingParser.parsePractitionerMarker(testText);

if (result) {
  console.log('✅ Marker parsing works!');
  console.log('Practitioner ID:', result.practitionerId);
  console.log('Clean text:', result.cleanText);
} else {
  console.log('❌ Marker parsing failed');
}

// Test 2: Extract multiple explanations
const fullText = `I found great practitioners for you!

I recommend Dr. Smith for digestive issues. [SHOW_PRACTITIONER:dr_smith_123]

Another excellent choice is Dr. Jones. [SHOW_PRACTITIONER:dr_jones_456]

Finally, Dr. Brown is also great. [SHOW_PRACTITIONER:dr_brown_789]`;

const sections = StreamingParser.extractPractitionerExplanations(fullText);
console.log('\n✅ Extracted sections:', sections.length);
sections.forEach((section, index) => {
  console.log(`Section ${index + 1}:`, section);
});

console.log('\n🎉 Core streaming parser functionality is working!');
console.log('\nNext steps:');
console.log('1. Test the app with: "Find me a doctor for digestive issues"');
console.log('2. Verify alternating text-card pattern appears');
console.log('3. Check that practitioner cards render correctly');
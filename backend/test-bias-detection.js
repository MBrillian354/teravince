/**
 * Test file for DeepSeek bias detection
 * Run this to test the new bias detection implementation
 */

const axios = require('axios');

// Test data
const testReviews = [
  {
    name: "Professional Review (No Bias)",
    review: "The task was completed on time with good attention to detail. The quality of work meets expectations and the documentation provided is comprehensive.",
    context: "task"
  },
  {
    name: "Biased Review (Gender)",
    review: "She did okay but women usually struggle with technical tasks like this. Maybe she should focus on more suitable roles.",
    context: "task"
  },
  {
    name: "Biased Review (Age)",
    review: "For someone his age, this is acceptable work, though younger employees would probably do it faster and better.",
    context: "report"
  },
  {
    name: "Professional Indonesian Review",
    review: "Pekerjaan diselesaikan dengan baik sesuai standar yang ditetapkan. Dokumentasi lengkap dan tepat waktu.",
    context: "task"
  },
  {
    name: "Biased Indonesian Review",
    review: "Lumayan bagus untuk orang seperti dia. Tapi mungkin karena backgroundnya jadi agak lambat mengerti.",
    context: "report"
  }
];

async function testBiasDetection() {
  const baseURL = 'http://localhost:5000';
  
  // You'll need to get a valid JWT token from login
  const authToken = 'YOUR_JWT_TOKEN_HERE'; // Replace with actual token
  
  console.log('🧪 Testing DeepSeek Bias Detection\n');
  console.log('=' * 50);
  
  for (const test of testReviews) {
    console.log(`\n📝 Test: ${test.name}`);
    console.log(`Review: "${test.review}"`);
    console.log(`Context: ${test.context}`);
    
    try {
      const response = await axios.post(
        `${baseURL}/api/bias/test`,
        {
          review_text: test.review,
          context: test.context
        },
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const result = response.data.result;
      console.log(`\n✅ Result:`);
      console.log(`   Bias Detected: ${result.is_bias ? '🚨 YES' : '✅ NO'}`);
      console.log(`   Bias Type: ${result.bias_label}`);
      console.log(`   Reason: ${result.bias_reason}`);
      
    } catch (error) {
      console.log(`\n❌ Error:`, error.response?.data || error.message);
    }
    
    console.log('\n' + '-'.repeat(50));
  }
}

// Instructions for running
console.log(`
📋 Instructions to test:

1. Start your backend server: npm run dev
2. Login to get a JWT token from /api/auth/login
3. Replace 'YOUR_JWT_TOKEN_HERE' in this file with your actual token
4. Run: node test-bias-detection.js

Example login request:
POST http://localhost:5000/api/auth/login
{
  "email": "your-email@example.com",
  "password": "your-password"
}

Copy the 'token' from the response and use it above.
`);

// Uncomment the next line after setting up your JWT token
// testBiasDetection();

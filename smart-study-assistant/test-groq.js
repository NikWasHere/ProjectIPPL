const axios = require('axios');
require('dotenv').config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const MODEL = 'llama3-70b-8192';
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

console.log('🧪 Testing Groq Llama 3 70B...\n');
console.log(`🔑 API Key: ${GROQ_API_KEY ? GROQ_API_KEY.substring(0, 10) + '...' : 'NOT SET'}`);
console.log(`🚀 Model: ${MODEL}\n`);

if (!GROQ_API_KEY || GROQ_API_KEY.includes('your-groq-api-key')) {
  console.error('❌ GROQ_API_KEY not configured in .env');
  console.log('\n📝 Setup Instructions:');
  console.log('1. Go to: https://console.groq.com/keys');
  console.log('2. Sign up (FREE, no credit card)');
  console.log('3. Create API Key');
  console.log('4. Add to .env: GROQ_API_KEY=gsk_your_key_here');
  console.log('5. Restart server\n');
  process.exit(1);
}

async function testGroq() {
  try {
    console.log('📡 Sending request to Groq...');
    
    const prompt = `Buatlah 2 soal pilihan ganda tentang Artificial Intelligence dalam bahasa Indonesia.

OUTPUT HARUS JSON VALID (tanpa markdown):
{
  "questions": [
    {
      "question": "Pertanyaan?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A",
      "type": "multiple_choice"
    }
  ]
}

Jawab HANYA dengan JSON.`;

    const response = await axios.post(
      API_URL,
      {
        model: MODEL,
        messages: [
          {
            role: "system",
            content: "Anda adalah asisten AI ahli membuat soal ujian dalam bahasa Indonesia."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        stream: false
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000
      }
    );

    const result = response.data?.choices?.[0]?.message?.content;
    
    if (!result) {
      throw new Error('No response from Groq');
    }

    console.log('✅ SUCCESS! Groq Llama 3 70B working!\n');
    console.log('📝 Response:');
    console.log('─'.repeat(60));
    console.log(result);
    console.log('─'.repeat(60));
    console.log('\n🎉 Groq LLM siap digunakan untuk generate soal dan summary!');
    console.log('💡 Model: Llama 3 70B (FREE, UNLIMITED, SUPER FAST!)');
    console.log('🌐 Dashboard: https://console.groq.com/\n');
    
  } catch (error) {
    console.error('\n❌ ERROR:\n');
    
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Message: ${error.response.data?.error?.message || 'Unknown error'}`);
      
      if (error.response.status === 401) {
        console.log('\n💡 Invalid API key.');
        console.log('   Generate new key: https://console.groq.com/keys');
      } else if (error.response.status === 429) {
        console.log('\n💡 Rate limit exceeded.');
        console.log('   Wait 1 minute and try again.');
      }
    } else {
      console.error(error.message);
    }
    
    process.exit(1);
  }
}

testGroq();

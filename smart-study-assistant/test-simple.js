const axios = require('axios');

console.log('🧪 Simple Qwen2 Test\n');

async function testQwen2Simple() {
  try {
    console.log('📡 Calling Qwen2...');
    
    const response = await axios.post(
      'http://localhost:11434/api/generate',
      {
        model: 'qwen2:7b',
        prompt: 'Buatkan 2 soal pilihan ganda tentang AI dalam bahasa Indonesia. Format JSON: {"questions": [{"question": "...", "options": ["A", "B", "C", "D"], "correctAnswer": "A", "type": "multiple_choice"}]}',
        stream: false,
        format: 'json'
      },
      {
        timeout: 120000
      }
    );

    console.log('✅ Response received!\n');
    console.log('Raw response:');
    console.log(JSON.stringify(response.data, null, 2));
    
    if (response.data.response) {
      console.log('\n📝 Generated content:');
      console.log(response.data.response);
      
      try {
        const parsed = JSON.parse(response.data.response);
        console.log('\n✅ Valid JSON!');
        console.log(`Questions: ${parsed.questions?.length || 0}`);
      } catch (e) {
        console.log('\n⚠️  Not valid JSON');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.log('Response data:', error.response.data);
    }
  }
}

testQwen2Simple();

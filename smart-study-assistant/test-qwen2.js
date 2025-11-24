const axios = require('axios');

console.log('🧪 Testing Qwen2 7B Local via Ollama...\n');

async function testQwen2Local() {
  try {
    console.log('📡 Sending request to Ollama (localhost:11434)...');
    
    const prompt = `Buatlah 2 soal pilihan ganda tentang Artificial Intelligence dalam bahasa Indonesia.

Format JSON yang diinginkan:
{
  "questions": [
    {
      "question": "Pertanyaan?",
      "options": ["Opsi A", "Opsi B", "Opsi C", "Opsi D"],
      "correctAnswer": "Opsi A",
      "explanation": "Penjelasan...",
      "type": "multiple_choice"
    }
  ]
}

Jawab HANYA dengan JSON yang valid.`;

    const response = await axios.post(
      'http://localhost:11434/api/generate',
      {
        model: 'qwen2:7b',
        prompt: prompt,
        stream: false,
        format: 'json',
        options: {
          temperature: 0.7,
          top_p: 0.95
        }
      },
      {
        timeout: 120000
      }
    );

    const result = response.data.response;

    console.log('✅ SUCCESS! Qwen2 7B Local working!\n');
    console.log('📝 Response:');
    console.log('─'.repeat(60));
    console.log(result);
    console.log('─'.repeat(60));
    
    // Try to parse as JSON
    try {
      const parsed = JSON.parse(result);
      console.log('\n✅ Valid JSON Response!');
      console.log(`📊 Generated ${parsed.questions?.length || 0} questions`);
    } catch (e) {
      console.log('\n⚠️  Response is not valid JSON, but generation works!');
    }
    
    console.log('\n🎉 Qwen2 7B Local siap digunakan untuk generate soal dan summary!\n');
    
  } catch (error) {
    console.error('\n❌ ERROR:\n');
    
    if (error.code === 'ECONNREFUSED') {
      console.error('Cannot connect to Ollama server.');
      console.log('\n💡 Pastikan Ollama server running:');
      console.log('   Run: ollama serve');
      console.log('   Or: & "$env:LOCALAPPDATA\\Programs\\Ollama\\ollama.exe" serve');
    } else if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Message: ${error.response.data?.error || 'Unknown error'}`);
    } else {
      console.error(error.message);
    }
    
    process.exit(1);
  }
}

testQwen2Local();

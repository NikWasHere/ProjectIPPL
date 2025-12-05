const axios = require('axios');

console.log('🧪 Testing Qwen2 7B Local - Quiz & Summary Generation\n');
console.log('='.repeat(60));

// Sample text for testing
const sampleText = `
Artificial Intelligence (AI) adalah bidang ilmu komputer yang berfokus pada pembuatan sistem yang dapat melakukan tugas-tugas yang biasanya memerlukan kecerdasan manusia. AI mencakup berbagai teknologi seperti machine learning, deep learning, natural language processing, dan computer vision.

Machine learning adalah subset dari AI yang memungkinkan sistem untuk belajar dari data tanpa diprogram secara eksplisit. Deep learning adalah teknik machine learning yang menggunakan neural networks dengan banyak layer untuk memproses data kompleks.

Aplikasi AI sangat luas, mulai dari asisten virtual, rekomendasi produk, deteksi fraud, hingga kendaraan otonom. AI telah mengubah berbagai industri seperti kesehatan, keuangan, transportasi, dan pendidikan.

Namun, pengembangan AI juga menimbulkan tantangan etis seperti privasi data, bias algoritma, dan dampak terhadap pekerjaan manusia. Penting bagi kita untuk mengembangkan AI secara bertanggung jawab.
`;

// Test 1: Generate Multiple Choice Quiz
async function testQuizGeneration() {
  console.log('\n📝 TEST 1: Generate Multiple Choice Quiz\n');
  
  try {
    const prompt = `Berdasarkan teks berikut, buatlah 3 soal pilihan ganda dalam bahasa Indonesia:

TEKS:
${sampleText}

OUTPUT dalam format JSON:
{
  "questions": [
    {
      "question": "Pertanyaan?",
      "options": ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"],
      "correctAnswer": "Pilihan A",
      "type": "multiple_choice"
    }
  ]
}

Jawab HANYA dengan JSON valid.`;

    const response = await axios.post(
      'http://localhost:11434/api/generate',
      {
        model: 'qwen2:7b',
        prompt: prompt,
        stream: false,
        format: 'json',
        options: {
          temperature: 0.7,
          top_p: 0.95,
          num_predict: 2000
        }
      },
      {
        timeout: 120000
      }
    );

    const result = response.data.response;
    console.log('✅ Quiz Generation Success!');
    console.log('─'.repeat(60));
    
    try {
      const parsed = JSON.parse(result);
      console.log(JSON.stringify(parsed, null, 2));
      console.log('─'.repeat(60));
      console.log(`\n✅ Generated ${parsed.questions?.length || 0} multiple choice questions`);
      return true;
    } catch (parseError) {
      console.log('Raw response:', result);
      console.log('\n⚠️  Response is not valid JSON');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Quiz Generation Failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Ollama server not running. Run: ollama serve');
    }
    return false;
  }
}

// Test 2: Generate Summary
async function testSummaryGeneration() {
  console.log('\n📋 TEST 2: Generate Summary\n');
  
  try {
    const prompt = `Buatkan ringkasan dari teks berikut dalam bahasa Indonesia:

TEKS:
${sampleText}

OUTPUT dalam format JSON:
{
  "summary": "Ringkasan dalam 2-3 paragraf...",
  "keyPoints": [
    "Poin kunci 1",
    "Poin kunci 2",
    "Poin kunci 3"
  ]
}

Jawab HANYA dengan JSON valid.`;

    const response = await axios.post(
      'http://localhost:11434/api/generate',
      {
        model: 'qwen2:7b',
        prompt: prompt,
        stream: false,
        format: 'json',
        options: {
          temperature: 0.7,
          top_p: 0.95,
          num_predict: 2000
        }
      },
      {
        timeout: 120000
      }
    );

    const result = response.data.response;
    console.log('✅ Summary Generation Success!');
    console.log('─'.repeat(60));
    
    try {
      const parsed = JSON.parse(result);
      console.log(JSON.stringify(parsed, null, 2));
      console.log('─'.repeat(60));
      console.log(`\n✅ Summary: ${parsed.summary?.substring(0, 100)}...`);
      console.log(`✅ Key Points: ${parsed.keyPoints?.length || 0} items`);
      return true;
    } catch (parseError) {
      console.log('Raw response:', result);
      console.log('\n⚠️  Response is not valid JSON');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Summary Generation Failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Ollama server not running. Run: ollama serve');
    }
    return false;
  }
}

// Test 3: Generate Essay Quiz
async function testEssayQuizGeneration() {
  console.log('\n✍️  TEST 3: Generate Essay Quiz\n');
  
  try {
    const prompt = `Berdasarkan teks berikut, buatlah 2 soal essay dalam bahasa Indonesia:

TEKS:
${sampleText}

OUTPUT dalam format JSON:
{
  "questions": [
    {
      "question": "Pertanyaan essay?",
      "correctAnswer": "Panduan jawaban lengkap",
      "type": "essay"
    }
  ]
}

Jawab HANYA dengan JSON valid.`;

    const response = await axios.post(
      'http://localhost:11434/api/generate',
      {
        model: 'qwen2:7b',
        prompt: prompt,
        stream: false,
        format: 'json',
        options: {
          temperature: 0.7,
          top_p: 0.95,
          num_predict: 2000
        }
      },
      {
        timeout: 120000
      }
    );

    const result = response.data.response;
    console.log('✅ Essay Quiz Generation Success!');
    console.log('─'.repeat(60));
    
    try {
      const parsed = JSON.parse(result);
      console.log(JSON.stringify(parsed, null, 2));
      console.log('─'.repeat(60));
      console.log(`\n✅ Generated ${parsed.questions?.length || 0} essay questions`);
      return true;
    } catch (parseError) {
      console.log('Raw response:', result);
      console.log('\n⚠️  Response is not valid JSON');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Essay Quiz Generation Failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Ollama server not running. Run: ollama serve');
    }
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('\n🚀 Starting Qwen2 Full Test Suite...\n');
  
  const results = {
    quiz: await testQuizGeneration(),
    summary: await testSummaryGeneration(),
    essay: await testEssayQuizGeneration()
  };
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST RESULTS');
  console.log('='.repeat(60));
  console.log(`Multiple Choice Quiz: ${results.quiz ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Summary Generation:   ${results.summary ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Essay Quiz:           ${results.essay ? '✅ PASS' : '❌ FAIL'}`);
  console.log('='.repeat(60));
  
  const allPassed = results.quiz && results.summary && results.essay;
  if (allPassed) {
    console.log('\n🎉 ALL TESTS PASSED! Qwen2 7B Local is working perfectly!\n');
  } else {
    console.log('\n⚠️  Some tests failed. Check the output above for details.\n');
  }
}

runAllTests();

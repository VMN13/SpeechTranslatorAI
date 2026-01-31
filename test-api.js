import axios from 'axios';

async function testAPI() {
  console.log('Testing backend API...\n');

  // Test 1: Health Check
  try {
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:3001/api/health');
    console.log('✅ Health check passed:', healthResponse.data);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
  }

  // Test 2: Translation with English input
  try {
    console.log('\n2. Testing translation with English input...');
    const translateResponse = await axios.post('http://localhost:3001/api/translate', {
      text: 'Hello, how are you?',
      sourceLang: 'en-US'
    });
    console.log('✅ Translation successful:');
    console.log('   English:', translateResponse.data.translations.en);
    console.log('   Russian:', translateResponse.data.translations.ru);
  } catch (error) {
    console.log('❌ Translation failed:', error.response?.data || error.message);
  }

  // Test 3: Translation with Russian input
  try {
    console.log('\n3. Testing translation with Russian input...');
    const translateResponse = await axios.post('http://localhost:3001/api/translate', {
      text: 'Привет, как дела?',
      sourceLang: 'ru-RU'
    });
    console.log('✅ Translation successful:');
    console.log('   English:', translateResponse.data.translations.en);
    console.log('   Russian:', translateResponse.data.translations.ru);
  } catch (error) {
    console.log('❌ Translation failed:', error.response?.data || error.message);
  }

  console.log('\n✅ API testing complete!');
}

testAPI();

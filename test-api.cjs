const fs = require('fs');
const envFile = fs.readFileSync('.env.local', 'utf8');
const keyMatch = envFile.match(/VITE_GEMINI_API_KEY=(.*)/);
const key = keyMatch ? keyMatch[1].trim() : null;

const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${key}`;

fetch(endpoint, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{ parts: [{ text: 'Hello, respond with EXACTLY "WORKING"' }] }]
  })
})
.then(res => res.json())
.then(data => {
  if (data.error) {
    console.error('API Error:', data.error.message);
  } else {
    console.log('API Response:', data.candidates[0].content.parts[0].text);
  }
})
.catch(err => {
  console.error('Fetch error:', err);
});

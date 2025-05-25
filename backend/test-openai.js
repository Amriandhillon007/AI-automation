require('dotenv').config();  // loads .env variables

const axios = require('axios');

async function testOpenAI() {
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Say hello!" }],
      max_tokens: 10,
    }, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    console.log("✅ OpenAI response:", response.data.choices[0].message.content);
  } catch (error) {
    if (error.response) {
      console.error("❌ OpenAI API error:");
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else {
      console.error("❌ Error:", error.message);
    }
  }
}

testOpenAI();

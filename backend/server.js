require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection (your existing code)
mongoose.connect(process.env.MONGODB_URI).then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Error:', err));

const contentSchema = new mongoose.Schema({
  prompt: String,
  response: String,
  date: { type: Date, default: Date.now }
});
const Content = mongoose.model('Content', contentSchema);

app.get('/', (req, res) => res.send('✅ API Running'));

app.post('/test', (req, res) => res.send('✅ Test Successful'));

app.post('/generate-content', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || prompt.trim() === '') {
    return res.status(400).json({ error: '❌ Prompt is required.' });
  }

  try {
    // Call OpenAI API
    const openaiResponse = await axios({
      method: 'post',
      url: 'https://api.openai.com/v1/chat/completions',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      data: {
        model: 'gpt-4o-mini',  // Or use 'gpt-4', 'gpt-3.5-turbo', etc.
        messages: [
          { role: 'user', content: prompt }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }
    });

    // Extract the generated content
    const fullContent = openaiResponse.data.choices[0].message.content;

    console.log('Full content received:', fullContent);

    // Save prompt and response in MongoDB
    const newContent = new Content({ prompt, response: fullContent });
    await newContent.save();

    res.json({ content: fullContent });

  } catch (err) {
    console.error('❌ Error talking to OpenAI API:', err.response?.data || err.message);
    res.status(500).json({ error: '❌ Failed to generate content from OpenAI.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

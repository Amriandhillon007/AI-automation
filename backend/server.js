require('dotenv').config(); // Load .env file


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Mongoose Schema
const contentSchema = new mongoose.Schema({
  prompt: String,
  response: String,
  date: { type: Date, default: Date.now }
});
const Content = mongoose.model('Content', contentSchema);

// ✅ Test Route
app.get('/', (req, res) => {
  res.send('Hello, welcome to the backend!');
});

// ✅ AI Content Generation Endpoint
app.post('/test', (req, res) => {
  res.send('✅ Test route working!');
});
app.post('/generate-content', async (req, res) => {
  console.log("🛠️ /generate-content route hit!");
  const { prompt } = req.body;

  try {
    const response = await axios.post('https://api.openai.com/v1/completions', {
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 150
    }, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}` ,
          'Content-Type': 'application/json',
      },
    });

    const aiContent = response.data.choices[0].text;

    // Save to MongoDB
    const newContent = new Content({ prompt, response: aiContent });
    await newContent.save();

    res.json({ content: aiContent });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating content');
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

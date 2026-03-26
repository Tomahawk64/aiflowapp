const express = require('express');
const router = express.Router();
const axios = require('axios');
const FlowEntry = require('../models/FlowEntry');

// POST /api/ask-ai
// Sends prompt to Groq (free tier) and returns AI reply
router.post('/ask-ai', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  try {
    console.log('📤 Sending prompt to Groq:', prompt.slice(0, 80));

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    console.log('📥 Groq reply received:', reply.slice(0, 100));

    res.json({ reply });
  } catch (error) {
    console.error('❌ Groq API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get AI response. Check your API key.' });
  }
});

// POST /api/save
// Saves prompt + response to MongoDB
router.post('/save', async (req, res) => {
  const { prompt, response } = req.body;

  if (!prompt || !response) {
    return res.status(400).json({ error: 'Both prompt and response are required.' });
  }

  try {
    const entry = new FlowEntry({ prompt, response });
    await entry.save();
    console.log('💾 Flow entry saved to MongoDB');
    res.json({ message: 'Saved successfully!' });
  } catch (error) {
    console.error('❌ MongoDB save error:', error.message);
    res.status(500).json({ error: 'Failed to save data.' });
  }
});

module.exports = router;

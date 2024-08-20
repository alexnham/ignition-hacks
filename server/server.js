const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const axios = require('axios'); // Correct import for axios
const { OpenAI } = require('openai');

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all origins
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());


app.post('/symptoms', async (req, res) => {
    const { prompt } = req.body;
    console.log(prompt);
  
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
  
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o', // Correct model identifier
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      });
  
      // Access the first choice's message content
      const messageContent = response.choices[0].message.content;
  
      // Parse the message content to extract symptoms
      const symptoms = extractSymptoms(messageContent);
  
      res.status(200).json({ symptoms }); // Return as JSON object
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      res.status(error.response ? error.response.status : 500).json({ error: error.message });
    }
  });
  
  // Function to extract symptoms from the model's response
  function extractSymptoms(text) {
    // Example extraction logic
    // This assumes symptoms are listed as bullet points or newline-separated
    return text.split('\n').filter(line => line.trim() !== '');
  }

app.post('/openai', async (req, res) => {
  const { prompt } = req.body;
  console.log(prompt);

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // Correct model identifier
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7
    });

    // Access the first choice's message content
    const messageContent = response.choices[0].message.content;

    res.status(200).json({ message: messageContent }); // Return as JSON object
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    res.status(error.response ? error.response.status : 500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

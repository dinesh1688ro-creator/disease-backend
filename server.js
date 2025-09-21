// server.js
require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch'); // if Node 18+, you can remove and use global fetch
const bodyParser = require('body-parser');
const cors = require('cors');

const HF_API_KEY = process.env.HF_API_KEY;
if (!HF_API_KEY) {
  console.error("❌ Please set HF_API_KEY in .env");
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(bodyParser.json());

const HF_BASE = 'https://api-inference.huggingface.co/models';

// Call Hugging Face API
async function callHFModel(model, payload) {
  const res = await fetch(`${HF_BASE}/${model}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${HF_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`HF API ${res.status}: ${txt}`);
  }
  return res.json();
}

// Translation endpoint
app.post('/api/translate', async (req, res) => {
  try {
    const { text, source, target } = req.body;
    const model = `Helsinki-NLP/opus-mt-${source}-${target}`;
    const payload = { inputs: text };
    const out = await callHFModel(model, payload);

    let translated;
    if (Array.isArray(out) && out[0]?.translation_text) {
      translated = out[0].translation_text;
    } else if (out.translation_text) {
      translated = out.translation_text;
    } else if (out.generated_text) {
      translated = out.generated_text;
    } else {
      translated = JSON.stringify(out);
    }

    res.json({ translated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err) });
  }
});

// Generate endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, model = 'google/flan-t5-large', max_new_tokens = 256 } = req.body;
    const payload = { inputs: prompt, parameters: { max_new_tokens } };
    const out = await callHFModel(model, payload);

    let text = '';
    if (Array.isArray(out) && out[0]?.generated_text) text = out[0].generated_text;
    else if (out.generated_text) text = out.generated_text;
    else text = JSON.stringify(out);

    res.json({ text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err) });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

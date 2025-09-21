// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // allow all frontend domains
app.use(express.json());

// Root route
app.get('/', (req, res) => {
    res.send('<h1>AI Chatbot Backend is Running!</h1><p>Use /getAnswer for API calls.</p>');
});

// AI API route
app.post('/getAnswer', (req, res) => {
    const { question } = req.body;

    // Example AI response (replace with your AI logic)
    let answer = "I don't know yet!";
    if (question) {
        answer = `You asked: "${question}". This is a sample response from the backend.`;
    }

    res.json({ answer });
});

/

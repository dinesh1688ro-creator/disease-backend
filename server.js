// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ----- ROOT ROUTE -----
app.get('/', (req, res) => {
    res.send('<h1>AI Chatbot Backend is Running!</h1><p>Use /getAnswer for API calls.</p>');
});

// ----- API ROUTE -----
app.post('/getAnswer', (req, res) => {
    const { question } = req.body;

    // Example response (replace with your AI logic)
    let answer = "I don't know yet!";
    if (question) {
        answer = `You asked: "${question}". This is a sample response from the backend.`;
    }

    res.json({ answer });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


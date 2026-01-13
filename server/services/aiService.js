const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const calculateProductivity = async (taskDescription, duration, tags) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
      Analyze the following work task description, duration, and tags. Assign a productivity score from 0 to 100 based on complexity, effort, and impact.
      
      Task: "${taskDescription}"
      Time Spent: ${duration} minutes
      Tags: ${tags && tags.length > 0 ? tags.join(', ') : 'None'}
      
      Scoring Rules:
      1. Time Factor: Long duration implies significant effort. A 5-hour (300 min) session of coding should almost always yield a high score (80+) unless the description is nonsensical.
      2. Complexity: Technical tasks (coding, debugging, learning) with high duration should be rewarded.
      3. Tags: Relevance to software engineering adds value.
      4. If the description is very short (e.g. "React.js") but the duration is long, assume deep work was done in that area.

      Also provide a short, encouraging feedback sentence (max 15 words) and a status.
      
      Return ONLY a JSON object with this format:
      {
        "score": number,
        "feedback": "string"
      }
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown if present (e.g. ```json ... ```)
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Gemini API Error:", error);
        // Fallback if API fails
        const fallbackScore = Math.min(Math.max(10, Math.floor((duration || 0) / 6)), 60); // Roughly 10 pts per hour, max 60 for offline
        return {
            score: fallbackScore,
            feedback: "Logged successfully (AI Offline - Est. Points)"
        };
    }
};

module.exports = { calculateProductivity };

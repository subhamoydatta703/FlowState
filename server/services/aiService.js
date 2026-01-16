const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const calculateProductivity = async (taskDescription, duration, tags) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
      You are a Productivity Scorer.
      Calculate the XP (Experience Points) for this task based on Duration and Complexity.

      Task: "${taskDescription}"
      Duration: ${duration} minutes
      Tags: ${tags && tags.length > 0 ? tags.join(', ') : 'None'}
      
      Formulas:
      1. Base Rate = 0.6 XP per minute. (e.g. 60 mins = 36 XP).
      2. Complexity Multiplier (Applied to Base Rate):
         - 0.8x: Passive/Low Effort (e.g., Tags: "Meeting", "Admin", "Email").
         - 1.0x: Standard Work (e.g., Tags: "Design", "Planning", "Research", "College", "Study", "Exams").
         - 1.2x: High Focus (e.g., Tags: "Coding", "Writing", "Learning").
         - 1.4x: Extreme/Deep Flow (e.g., Tags: "DSA", "Algorithms", "Debugging", "System Design").
      
      CRITICAL Instruction: Look at the 'Tags' field to pick the multiplier.
      
      ZERO Constraint:
      If the task is non-productive (e.g., "Sleep", "Nap", "Hangout", "Friends", "Tiffin", "Timepass", "Break", "Recess", "Travel", "Adda"), the Multiplier is 0.0x.
      
      Final Score = (Duration * 0.6) * Multiplier.
      
      Example:
      - 8 Hours (480 mins) of Coding (High Focus 1.2x): 
        480 * 0.6 * 1.2 = 345 XP.
      - 8 Hours of Admin (Low 0.8x):
        480 * 0.6 * 0.8 = 230 XP.
      
      Output:
      - Score (Round to integer).
      - Feedback (Short, max 10 words).
      
      Return ONLY JSON:
      {
        "score": number,
        "feedback": "string"
      }
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);

    } catch (error) {
        console.error("Gemini API Error:", error);

        // CHECK RESTRICTED KEYWORDS (FALLBACK MODE)
        const lowerDesc = taskDescription.toLowerCase();
        const lowerTags = tags ? tags.map(t => t.toLowerCase()) : [];
        const restricted = ["sleep", "nap", "hangout", "friends", "tiffin", "timepass", "break", "recess", "travel", "adda"];

        const isRestricted = restricted.some(w => lowerDesc.includes(w)) || lowerTags.some(t => restricted.includes(t));

        if (isRestricted) {
            return {
                score: 0,
                feedback: "Logged (Non-Productive)"
            };
        }

        // Fallback: 0.6 XP per minute (Standard Rate)
        // Cap single task fallback at 400 XP to prevent typos
        const fallbackScore = Math.floor(Math.min((duration || 0) * 0.6, 400));
        return {
            score: fallbackScore,
            feedback: "Logged!"
        };
    }
};



const generateWeeklyInsight = async (logs, userName) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // Prepare summary data
        const totalPoints = logs.reduce((sum, log) => sum + log.points, 0);
        const totalDuration = logs.reduce((sum, log) => sum + log.duration, 0);

        // Calculate Daily Breakdown
        const days = {};
        const now = new Date();
        for (let i = 0; i < 7; i++) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            days[d.toISOString().split('T')[0]] = 0;
        }

        logs.forEach(log => {
            const dateStr = new Date(log.createdAt).toISOString().split('T')[0];
            if (days[dateStr] !== undefined) {
                days[dateStr] += log.points;
            }
        });

        const dailyBreakdown = Object.entries(days)
            .sort((a, b) => new Date(a[0]) - new Date(b[0]))
            .map(([date, pts]) => `${date}: ${pts} XP`)
            .join('\n');

        const tags = {};
        logs.forEach(log => {
            log.tags.forEach(tag => {
                tags[tag] = (tags[tag] || 0) + 1;
            });
        });
        const topTags = Object.entries(tags).sort((a, b) => b[1] - a[1]).slice(0, 3).map(t => t[0]).join(', ');

        const prompt = `
            Act as a high-performance productivity coach.
            User: ${userName}
            
            Stats (Last 7 Days):
            - Total Focus Time: ${totalDuration} minutes
            - Total XP Earned: ${totalPoints}
            - Top Focus Areas: ${topTags || "General consistency"}
            
            Daily Trend (Analyze consistency):
            ${dailyBreakdown}
            
            Task:
            1. Analyze the daily trend. Do they cram work? (Bad) Are they consistent? (Good).
            2. Rate their productivity (0-10) based on output AND consistency.
               - 10 = High output + Perfect consistency.
               - 5 = Good output but sporadic (cramming).
               - 0 = No work.
            3. Write a SHORT, PUNCHY review (max 2 sentences).
            
            Return ONLY a JSON object:
            {
              "rating": number,
              "feedback": "string"
            }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("Gemini Raw Response:", text); // Keep console log too

        // Robust JSON extraction
        try {
            const startIndex = text.indexOf('{');
            const endIndex = text.lastIndexOf('}');
            if (startIndex === -1 || endIndex === -1) {
                throw new Error("No JSON found in response");
            }
            const jsonStr = text.substring(startIndex, endIndex + 1);
            return JSON.parse(jsonStr);
        } catch (parseError) {
            console.error("JSON Parse Failed. Raw text:", text);
            throw parseError; // Re-throw to hit the main catch block
        }

    } catch (error) {
        console.error("Gemini Insight Error:", error);

        // --- OFFLINE FALLBACK MODE ---
        // Mathematical Calculation for Productivity Score (0-10)

        // 1. Calculate Stats
        const totalPoints = logs.reduce((sum, log) => sum + log.points, 0);
        const daysWithLogs = new Set(logs.map(l => new Date(l.createdAt).toISOString().split('T')[0])).size;

        // 2. Define Goals
        const WEEKLY_XP_GOAL = 2100; // 300 XP * 7 Days
        const WEEKLY_DAYS_GOAL = 7;

        // 3. Calculate Components (50% each)
        // Volume Score (0-5): How much did you do?
        const volumeScore = Math.min((totalPoints / WEEKLY_XP_GOAL) * 5, 5);

        // Consistency Score (0-5): How often did you do it?
        const consistencyScore = (daysWithLogs / WEEKLY_DAYS_GOAL) * 5;

        // 4. Final Score
        let calculatedRating = Math.round(volumeScore + consistencyScore);

        // Clamp between 1 and 10
        calculatedRating = Math.max(1, Math.min(10, calculatedRating));

        // 5. Generate Message based on Score
        let fallbackMsg = "";
        if (calculatedRating >= 9) {
            fallbackMsg = "Elite performance! High volume and perfect consistency. You're crushing it.";
        } else if (calculatedRating >= 7) {
            fallbackMsg = "Great week! Your consistency is solid. Push for a bit more XP next time to hit a 10.";
        } else if (calculatedRating >= 5) {
            fallbackMsg = "Good effort. You're showing up, which is half the battle. Try to increase your daily deep work.";
        } else {
            fallbackMsg = "A slow week, but that's okay. Focus on logging at least one small task every day to build momentum.";
        }

        return {
            rating: calculatedRating,
            feedback: fallbackMsg
        };
    }
}

module.exports = { calculateProductivity, generateWeeklyInsight };

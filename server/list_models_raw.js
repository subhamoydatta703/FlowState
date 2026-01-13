const dotenv = require('dotenv');
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const URL = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

async function listModels() {
    try {
        console.log("Fetching models from:", URL.replace(API_KEY, "HIDDEN_KEY"));
        const response = await fetch(URL);
        const data = await response.json();

        if (data.models) {
            console.log("\n✅ Available Models:");
            data.models.forEach(m => {
                if (m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`- ${m.name.replace("models/", "")}`);
                }
            });
        } else {
            console.log("❌ No models found or error:", JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error("❌ Fetch error:", error);
    }
}

listModels();

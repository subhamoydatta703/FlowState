const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testModel(modelName) {
    console.log(`Testing model: ${modelName}...`);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello, are you working?");
        const response = await result.response;
        console.log(`✅ Success! Model '${modelName}' is working.`);
        console.log(`Response: ${response.text().substring(0, 50)}...`);
        return true;
    } catch (error) {
        console.log(`❌ Failed! Model '${modelName}' error: ${error.message}`);
        return false;
    }
}

async function runTests() {
    console.log("Starting AI Model Verification...");
    console.log("API Key found:", process.env.GEMINI_API_KEY ? "Yes" : "No");

    const modelsToTest = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro", "text-bison-001"];

    for (const model of modelsToTest) {
        const success = await testModel(model);
        if (success) {
            console.log(`\nRECOMMENDATION: Use '${model}' in your code.`);
            break;
        }
    }
}

runTests();

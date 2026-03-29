import { GoogleGenAI } from '@google/genai';

function getAiClient(): GoogleGenAI {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not configured');
    }

    return new GoogleGenAI({ apiKey });
}

export async function analyzeFood(imageBase64: string, mimeType: string = 'image/jpeg'): Promise<{ name: string; calories: number }> {
    const ai = getAiClient();

    const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: [
            {
                role: 'user',
                parts: [
                    { inlineData: { mimeType, data: imageBase64 } },
                    { text: 'Identify this food item and estimate its calories for a typical serving. Respond with ONLY valid JSON in this exact format, no markdown, no explanation: {"name": "food name", "calories": 123}' },
                ],
            },
        ],
    });

    const text = response.text ?? '';

    if (!text) {
        throw new Error('Empty response from Gemini');
    }

    // Extract the first JSON object found (handles markdown fences and trailing text)
    const jsonMatch = text.match(/\{[\s\S]*?\}/);
    if (!jsonMatch) {
        throw new Error(`No JSON in Gemini response: ${text.slice(0, 200)}`);
    }

    return JSON.parse(jsonMatch[0]) as { name: string; calories: number };
}
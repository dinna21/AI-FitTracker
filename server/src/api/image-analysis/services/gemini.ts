import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeFood(imageBase64: string, mimeType: string = 'image/jpeg'): Promise<{ name: string; calories: number }> {
    const contents = [
        {
            inlineData: {
                mimeType,
                data: imageBase64,
            },
        },
        {
            text: 'Identify this food item and estimate its calories for a typical serving. Respond with ONLY valid JSON in this exact format, no markdown, no explanation: {"name": "food name", "calories": 123}',
        },
    ];

    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents,
    });

    const text = response.text ?? '';

    // Strip markdown code fences if Gemini wraps the JSON anyway
    const cleaned = text.replace(/```(?:json)?/g, '').trim();

    return JSON.parse(cleaned) as { name: string; calories: number };
}
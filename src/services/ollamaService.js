// src/services/ollamaService.js

const OLLAMA_API_URL = process.env.REACT_APP_OLLAMA_API_URL || 'http://localhost:11434/api/chat';
const MODEL_NAME = 'qwen2.5vl:latest';

/**
 * Analyzes an image using the local Ollama model.
 * @param {string} base64Image - The base64 encoded image string (without the data URL prefix).
 * @param {string} prompt - The prompt for the AI model.
 * @returns {Promise<object>} - The JSON response from the model.
 */
export const analyzeImageWithOllama = async (base64Image, prompt) => {
    const payload = {
        model: MODEL_NAME,
        messages: [
            {
                role: "user",
                content: prompt,
                images: [base64Image] // Ollama expects an array of base64 strings
            }
        ],
        format: "json", // Request JSON output from Ollama
        stream: false
    };

    try {
        const response = await fetch(OLLAMA_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Ollama API request failed with status ${response.status}: ${errorBody}`);
        }

        const data = await response.json();
        
        // Ollama returns the response in message.content
        const content = data.message?.content;
        if (!content) {
            throw new Error("Invalid response structure from Ollama API.");
        }

        // Ollama with format: 'json' should already return a parsed JSON object in the content string.
        return JSON.parse(content);

    } catch (error) {
        console.error("Error calling Ollama API for image analysis:", error);
        throw error;
    }
};

/**
 * Gets a chat response from the local Ollama model.
 * @param {string} userMessage - The user's message.
 * @param {string[]} [colors] - Optional array of recommended colors for context.
 * @returns {Promise<string>} - The text response from the model.
 */
export const getOllamaChatResponse = async (userMessage, colors) => {
    const colorInfo = colors && colors.length > 0 ? `Los colores recomendados son: ${colors.map(c => c.nombre).join(', ')}. ` : '';
    const prompt = `Eres un asistente de moda y estilo. ${colorInfo}El usuario pregunta: "${userMessage}"\n\n` +
        `Responde de manera amigable y profesional en español. Incluye recomendaciones específicas de prendas, estilos o combinaciones que funcionen con los colores mencionados. ` +
        `Si el usuario no ha especificado un tipo de prenda, sugiere algunas opciones. Mantén las respuestas concisas y útiles.`;

    const payload = {
        model: MODEL_NAME,
        messages: [
            {
                role: "user",
                content: prompt
            }
        ],
        stream: false
    };

    try {
        const response = await fetch(OLLAMA_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Ollama API request failed with status ${response.status}: ${errorBody}`);
        }

        const data = await response.json();
        const textResponse = data.message?.content;

        if (!textResponse) {
            throw new Error("Invalid response structure from Ollama API.");
        }

        return textResponse;

    } catch (error) { 
        console.error("Error calling Ollama API for chat:", error);
        throw error;
    }
};

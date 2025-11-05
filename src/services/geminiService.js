/**
 * Servicio para interactuar con Google Gemini AI
 */

import { genAI, MODEL_NAME } from '../config/api';
import { getBase64, cleanJsonResponse, extractColors } from '../utils/imageUtils';
import { IMAGE_ANALYSIS_PROMPT } from '../constants/prompts';

/**
 * Analiza una imagen y devuelve recomendaciones de estilo
 * @param {File} file - Archivo de imagen a analizar
 * @returns {Promise<Object>} - Objeto con análisis y colores recomendados
 */
export const analyzeImage = async (file) => {
  try {
    const base64Image = await getBase64(file);
    
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const result = await model.generateContent([
      IMAGE_ANALYSIS_PROMPT,
      {
        inlineData: {
          mimeType: file.type,
          data: base64Image,
        },
      },
    ]);

    const textResponse = result.response?.text();
    
    if (!textResponse) {
      throw new Error("No se recibió una respuesta de la IA.");
    }

    // Intenta parsear directamente, luego limpia si es necesario
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(textResponse);
    } catch {
      const cleanText = cleanJsonResponse(textResponse);
      jsonResponse = JSON.parse(cleanText);
    }

    const colors = extractColors(jsonResponse);

    return {
      analysis: jsonResponse,
      colors: colors
    };
  } catch (error) {
    console.error("Error en analyzeImage:", error);
    throw error;
  }
};

/**
 * Genera una respuesta del chatbot
 * @param {string} prompt - Prompt para el modelo
 * @returns {Promise<string>} - Respuesta del chatbot
 */
export const generateChatResponse = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error al generar respuesta:', error);
    throw error;
  }
};

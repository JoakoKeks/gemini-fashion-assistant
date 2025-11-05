import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.REACT_APP_KEY;

if (!API_KEY) {
  console.error('REACT_APP_KEY no está configurada en las variables de entorno');
}

export const genAI = new GoogleGenerativeAI(API_KEY);
export const MODEL_NAME = 'gemini-2.5-flash';

import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

function ImageUploader() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const analyzeImage = async () => {
    if (!file) {
      setResponse("Por favor, sube una imagen primero.");
      return;
    }

    setLoading(true);
    setResponse("");

    try {
      const base64Image = await getBase64(file);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = "¿Qué opinas del atuendo en esta imagen? Analiza el estilo, los colores y las prendas. Dame consejos sobre cómo mejorar el atuendo para una entrevista de trabajo y para un look de día a día. Sé conciso y claro en tu respuesta.";

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: file.type,
            data: base64Image
          },
        },
      ]);

      setResponse(result.response.text());
    } catch (error) {
      console.error("Error al llamar a la API de Gemini:", error);
      setResponse("Ocurrió un error al analizar la imagen. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Asistente de Imagen con Gemini</h1>
      <input type="file" onChange={handleFileChange} accept="image/*" />
      <button onClick={analyzeImage} disabled={loading} style={{ marginLeft: '10px' }}>
        {loading ? 'Analizando...' : 'Analizar Imagen'}
      </button>

      {response && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px', borderRadius: '8px', whiteSpace: 'pre-wrap' }}>
          <h3>Análisis y Consejos:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
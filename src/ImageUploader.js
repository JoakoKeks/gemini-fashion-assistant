import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Reemplaza "TU_CLAVE_AQUI" con tu clave de API de Gemini.
const API_KEY = "TU_CLAVE_AQUI";
const genAI = new GoogleGenerativeAI(API_KEY);

const styles = {
  container: {
    padding: '40px',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    maxWidth: '700px',
    margin: '20px auto',
    backgroundColor: '#f9f9f9',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  title: {
    color: '#333',
    marginBottom: '20px',
  },
  uploadArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '30px',
  },
  fileInput: {
    marginBottom: '15px',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  button: {
    padding: '12px 25px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
    cursor: 'not-allowed',
  },
  previewContainer: {
    marginBottom: '30px',
    border: '1px solid #eee',
    borderRadius: '8px',
    padding: '15px',
    backgroundColor: 'white',
  },
  previewTitle: {
    color: '#555',
    marginBottom: '10px',
  },
  imagePreview: {
    maxWidth: '100%',
    maxHeight: '400px',
    objectFit: 'contain',
    borderRadius: '6px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
  },
  responseContainer: {
    marginTop: '30px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: 'white',
    textAlign: 'left',
  },
  responseTitle: {
    color: '#333',
    marginBottom: '15px',
  },
  colorPaletteSection: {
    marginTop: '20px',
  },
  colorPaletteTitle: {
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  colorSwatchGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '15px',
    justifyContent: 'center',
  },
  colorSwatchWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    width: '80px',
  },
  colorSwatch: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    border: '1px solid #ccc',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  colorName: {
    marginTop: '5px',
    fontSize: '12px',
    color: '#555',
  },
};

function ImageUploader() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
      setError('');
    } else {
      setImagePreview(null);
    }
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
      setError("Por favor, sube una imagen primero.");
      return;
    }

    setLoading(true);
    setResponse(null);
    setError('');

    try {
      const base64Image = await getBase64(file);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // **PROMPT MEJORADO PARA DEVOLVER JSON**
      const prompt = `Analiza la imagen de esta persona. Actúa como un experto en colorimetría. 
                      Identifica el color de la piel, ojos y cabello. Luego, con base en estas características, 
                      realiza una recomendación de colores. Recomienda 5 colores específicos para una entrevista de trabajo 
                      y 5 colores para el uso diario. Devuelve la respuesta en formato JSON con la siguiente estructura:
                      {
                        "analisis_general": "El análisis de colorimetría en texto sin formato.",
                        "entrevistas": [
                          {"nombre": "Azul Marino", "hex": "#000080"},
                          {"nombre": "Gris Carbón", "hex": "#36454F"},
                          {"nombre": "Blanco Roto", "hex": "#F5F5DC"}
                        ],
                        "dia_a_dia": [
                          {"nombre": "Verde Oliva", "hex": "#6B8E23"},
                          {"nombre": "Naranja Quemado", "hex": "#CC5500"},
                          {"nombre": "Mostaza", "hex": "#FFDB58"}
                        ]
                      }`;

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: file.type,
            data: base64Image,
          },
        },
      ]);

      const textResponse = result.response?.text();
      const jsonResponse = JSON.parse(textResponse.replace(/```json\n|\n```/g, ''));
      setResponse(jsonResponse);
    } catch (err) {
      console.error("Error al analizar la imagen:", err);
      setError("Ocurrió un error al analizar la imagen. Asegúrate de que la clave de la API es correcta y la imagen es de buena calidad.");
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  const renderColors = (colors) => (
    <div style={styles.colorSwatchGroup}>
      {colors.map((color, index) => (
        <div key={index} style={styles.colorSwatchWrapper}>
          <div style={{ ...styles.colorSwatch, backgroundColor: color.hex }}></div>
          <span style={styles.colorName}>{color.nombre}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Asistente de Imagen con Gemini</h1>
      <p>Sube una foto y recibe un análisis de colorimetría con recomendaciones de colores.</p>
      <div style={styles.uploadArea}>
        <input type="file" onChange={handleFileChange} accept="image/*" style={styles.fileInput} />
        <button
          onClick={analyzeImage}
          disabled={loading}
          style={{ ...styles.button, ...(loading && styles.buttonDisabled) }}
        >
          {loading ? 'Analizando...' : 'Analizar Imagen'}
        </button>
      </div>

      {imagePreview && (
        <div style={styles.previewContainer}>
          <h3 style={styles.previewTitle}>Vista Previa de la Imagen:</h3>
          <img src={imagePreview} alt="Vista previa del atuendo" style={styles.imagePreview} />
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {response && (
        <div style={styles.responseContainer}>
          <h3 style={styles.responseTitle}>Resultados del Análisis:</h3>
          <p>{response.analisis_general}</p>
          <div style={styles.colorPaletteSection}>
            <h4 style={styles.colorPaletteTitle}>Colores para Entrevistas de Trabajo</h4>
            {renderColors(response.entrevistas)}
          </div>
          <div style={styles.colorPaletteSection}>
            <h4 style={styles.colorPaletteTitle}>Colores para el Día a Día</h4>
            {renderColors(response.dia_a_dia)}
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
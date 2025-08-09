import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Reemplaza "TU_CLAVE_AQUI" con tu clave de API de Gemini.
const API_KEY = "AIzaSyAa_b9slmpPALrYu0FsiNRU-b4CsIeyXw4";
const genAI = new GoogleGenerativeAI(API_KEY);

const styles = {
  container: {
    padding: '2.5rem',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    textAlign: 'center',
    maxWidth: '1000px',
    margin: '2rem auto',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.04)',
    border: '1px solid rgba(0, 0, 0, 0.05)',
  },
  title: {
    color: '#1a1a1a',
    margin: '0 0 1.5rem 0',
    fontSize: '1.8rem',
    fontWeight: '700',
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
    border: '2px dashed #e0e6ed',
    borderRadius: '14px',
    padding: '3rem 2rem',
    margin: '0 auto 2rem',
    cursor: 'pointer',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    backgroundColor: '#f8fafc',
    maxWidth: '600px',
  },
  uploadAreaHover: {
    borderColor: '#3b82f6',
    backgroundColor: '#f0f7ff',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 12px rgba(59, 130, 246, 0.1)',
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
    backgroundColor: '#cbd5e1',
    cursor: 'not-allowed',
    boxShadow: 'none',
    transform: 'none',
  },
  buttonNotDisabledHover: {
    backgroundColor: '#2563eb',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 8px rgba(59, 130, 246, 0.4)',
  },
  buttonNotDisabledActive: {
    transform: 'translateY(0)',
    boxShadow: '0 2px 5px rgba(59, 130, 246, 0.3)',
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
  previewImage: {
    maxWidth: '100%',
    maxHeight: '400px',
    margin: '1.5rem 0',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease',
  },
  previewImageHover: {
    transform: 'scale(1.01)',
    boxShadow: '0 12px 25px rgba(0, 0, 0, 0.12)',
  },
  responseContainer: {
    marginTop: '30px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: 'white',
    textAlign: 'left',
  },
  uploadIcon: {
    fontSize: '3.5rem',
    color: '#94a3b8',
    marginBottom: '1rem',
    transition: 'all 0.3s ease',
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
  colorPalette: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '1.5rem',
    margin: '2rem 0',
    padding: '0 0.5rem',
  },
  colorCard: {
    background: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    transition: 'all 0.3s ease',
    ':hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
    },
  },
  colorSwatch: {
    height: '120px',
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-end',
    padding: '1rem',
  },
  colorOverlay: {
    position: 'absolute',
    bottom: '0',
    left: '0',
    right: '0',
    background: 'rgba(255,255,255,0.9)',
    padding: '0.75rem',
    textAlign: 'center',
  },
  colorHex: {
    fontFamily: '\'Fira Code\', monospace',
    fontSize: '0.8rem',
    fontWeight: '500',
    color: '#333',
    letterSpacing: '0.5px',
  },
  colorInfo: {
    padding: '1rem',
    textAlign: 'left',
  },
  colorName: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#1a1a1a',
    margin: '0 0 0.25rem 0',
  },
  colorCode: {
    fontSize: '0.8rem',
    color: '#666',
    fontFamily: '\'Fira Code\', monospace',
    opacity: '0.8',
  },
  colorSwatchHover: {
    transform: 'translateY(-3px)',
    boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
  },
  colorInfo: {
    padding: '0.75rem',
    backgroundColor: 'white',
  },
  colorName: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '0.25rem',
  },
  colorCode: {
    fontSize: '0.8rem',
    color: '#64748b',
    fontFamily: '\'Fira Code\', monospace',
  },
  colorGroup: {
    marginBottom: '2.5rem',
  },
  colorGroupTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1a1a1a',
    margin: '2.5rem 0 1.5rem',
    paddingBottom: '0.75rem',
    borderBottom: '2px solid #f0f0f0',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    position: 'relative',
    '::after': {
      content: '""',
      position: 'absolute',
      bottom: '-2px',
      left: '0',
      width: '60px',
      height: '2px',
      background: '#3b82f6',
    },
  },
  loading: {
    margin: '2rem 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    color: '#64748b',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(59, 130, 246, 0.2)',
    borderTopColor: '#3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  '@keyframes spin': {
    to: { transform: 'rotate(360deg)' },
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
    <div style={styles.colorPalette}>
      {colors.map((color, index) => (
        <div key={index} className="color-card" style={styles.colorCard}>
          <div 
            className="color-swatch"
            style={{
              ...styles.colorSwatch,
              backgroundColor: color.hex,
              background: `linear-gradient(135deg, ${color.hex} 0%, ${color.hex} 50%, ${color.hex}99 100%)`
            }}
          >
            <div style={styles.colorOverlay}>
              <span style={styles.colorHex}>{color.hex}</span>
            </div>
          </div>
          <div style={styles.colorInfo}>
            <p style={styles.colorName}>{color.nombre}</p>
            <p style={styles.colorCode}>{color.hex}</p>
          </div>
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
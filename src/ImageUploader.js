import React, { useState, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

function ImageUploader({ onAnalysisStart, onAnalysisComplete }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      if (selectedFile.type.startsWith('image/')) {
        setFile(selectedFile);
        setPreviewUrl(URL.createObjectURL(selectedFile));
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
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
      onAnalysisComplete("Please upload an image first.");
      return;
    }

    onAnalysisStart();

    try {
      const base64Image = await getBase64(file);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Analiza el atuendo en esta imagen y proporciona un análisis detallado que incluya:
      1. Descripción general del estilo (150-200 palabras)
      2. Análisis de colores y combinaciones
      3. Evaluación de silueta y ajuste
      4. Ocasiones para las que es apropiado
      5. Tres colores recomendados en formato hexadecimal (ej: #FF5733) que combinen con la imagen
      6. Sugerencias de mejora específicas y consejos de estilismo
      
      Devuelve la respuesta en formato JSON con las claves: "analisis", "colores" (array de 3 colores en HEX) y "sugerencias".
      
      Ejemplo de respuesta:
      {
        "analisis": "El atuendo presenta un estilo casual contemporáneo con un toque sofisticado...",
        "colores": ["#4A90E2", "#50E3C2", "#F5A623"],
        "sugerencias": "Para elevar este look, considera agregar una chaqueta de mezclilla..."
      }`;

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: file.type,
            data: base64Image
          },
        },
      ]);

      try {
        // Intentar parsear la respuesta como JSON
        const responseText = result.response.text().trim();
        const jsonStart = responseText.indexOf('{');
        const jsonEnd = responseText.lastIndexOf('}') + 1;
        const jsonResponse = JSON.parse(responseText.substring(jsonStart, jsonEnd));
        onAnalysisComplete(jsonResponse);
      } catch (error) {
        console.error("Error parsing JSON response:", error);
        onAnalysisComplete({
          analisis: result.response.text(),
          colores: ["#6c63ff", "#4a45b1", "#a29bfe"],
          sugerencias: "No se pudieron obtener recomendaciones de color específicas."
        });
      }
    } catch (error) {
      console.error("Error analyzing image:", error);
      onAnalysisComplete("Error al analizar la imagen. Por favor, inténtalo de nuevo con una imagen diferente o verifica tu conexión.");
    }
  };

  return (
    <div className="image-uploader">
      <div 
        className={`drop-zone ${isDragging ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
        
        {previewUrl ? (
          <div className="image-preview">
            <img src={previewUrl} alt="Preview" />
            <div className="overlay">
              <span>Haz clic o arrastra una imagen diferente</span>
            </div>
          </div>
        ) : (
          <div className="upload-prompt">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <h3>Arrastra y suelta tu foto de atuendo aquí</h3>
            <p>o haz clic para buscar archivos</p>
            <p className="file-types">Formatos: JPG, PNG, WEBP (Máx. 10MB)</p>
          </div>
        )}
      </div>
      
      <div className="actions">
        <button 
          onClick={analyzeImage} 
          disabled={!file}
          className="analyze-button"
        >
          Analizar Mi Atuendo
        </button>
      </div>
      
      <style jsx>{`
        .image-uploader {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
        }
        
        .drop-zone {
          border: 2px dashed #d1d5db;
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background-color: #f9fafb;
          margin-bottom: 1.5rem;
          min-height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .drop-zone.drag-over {
          border-color: var(--primary-color);
          background-color: rgba(108, 99, 255, 0.05);
        }
        
        .upload-prompt {
          color: var(--text-light);
        }
        
        .upload-prompt svg {
          margin-bottom: 1rem;
          color: var(--primary-color);
        }
        
        .upload-prompt h3 {
          margin: 0.5rem 0;
          color: var(--text-color);
        }
        
        .file-types {
          font-size: 0.875rem;
          margin-top: 0.5rem;
          color: var(--text-light);
        }
        
        .image-preview {
          position: relative;
          width: 100%;
          height: 100%;
          max-height: 400px;
          overflow: hidden;
          border-radius: 8px;
        }
        
        .image-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .image-preview:hover .overlay {
          opacity: 1;
        }
        
        .actions {
          display: flex;
          justify-content: center;
        }
        
        .analyze-button {
          padding: 0.75rem 2rem;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 50px;
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          color: white;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(108, 99, 255, 0.2);
        }
        
        .analyze-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(108, 99, 255, 0.3);
        }
        
        .analyze-button:disabled {
          background: #e5e7eb;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
      `}</style>
    </div>
  );
}

export default ImageUploader;
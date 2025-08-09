import React, { useState, useEffect } from 'react';
import ImageUploader from './ImageUploader';
import './App.css';

function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [recommendedColors, setRecommendedColors] = useState([]);

  const handleAnalysisComplete = (result) => {
    setAnalysisResult(result.analisis);
    setRecommendedColors(Array.isArray(result.colores) ? result.colores : []);
    setIsAnalyzing(false);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Asistente de Moda Gemini</h1>
        <p>Sube tu atuendo y recibe consejos de moda impulsados por IA</p>
      </header>
      
      <main className="main-content">
        <div className="upload-section">
          <ImageUploader 
            onAnalysisStart={() => setIsAnalyzing(true)}
            onAnalysisComplete={handleAnalysisComplete}
          />
        </div>
        
        {isAnalyzing && (
          <div className="analysis-loading">
            <div className="spinner"></div>
            <p>Analizando tu estilo de moda...</p>
          </div>
        )}
        
        {analysisResult && (
          <div className="analysis-result">
            <h2>Análisis de Moda</h2>
            <div className="result-content">
              {analysisResult}
              
              {recommendedColors.length > 0 && (
                <div className="color-recommendations">
                  <h3>Colores recomendados:</h3>
                  <div className="color-palette">
                    {recommendedColors.map((color, index) => (
                      <div 
                        key={index} 
                        className="color-swatch"
                        style={{ backgroundColor: color }}
                        title={color}
                      >
                        <span className="color-code">{color}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      
      <footer className="app-footer">
        <p>Desarrollado con Gemini AI • {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;
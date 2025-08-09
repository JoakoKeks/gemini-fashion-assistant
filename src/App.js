import React, { useState } from 'react';
import ImageUploader from './ImageUploader';
import './App.css';

function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleAnalysisComplete = (result) => {
    setAnalysisResult(result);
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
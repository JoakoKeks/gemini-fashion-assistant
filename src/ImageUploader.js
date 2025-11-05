import React, { useState } from 'react';
import Chatbot from './Chatbot';
import { analyzeImage as analyzeImageService } from './services/geminiService';

const styles = {
    container: {
        padding: '3rem 1.5rem',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        textAlign: 'center',
        maxWidth: '1000px',
        width: '100%',
        margin: '0 auto',
        minHeight: '100vh',
        backgroundColor: '#f8f9ff',
        color: '#2d3748',
    },
    title: {
        margin: '0 0 0.5rem 0',
        fontSize: '3.5rem',
        fontWeight: '800',
        letterSpacing: '-1.5px',
        display: 'inline-block',
        lineHeight: '1.1',
        marginBottom: '1rem',
        color: '#1a1a1a', // Ensures the base color is black
    },
    iaText: {
        background: 'linear-gradient(45deg, #7c3aed, #c026d3)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        display: 'inline-block',
        fontWeight: 800,
        marginLeft: '4px',
    },
    subtitle: {
        color: '#4a5568',
        fontSize: '1.25rem',
        maxWidth: '700px',
        margin: '0 auto 3rem',
        lineHeight: '1.6',
        fontWeight: '400',
        opacity: 0.9,
    },
    uploadArea: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto',
    },
    fileInput: {
        width: '100%',
        padding: '4rem 2rem',
        textAlign: 'center',
        border: '2px dashed #c7d2fe',
        borderRadius: '16px',
        backgroundColor: 'rgba(238, 242, 255, 0.5)',
        color: '#4f46e5',
        fontSize: '1.1rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        marginBottom: '1.5rem',
        position: 'relative',
        overflow: 'hidden',
    },
    button: {
        padding: '0.875rem 2.5rem',
        backgroundColor: '#4f46e5',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        fontSize: '1.1rem',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)',
        position: 'relative',
        overflow: 'hidden',
    },
    previewContainer: {
        margin: '2rem auto',
        textAlign: 'center',
        maxWidth: '100%',
        padding: '1.5rem',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0',
    },
    previewTitle: {
        fontSize: '1.25rem',
        color: '#4f46e5',
        marginBottom: '1rem',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
    },
    imagePreview: {
        maxWidth: '100%',
        maxHeight: '350px',
        width: 'auto',
        height: 'auto',
        borderRadius: '12px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        objectFit: 'cover',
        margin: '0 auto',
        display: 'block',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    },
    responseContainer: {
        marginTop: '3rem',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '2rem',
        backgroundColor: 'white',
        textAlign: 'left',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s ease',
    },
    uploadIcon: {
        fontSize: '3.5rem',
        color: '#94a3b8',
        marginBottom: '1rem',
        transition: 'all 0.3s ease',
    },
    colorPaletteSection: {
        marginTop: '2rem',
        padding: '1.5rem 0',
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        marginBottom: '2rem',
        border: '1px solid #e2e8f0',
        width: '100%',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 1,
    },
    chatButton: {
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: '#7c3aed',
        color: 'white',
        border: 'none',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.75rem',
        zIndex: 999,
        transition: 'all 0.3s ease',
    },
    colorPaletteTitle: {
        fontSize: '1.25rem',
        fontWeight: '600',
        margin: '0 0 1rem 1.5rem',
        color: '#1a1a1a',
        textAlign: 'left',
        position: 'relative',
        paddingBottom: '0.5rem',
    },
    colorPalette: {
        display: 'flex',
        flexWrap: 'nowrap',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        gap: '1.25rem',
        margin: '0.5rem 0 1.5rem',
        padding: '1rem 1.5rem',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
    },
    colorCard: {
        width: '140px',
        flex: '0 0 auto',
        background: '#fff',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        transition: 'all 0.3s ease',
        margin: 0,
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
        padding: '0.75rem',
        backgroundColor: 'white',
        textAlign: 'left',
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
        marginBottom: '1rem'
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
        position: 'relative'
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
        borderRadius: '50%'
    },
    recommendationsContainer: {
        marginTop: '2.5rem',
    },
    recommendationTitle: {
        fontSize: '1.5rem',
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: '1.5rem',
    },
    recommendationItem: {
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '12px',
        marginBottom: '1rem',
        borderLeft: '4px solid #4f46e5',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
        transition: 'all 0.3s ease',
    },
    recommendationText: {
        flexGrow: 1,
    },
};

const ImageUploader = () => {
    const [showChatbot, setShowChatbot] = useState(false);
    const [recommendedColors, setRecommendedColors] = useState([]);
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

    const handleAnalyzeImage = async () => {
        if (!file) {
            setError("Por favor, sube una imagen primero.");
            return;
        }

        setLoading(true);
        setResponse(null);
        setError('');

        try {
            const result = await analyzeImageService(file);
            setResponse(result.analysis);
            setRecommendedColors(result.colors);
        } catch (err) {
            setError(`Ocurrió un error al analizar la imagen: ${err.message}`);
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
    
    // Función renderRecommendationsWithImages modificada para no mostrar imágenes
    const renderRecommendationsWithImages = (prendas) => (
      <div style={styles.recommendationsContainer}>
          <h4 style={styles.recommendationTitle}>Recomendaciones de Prendas</h4>
          {prendas.map((prenda, index) => (
              <div key={index} style={styles.recommendationItem}>
                  <p style={styles.recommendationText}>{prenda.descripcion}</p>
              </div>
          ))}
      </div>
    );

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>
                <span style={{ color: '#1a1a1a', fontWeight: 800 }}>Esenc</span>
                <span style={{ 
                    background: 'linear-gradient(45deg, #7c3aed, #c026d3)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'inline-block',
                    fontWeight: 800,
                    marginLeft: '4px',
                    textTransform: 'uppercase'
                }}>ia</span>
            </h1>
            <p style={styles.subtitle}>
                Descubre tu paleta de colores personalizada con inteligencia artificial.
                Sube una foto y recibe un análisis detallado de colores y recomendaciones de prendas.
            </p>
            <div style={styles.uploadArea}>
                <input type="file" onChange={handleFileChange} accept="image/*" style={styles.fileInput} />
                <button
                    onClick={handleAnalyzeImage}
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
                    {response.prendas_recomendadas && renderRecommendationsWithImages(response.prendas_recomendadas)}
                </div>
            )}
            
            {/* Chatbot Toggle Button */}
            <button 
                onClick={() => setShowChatbot(!showChatbot)}
                style={styles.chatButton}
                aria-label="Abrir chat de asesoría de estilo"
            >
                💬
            </button>
            
            {/* Chatbot Component */}
            {showChatbot && (
                <Chatbot 
                    colors={recommendedColors} 
                    onClose={() => setShowChatbot(false)} 
                />
            )}
        </div>
    );
}

export default ImageUploader;

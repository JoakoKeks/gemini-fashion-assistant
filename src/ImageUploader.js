import React, { useState } from 'react';
import Chatbot from './Chatbot';
import ColorModal from './components/ColorModal';
import { analyzeImage as analyzeImageService } from './services/geminiService';

const styles = {
    container: {
        padding: '1rem',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        textAlign: 'center',
        maxWidth: '100%',
        width: '100%',
        margin: '0',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#2d3748',
        paddingBottom: '80px',
    },
    title: {
        margin: '0.5rem 0',
        fontSize: '2rem',
        fontWeight: '800',
        letterSpacing: '-1px',
        display: 'inline-block',
        lineHeight: '1.1',
        color: '#ffffff',
        textShadow: '0 2px 10px rgba(0,0,0,0.2)',
    },
    iaText: {
        background: 'linear-gradient(45deg, #ffd700, #ff6b6b)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        display: 'inline-block',
        fontWeight: 800,
        marginLeft: '4px',
    },
    subtitle: {
        color: '#ffffff',
        fontSize: '0.9rem',
        maxWidth: '100%',
        margin: '0.5rem 1rem 1.5rem',
        lineHeight: '1.5',
        fontWeight: '400',
        opacity: 0.95,
        padding: '0 0.5rem',
        textShadow: '0 1px 3px rgba(0,0,0,0.2)',
    },
    uploadArea: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        padding: '0 1rem',
        margin: '0',
    },
    fileInput: {
        width: '100%',
        padding: '2.5rem 1rem',
        textAlign: 'center',
        border: '2px dashed #c7d2fe',
        borderRadius: '12px',
        backgroundColor: 'rgba(238, 242, 255, 0.5)',
        color: '#4f46e5',
        fontSize: '0.95rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        marginBottom: '1rem',
        position: 'relative',
        overflow: 'hidden',
    },
    button: {
        padding: '0.875rem 2rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '25px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
        width: '100%',
        maxWidth: '300px',
    },
    previewContainer: {
        margin: '1rem',
        textAlign: 'center',
        maxWidth: '100%',
        padding: '1rem',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0',
    },
    previewTitle: {
        fontSize: '1rem',
        color: '#4f46e5',
        marginBottom: '0.75rem',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
    },
    imagePreview: {
        maxWidth: '100%',
        maxHeight: '250px',
        width: 'auto',
        height: 'auto',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        objectFit: 'cover',
        margin: '0 auto',
        display: 'block',
    },
    responseContainer: {
        marginTop: '1.5rem',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '1rem',
        margin: '1rem',
        backgroundColor: 'white',
        textAlign: 'left',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    },
    responseTitle: {
        fontSize: '1.1rem',
        fontWeight: '600',
        marginBottom: '1rem',
        color: '#1a1a1a',
    },
    uploadIcon: {
        fontSize: '3.5rem',
        color: '#94a3b8',
        marginBottom: '1rem',
        transition: 'all 0.3s ease',
    },
    colorPaletteSection: {
        marginTop: '1.5rem',
        padding: '1rem 0',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
        borderRadius: '12px',
        marginBottom: '1.5rem',
        border: 'none',
        width: '100%',
        boxSizing: 'border-box',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    },
    chatButton: {
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        zIndex: 999,
    },
    colorPaletteTitle: {
        fontSize: '1rem',
        fontWeight: '600',
        margin: '0 0 0.75rem 1rem',
        color: '#1a1a1a',
        textAlign: 'left',
    },
    colorPalette: {
        display: 'flex',
        flexWrap: 'nowrap',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        gap: '0.75rem',
        margin: '0',
        padding: '0.75rem 1rem',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch',
    },
    colorCard: {
        width: '110px',
        minWidth: '110px',
        flex: '0 0 auto',
        background: '#fff',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        margin: 0,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
    colorSwatch: {
        height: '90px',
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '0.75rem',
    },
    colorOverlay: {
        position: 'absolute',
        bottom: '0',
        left: '0',
        right: '0',
        background: 'rgba(255,255,255,0.9)',
        padding: '0.5rem',
        textAlign: 'center',
    },
    colorHex: {
        fontFamily: 'monospace',
        fontSize: '0.7rem',
        fontWeight: '500',
        color: '#333',
    },
    colorInfo: {
        padding: '0.5rem',
        backgroundColor: 'white',
        textAlign: 'left',
    },
    colorName: {
        fontSize: '0.75rem',
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: '0.15rem',
        lineHeight: '1.2',
    },
    colorCode: {
        fontSize: '0.7rem',
        color: '#64748b',
        fontFamily: 'monospace',
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
        margin: '1.5rem 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.75rem',
        color: '#64748b',
        fontSize: '0.9rem',
    },
    spinner: {
        width: '32px',
        height: '32px',
        border: '3px solid rgba(59, 130, 246, 0.2)',
        borderTopColor: '#3b82f6',
        borderRadius: '50%'
    },
    recommendationsContainer: {
        marginTop: '3rem',
    },
    recommendationTitle: {
        fontSize: '1.1rem',
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: '1rem',
    },
    recommendationItem: {
        backgroundColor: 'white',
        padding: '1rem',
        borderRadius: '12px',
        marginBottom: '1rem',
        borderLeft: '4px solid #667eea',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        fontSize: '0.9rem',
        lineHeight: '1.5',
    },
    recommendationHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.5rem',
    },
    prendaName: {
        fontSize: '1rem',
        fontWeight: '700',
        color: '#1a1a1a',
    },
    tiendaBadge: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '0.25rem 0.75rem',
        borderRadius: '12px',
        fontSize: '0.75rem',
        fontWeight: '600',
    },
    colorTag: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        backgroundColor: '#f3f4f6',
        padding: '0.25rem 0.75rem',
        borderRadius: '12px',
        fontSize: '0.8rem',
        fontWeight: '500',
        color: '#4b5563',
        marginBottom: '0.5rem',
    },
    colorDot: {
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        border: '2px solid white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    },
    recommendationText: {
        color: '#4b5563',
        marginBottom: '0.75rem',
        lineHeight: '1.6',
    },
    precioContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '0.5rem',
        borderTop: '1px solid #e5e7eb',
    },
    precioLabel: {
        fontSize: '0.8rem',
        color: '#6b7280',
    },
    precio: {
        fontSize: '1rem',
        fontWeight: '700',
        color: '#667eea',
    },
    clickHint: {
        fontSize: '0.65rem',
        color: '#667eea',
        textAlign: 'center',
        padding: '0.25rem',
        backgroundColor: '#f0f4ff',
        fontWeight: '500',
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
    const [selectedColor, setSelectedColor] = useState(null);

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
                <div 
                    key={index} 
                    className="color-card" 
                    style={styles.colorCard}
                    onClick={() => setSelectedColor(color)}
                >
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
                    <div style={styles.clickHint}>👆 Click para ver prendas</div>
                </div>
            ))}
        </div>
    );
    
    const renderRecommendationsWithImages = (prendas) => (
      <div style={styles.recommendationsContainer}>
          <h4 style={styles.recommendationTitle}>🛍️ Recomendaciones de Prendas</h4>
          {prendas.map((prenda, index) => (
              <div key={index} style={styles.recommendationItem}>
                  <div style={styles.recommendationHeader}>
                      <span style={styles.prendaName}>{prenda.prenda || 'Prenda'}</span>
                      {prenda.tienda && (
                          <span style={styles.tiendaBadge}>{prenda.tienda}</span>
                      )}
                  </div>
                  {prenda.color && (
                      <div style={styles.colorTag}>
                          <span style={{
                              ...styles.colorDot,
                              backgroundColor: prenda.color_hex || '#667eea'
                          }}></span>
                          {prenda.color}
                      </div>
                  )}
                  <p style={styles.recommendationText}>{prenda.descripcion}</p>
                  {prenda.precio_aprox && (
                      <div style={styles.precioContainer}>
                          <span style={styles.precioLabel}>Precio aprox:</span>
                          <span style={styles.precio}>{prenda.precio_aprox}</span>
                      </div>
                  )}
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
                    {loading ? '✨ Analizando...' : '✨ Analizar Imagen'}
                </button>
            </div>

            {loading && (
                <div style={styles.loading}>
                    <div className="spinner" style={styles.spinner}></div>
                    <p style={{color: 'white', fontWeight: '500'}}>✨ Analizando tu estilo...</p>
                </div>
            )}

            {imagePreview && !loading && (
                <div style={styles.previewContainer}>
                    <h3 style={styles.previewTitle}>📸 Vista Previa</h3>
                    <img src={imagePreview} alt="Vista previa del atuendo" style={styles.imagePreview} />
                </div>
            )}

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {response && (
                <div style={styles.responseContainer}>
                    <h3 style={styles.responseTitle}>✨ Tu Análisis Personalizado</h3>
                    <p>{response.analisis_general}</p>
                    <div style={styles.colorPaletteSection}>
                        <h4 style={styles.colorPaletteTitle}>💼 Colores para Entrevistas</h4>
                        {renderColors(response.entrevistas)}
                    </div>
                    <div style={styles.colorPaletteSection}>
                        <h4 style={styles.colorPaletteTitle}>☀️ Colores para el Día a Día</h4>
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

            {/* Color Modal */}
            {selectedColor && (
                <ColorModal 
                    color={selectedColor}
                    onClose={() => setSelectedColor(null)}
                />
            )}
        </div>
    );
}

export default ImageUploader;

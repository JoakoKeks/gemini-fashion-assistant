import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Chatbot from './Chatbot';

// Usa la clave de API desde las variables de entorno
const API_KEY = process.env.REACT_APP_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

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
        margin: '2rem 0 3rem',
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
        '&:hover': {
            borderColor: '#818cf8',
            backgroundColor: 'rgba(238, 242, 255, 0.8)',
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 20px rgba(99, 102, 241, 0.15)',
        },
        '&:active': {
            transform: 'translateY(0)',
            boxShadow: '0 2px 10px rgba(99, 102, 241, 0.1)',
        },
    },
    uploadAreaHover: {
        borderColor: '#3b82f6',
        backgroundColor: '#f0f7ff',
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 12px rgba(59, 130, 246, 0.1)',
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
        '&:hover:not(:disabled)': {
            backgroundColor: '#4338ca',
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(79, 70, 229, 0.4)',
        },
        '&:active:not(:disabled)': {
            transform: 'translateY(0)',
            boxShadow: '0 2px 10px rgba(79, 70, 229, 0.3)',
        },
        '&:disabled': {
            backgroundColor: '#c7d2fe',
            cursor: 'not-allowed',
            boxShadow: 'none',
            transform: 'none',
        },
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
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        },
    },
    previewImageHover: {
        transform: 'scale(1.01)',
        boxShadow: '0 12px 25px rgba(0, 0, 0, 0.12)',
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
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.08)',
        },
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
        '&:hover': {
            backgroundColor: '#6d28d9',
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
        },
        '&:active': {
            transform: 'translateY(1px)',
        },
    },
    colorPaletteTitle: {
        fontSize: '1.25rem',
        fontWeight: '600',
        margin: '0 0 1rem 1.5rem',
        color: '#1a1a1a',
        textAlign: 'left',
        position: 'relative',
        paddingBottom: '0.5rem',
        '&:after': {
            content: '""',
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '40px',
            width: '60px',
            height: '3px',
            background: 'linear-gradient(90deg, #4f46e5, #818cf8)',
            borderRadius: '3px',
        },
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
        '&::-webkit-scrollbar': {
            display: 'none',
        },
        '& > *': {
            flex: '0 0 auto',
            margin: '0',
        },
        '@media (max-width: 768px)': {
            padding: '1rem',
            gap: '0.75rem',
        },
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
        ':hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
        },
        '@media (max-width: 768px)': {
            width: '120px',
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
        marginBottom: '2.5rem',
        '&:last-child': {
            marginBottom: '0',
        },
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
        '&:hover': {
            transform: 'translateX(4px)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        },
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
            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash"
            });

            // Prompt actualizado para un análisis más dinámico y preciso
            const prompt = `Actúa como un estilista personal y experto en colorimetría. 
                            Analiza la imagen e identifica el color de la piel, ojos y cabello de la persona. 
                            Luego, basándote en estas características, determina su estación de color y su forma de cuerpo. 
                            Tienes que hablarle a la persona directamente usando la segunda persona (ej. "tú, tu").
                            
                            Devuelve la respuesta en formato JSON con la siguiente estructura. El texto en "analisis_general" debe ser único y adaptado a la imagen proporcionada. Las demás propiedades deben ser arrays de objetos con los datos correspondientes.

                            {
                              "analisis_general": "Basándome en tu imagen, pareces tener un tono de piel <tono de piel> con subtonos <subtonos>, ojos <color de ojos> y cabello <color de cabello>. Esto te ubica en la estación de color <estación de color>. Tu forma de cuerpo parece ser <forma de cuerpo>, con <descripción de la forma>. Te recomiendo usar prendas que <recomendación de prendas>",
                              "entrevistas": [
                                {"nombre": "Azul Marino", "hex": "#000080"},
                                {"nombre": "Gris Carbón", "hex": "#36454F"},
                                {"nombre": "Blanco Roto", "hex": "#F5F5DC"},
                                {"nombre": "Verde Bosque", "hex": "#228B22"},
                                {"nombre": "Borgoña", "hex": "#800020"}
                              ],
                              "dia_a_dia": [
                                {"nombre": "Verde Oliva", "hex": "#6B8E23"},
                                {"nombre": "Naranja Quemado", "hex": "#CC5500"},
                                {"nombre": "Mostaza", "hex": "#FFDB58"},
                                {"nombre": "Turquesa", "hex": "#40E0D0"},
                                {"nombre": "Beige Cálido", "hex": "#F5F5DC"}
                              ],
                              "prendas_recomendadas": [
                                {
                                  "descripcion": "Un blazer de corte recto en color Gris Carbón para estilizar tu figura."
                                },
                                {
                                  "descripcion": "Un vestido en un tono Azul Marino con cuello en V para alargar tu torso."
                                },
                                {
                                  "descripcion": "Una blusa de seda en un tono Naranja Quemado combinada con pantalones de talle alto de color beige cálido para equilibrar tus proporciones."
                                }
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
            
            // Log de la respuesta cruda para depuración
            console.log("Respuesta cruda de la IA:", textResponse); 

            if (!textResponse) {
                setError("No se recibió una respuesta de la IA.");
                return;
            }

            try {
                // Elimina las etiquetas de código y caracteres de formato Markdown
                const cleanTextResponse = textResponse.replace(/```json\n|\n```|```/g, '').replace(/\*\*(.*?)\*\*/g, '$1');
                const jsonResponse = JSON.parse(cleanTextResponse);
                setResponse(jsonResponse);
        // Extract colors from the response for the chatbot
        if (jsonResponse.paleta_colores) {
            const colors = Object.values(jsonResponse.paleta_colores).flat();
            setRecommendedColors(colors);
        }
            } catch (parseError) {
                console.error("Error al parsear la respuesta JSON:", parseError);
                setError("La IA no devolvió un formato JSON válido. Intenta con otra imagen o revisa el prompt.");
            }

        } catch (err) {
            console.error("Error general en analyzeImage:", err);
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

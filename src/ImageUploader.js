import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Reemplaza "TU_CLAVE_AQUI" con tu clave de API de Gemini.
const API_KEY = "AIzaSyApwkRPpjCzIqnzZXBmXqDD86AtWsDjiKE";
const genAI = new GoogleGenerativeAI(API_KEY);

const styles = {
    container: {
        padding: '2.5rem',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        textAlign: 'center',
        maxWidth: '1200px',
        width: '95%',
        margin: '2rem auto',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.04)',
        border: '1px solid rgba(0, 0, 0, 0.05)',
    },
    title: {
        margin: '0 0 0.25rem 0',
        fontSize: '4rem',
        fontWeight: '800',
        letterSpacing: '-1.5px',
        display: 'inline-block',
        lineHeight: '1.1',
    },
    iaText: {
        background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        display: 'inline-block',
    },
    subtitle: {
        color: '#4b5563',
        fontSize: '1.5rem',
        maxWidth: '800px',
        margin: '0 auto 3rem',
        lineHeight: '1.5',
        fontWeight: '400',
    },
    uploadArea: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '30px',
    },
    fileInput: {
        marginBottom: '15px',
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
        margin: '1.5rem auto',
        textAlign: 'center',
        maxWidth: '100%',
        padding: '0 1rem',
    },
    previewTitle: {
        fontSize: '1.25rem',
        color: '#333',
        marginBottom: '0.75rem',
        fontWeight: '500',
    },
    imagePreview: {
        maxWidth: '100%',
        maxHeight: '300px',
        width: 'auto',
        height: 'auto',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        border: '1px solid rgba(0,0,0,0.05)',
        objectFit: 'contain',
        margin: '0 auto',
        display: 'block',
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
    colorPalette: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '1rem',
        margin: '1.5rem 0',
        padding: '0.5rem',
    },
    colorCard: {
        flex: '0 0 160px',
        maxWidth: '100%',
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
        backgroundColor: '#f8fafc',
        padding: '1.5rem',
        borderRadius: '12px',
        marginBottom: '1rem',
        borderLeft: '4px solid #3b82f6',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    },
    recommendationText: {
        flexGrow: 1,
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
            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash"
            });

            const prompt = `Actúa como tu estilista personal y experto en colorimetría. 
                      Por favor, haz el mejor análisis posible con la imagen que se te ha proporcionado.
                      Tienes que hablarle a la persona directamente usando la segunda persona (ej. "tú, tu").
                      Analiza la imagen e identifica el color de tu piel, ojos y cabello. Luego, basándote en estas características, determina tu estación de color y tu forma de cuerpo.
                      Con base en esta información, te daré recomendaciones que incluyan descripciones detalladas de prendas, pensando en que estas descripciones podrían usarse para generar una imagen de la prenda.

                      Devuelve la respuesta en formato JSON con la siguiente estructura:

                      {
                        "analisis_general": "Según tu tono de piel, el color de tus ojos y tu cabello, tu estación de color es Otoño. Tienes una piel clara con subtonos cálidos, ojos color avellana y cabello castaño claro con reflejos dorados. Tu forma de cuerpo es reloj de arena, con hombros y caderas proporcionadas y una cintura bien definida. Te recomiendo usar prendas que acentúen tu cintura y equilibren tus proporciones.",
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
                            "descripcion": "Un blazer de corte recto en color Gris Carbón para estilizar tu figura.",
                            "imagen_url": null 
                          },
                          {
                            "descripcion": "Un vestido en un tono Azul Marino con cuello en V para alargar tu torso.",
                            "imagen_url": null
                          },
                          {
                            "descripcion": "Una blusa de seda en un tono Naranja Quemado combinada con pantalones de talle alto de color beige cálido para equilibrar tus proporciones.",
                            "imagen_url": null
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
                // Elimina las etiquetas de código y parsea el JSON
                const jsonResponse = JSON.parse(textResponse.replace(/```json\n|\n```/g, ''));
                setResponse(jsonResponse);
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
                <span style={{ color: '#1a1a1a' }}>Esenc</span>
                <span style={styles.iaText}>IA</span>
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
        </div>
    );
}

export default ImageUploader;
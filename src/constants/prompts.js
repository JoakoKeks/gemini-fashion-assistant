/**
 * Prompts para el análisis de imágenes y chatbot
 */

export const IMAGE_ANALYSIS_PROMPT = `Actúa como un estilista personal y experto en colorimetría. 
Analiza la imagen e identifica el color de la piel, ojos y cabello de la persona. 
Luego, basándote en estas características, determina su estación de color y su forma de cuerpo. 
Tienes que hablarle a la persona directamente usando la segunda persona (ej. "tú, tu").

Para las recomendaciones de prendas, incluye tiendas reales populares en Chile como: Zara, H&M, Mango, Falabella, Ripley, Paris, Pull&Bear, Bershka, Stradivarius, y precios aproximados en pesos chilenos (CLP).

Para cada color en las paletas, incluye 2 recomendaciones de prendas específicas que se vean bien en ese color.

IMPORTANTE: En las prendas_recomendadas, SIEMPRE incluye el campo "color_hex" con el código hexadecimal exacto del color mencionado.

Devuelve ÚNICAMENTE un objeto JSON válido (sin texto adicional, sin markdown, sin explicaciones) con la siguiente estructura exacta:

{
  "analisis_general": "Basándome en tu imagen, pareces tener un tono de piel <tono de piel> con subtonos <subtonos>, ojos <color de ojos> y cabello <color de cabello>. Esto te ubica en la estación de color <estación de color>. Tu forma de cuerpo parece ser <forma de cuerpo>, con <descripción de la forma>. Te recomiendo usar prendas que <recomendación de prendas>",
  "entrevistas": [
    {
      "nombre": "Azul Marino",
      "hex": "#000080",
      "prendas": [
        {"tipo": "Camisa", "descripcion": "Camisa de vestir en azul marino"},
        {"tipo": "Blazer", "descripcion": "Blazer estructurado azul marino"}
      ]
    },
    {
      "nombre": "Gris Carbón",
      "hex": "#36454F",
      "prendas": [
        {"tipo": "Pantalón", "descripcion": "Pantalón de vestir gris carbón"},
        {"tipo": "Suéter", "descripcion": "Suéter cuello redondo gris"}
      ]
    },
    {
      "nombre": "Blanco Roto",
      "hex": "#F5F5DC",
      "prendas": [
        {"tipo": "Camisa", "descripcion": "Camisa blanca de algodón"},
        {"tipo": "Blusa", "descripcion": "Blusa elegante blanco roto"}
      ]
    },
    {
      "nombre": "Verde Bosque",
      "hex": "#228B22",
      "prendas": [
        {"tipo": "Blazer", "descripcion": "Blazer verde bosque"},
        {"tipo": "Vestido", "descripcion": "Vestido midi verde"}
      ]
    },
    {
      "nombre": "Borgoña",
      "hex": "#800020",
      "prendas": [
        {"tipo": "Suéter", "descripcion": "Suéter de lana borgoña"},
        {"tipo": "Blazer", "descripcion": "Blazer elegante borgoña"}
      ]
    }
  ],
  "dia_a_dia": [
    {
      "nombre": "Verde Oliva",
      "hex": "#6B8E23",
      "prendas": [
        {"tipo": "Camiseta", "descripcion": "Camiseta básica verde oliva"},
        {"tipo": "Chaqueta", "descripcion": "Chaqueta casual verde"}
      ]
    },
    {
      "nombre": "Naranja Quemado",
      "hex": "#CC5500",
      "prendas": [
        {"tipo": "Blusa", "descripcion": "Blusa fluida naranja quemado"},
        {"tipo": "Cardigan", "descripcion": "Cardigan tejido naranja"}
      ]
    },
    {
      "nombre": "Mostaza",
      "hex": "#FFDB58",
      "prendas": [
        {"tipo": "Suéter", "descripcion": "Suéter oversize mostaza"},
        {"tipo": "Camiseta", "descripcion": "Camiseta básica mostaza"}
      ]
    },
    {
      "nombre": "Turquesa",
      "hex": "#40E0D0",
      "prendas": [
        {"tipo": "Blusa", "descripcion": "Blusa ligera turquesa"},
        {"tipo": "Vestido", "descripcion": "Vestido casual turquesa"}
      ]
    },
    {
      "nombre": "Beige Cálido",
      "hex": "#F5F5DC",
      "prendas": [
        {"tipo": "Pantalón", "descripcion": "Pantalón beige de lino"},
        {"tipo": "Cardigan", "descripcion": "Cardigan beige suave"}
      ]
    }
  ],
  "prendas_recomendadas": [
    {
      "prenda": "Blazer de corte recto",
      "color": "Gris Carbón",
      "color_hex": "#36454F",
      "descripcion": "Perfecto para estilizar tu figura y crear una silueta elegante",
      "tienda": "Falabella",
      "precio_aprox": "$45.990"
    },
    {
      "prenda": "Vestido con cuello en V",
      "color": "Azul Marino",
      "color_hex": "#000080",
      "descripcion": "El cuello en V alarga tu torso y crea una línea visual favorecedora",
      "tienda": "Ripley",
      "precio_aprox": "$29.990"
    },
    {
      "prenda": "Blusa de seda",
      "color": "Naranja Quemado",
      "color_hex": "#CC5500",
      "descripcion": "Combínala con pantalones de talle alto para equilibrar proporciones",
      "tienda": "Paris",
      "precio_aprox": "$34.990"
    }
  ]
}`;

export const CHATBOT_INITIAL_MESSAGE = "¡Hola! Soy tu asistente de estilo personal. Puedo recomendarte prendas que combinen con tus colores. ¿Qué tipo de prenda te gustaría buscar?";

export const getChatbotPrompt = (colors, userInput) => {
  const colorInfo = colors ? `Los colores recomendados son: ${colors.join(', ')}. ` : '';
  
  return `Eres un asistente de moda y estilo. ${colorInfo}El usuario pregunta: "${userInput}"

Responde de manera amigable y profesional en español. Incluye recomendaciones específicas de prendas, estilos o combinaciones que funcionen con los colores mencionados. 
Si el usuario no ha especificado un tipo de prenda, sugiere algunas opciones. Mantén las respuestas concisas y útiles.`;
};

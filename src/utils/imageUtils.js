/**
 * Utilidades para manejo de imágenes
 */

/**
 * Convierte un archivo a base64
 * @param {File} file - Archivo de imagen
 * @returns {Promise<string>} - String base64 de la imagen
 */
export const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Limpia el texto de respuesta JSON eliminando markdown
 * @param {string} text - Texto con posible formato markdown
 * @returns {string} - Texto limpio
 */
export const cleanJsonResponse = (text) => {
  return text
    .replace(/```json\n|\n```|```/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .trim();
};

/**
 * Extrae todos los colores de la respuesta del análisis
 * @param {Object} jsonResponse - Respuesta JSON del análisis
 * @returns {Array} - Array de objetos de color
 */
export const extractColors = (jsonResponse) => {
  const allColors = [];
  if (jsonResponse.entrevistas) allColors.push(...jsonResponse.entrevistas);
  if (jsonResponse.dia_a_dia) allColors.push(...jsonResponse.dia_a_dia);
  return allColors;
};

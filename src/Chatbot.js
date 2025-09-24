import React, { useState, useRef, useEffect } from 'react';
import { getOllamaChatResponse } from './services/ollamaService';


const Chatbot = ({ colors, onClose }) => {
  const [messages, setMessages] = useState([
    {
      text: "¡Hola! Soy tu asistente de estilo personal. Puedo recomendarte prendas que combinen con tus colores. ¿Qué tipo de prenda te gustaría buscar?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const text = await getOllamaChatResponse(input, colors);

      setMessages(prev => [...prev, {
        text: text,
        sender: 'bot',
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Error al generar respuesta:', error);
      setMessages(prev => [...prev, {
        text: "Lo siento, ha ocurrido un error al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.",
        sender: 'bot',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={styles.chatbotContainer}>
      <div style={styles.chatbotHeader}>
        <div style={styles.chatbotTitle}>
          <span style={styles.chatbotIcon}>💬</span>
          <h3>Asistente de Estilo</h3>
        </div>
        <button onClick={onClose} style={styles.closeButton}>×</button>
      </div>
      
      <div style={styles.messagesContainer}>
        {messages.map((message, index) => (
          <div 
            key={index} 
            style={{
              ...styles.message,
              ...(message.sender === 'bot' ? styles.botMessage : styles.userMessage)
            }}
          >
            <div style={styles.messageContent}>
              {message.text.split('\n').map((line, i) => (
                <p key={i} style={{ margin: '4px 0' }}>{line}</p>
              ))}
            </div>
            <div style={styles.messageTime}>
              {formatTime(message.timestamp)}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ ...styles.message, ...styles.botMessage }}>
            <div style={styles.typingIndicator}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} style={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
          style={styles.input}
          disabled={isLoading}
        />
        <button 
          type="submit" 
          style={styles.sendButton}
          disabled={isLoading || !input.trim()}
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

const styles = {
  chatbotContainer: {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    width: '380px',
    maxWidth: '90vw',
    height: '600px',
    maxHeight: '80vh',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1000,
    overflow: 'hidden',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  chatbotHeader: {
    backgroundColor: '#7c3aed',
    color: 'white',
    padding: '1rem 1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatbotTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    margin: 0,
    fontSize: '1.1rem',
    fontWeight: 600,
  },
  chatbotIcon: {
    fontSize: '1.25rem',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '1.8rem',
    cursor: 'pointer',
    padding: '0 0.5rem',
    lineHeight: 1,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  message: {
    maxWidth: '85%',
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    fontSize: '0.95rem',
    lineHeight: '1.5',
    position: 'relative',
  },
  botMessage: {
    backgroundColor: '#f3f4f6',
    color: '#1f2937',
    alignSelf: 'flex-start',
    borderTopLeftRadius: '4px',
  },
  userMessage: {
    backgroundColor: '#7c3aed',
    color: 'white',
    alignSelf: 'flex-end',
    borderTopRightRadius: '4px',
  },
  messageContent: {
    wordBreak: 'break-word',
  },
  messageTime: {
    fontSize: '0.7rem',
    opacity: 0.8,
    marginTop: '4px',
    textAlign: 'right',
  },
  typingIndicator: {
    display: 'flex',
    gap: '4px',
    padding: '0.5rem 0',
    '& span': {
      width: '8px',
      height: '8px',
      backgroundColor: '#9ca3af',
      borderRadius: '50%',
      display: 'inline-block',
      animation: 'bounce 1.4s infinite ease-in-out both',
    },
    '& span:nth-child(1)': {
      animationDelay: '-0.32s',
    },
    '& span:nth-child(2)': {
      animationDelay: '-0.16s',
    },
    '@keyframes bounce': {
      '0%, 80%, 100%': { transform: 'scale(0.6)' },
      '40%': { transform: 'scale(1)' },
    },
  },
  inputContainer: {
    display: 'flex',
    padding: '1rem',
    borderTop: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
  },
  input: {
    flex: 1,
    padding: '0.75rem 1rem',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    '&:focus': {
      borderColor: '#7c3aed',
      boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.1)',
    },
  },
  sendButton: {
    marginLeft: '0.75rem',
    padding: '0 1.25rem',
    backgroundColor: '#7c3aed',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 500,
    transition: 'background-color 0.2s, transform 0.1s',
    '&:hover': {
      backgroundColor: '#6d28d9',
    },
    '&:active': {
      transform: 'scale(0.98)',
    },
    '&:disabled': {
      backgroundColor: '#d1d5db',
      cursor: 'not-allowed',
      transform: 'none',
    },
  },
};

export default Chatbot;

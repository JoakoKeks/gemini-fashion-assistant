import React, { useState, useRef, useEffect } from 'react';
import { generateChatResponse } from './services/geminiService';
import { CHATBOT_INITIAL_MESSAGE, getChatbotPrompt } from './constants/prompts';

const Chatbot = ({ colors, onClose }) => {
  const [messages, setMessages] = useState([
    {
      text: CHATBOT_INITIAL_MESSAGE,
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
      const colorNames = colors?.map(c => c.nombre) || [];
      const prompt = getChatbotPrompt(colorNames, input);
      const text = await generateChatResponse(prompt);

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
              <span className="typing-dot" style={styles.typingDot}></span>
              <span className="typing-dot" style={styles.typingDot}></span>
              <span className="typing-dot" style={styles.typingDot}></span>
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
    bottom: '0',
    right: '0',
    left: '0',
    top: '0',
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: '0',
    boxShadow: 'none',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1000,
    overflow: 'hidden',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  chatbotHeader: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  },
  chatbotTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    margin: 0,
    fontSize: '1rem',
    fontWeight: 600,
  },
  chatbotIcon: {
    fontSize: '1.1rem',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '0.25rem',
    lineHeight: 1,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    minWidth: '36px',
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    WebkitOverflowScrolling: 'touch',
  },
  message: {
    maxWidth: '85%',
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    fontSize: '0.9rem',
    lineHeight: '1.5',
    position: 'relative',
    wordWrap: 'break-word',
  },
  botMessage: {
    backgroundColor: '#f3f4f6',
    color: '#1f2937',
    alignSelf: 'flex-start',
    borderTopLeftRadius: '4px',
  },
  userMessage: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    alignSelf: 'flex-end',
    borderTopRightRadius: '4px',
  },
  messageContent: {
    wordBreak: 'break-word',
  },
  messageTime: {
    fontSize: '0.65rem',
    opacity: 0.7,
    marginTop: '4px',
    textAlign: 'right',
  },
  typingIndicator: {
    display: 'flex',
    gap: '4px',
    padding: '0.5rem 0',
  },
  typingDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#9ca3af',
    borderRadius: '50%',
    display: 'inline-block',
  },
  inputContainer: {
    display: 'flex',
    padding: '0.75rem 1rem',
    paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
    borderTop: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
    gap: '0.5rem',
  },
  input: {
    flex: 1,
    padding: '0.75rem 1rem',
    border: '1px solid #e5e7eb',
    borderRadius: '20px',
    fontSize: '0.9rem',
    outline: 'none',
    backgroundColor: 'white',
  },
  sendButton: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.9rem',
    whiteSpace: 'nowrap',
    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
  },
};

export default Chatbot;

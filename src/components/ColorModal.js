import React from 'react';

const ColorModal = ({ color, onClose }) => {
  if (!color) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeButton} onClick={onClose}>×</button>
        
        <div style={styles.header}>
          <div 
            style={{
              ...styles.colorCircle,
              backgroundColor: color.hex,
              background: `linear-gradient(135deg, ${color.hex} 0%, ${color.hex} 50%, ${color.hex}dd 100%)`
            }}
          ></div>
          <h2 style={styles.colorName}>{color.nombre}</h2>
          <p style={styles.colorHex}>{color.hex}</p>
        </div>

        <div style={styles.content}>
          <h3 style={styles.sectionTitle}>👔 Prendas Recomendadas</h3>
          {color.prendas && color.prendas.length > 0 ? (
            <div style={styles.prendasList}>
              {color.prendas.map((prenda, index) => (
                <div key={index} style={styles.prendaCard}>
                  <div style={styles.prendaIcon}>
                    {prenda.tipo === 'Camisa' && '👔'}
                    {prenda.tipo === 'Blazer' && '🧥'}
                    {prenda.tipo === 'Pantalón' && '👖'}
                    {prenda.tipo === 'Suéter' && '🧶'}
                    {prenda.tipo === 'Camiseta' && '👕'}
                    {prenda.tipo === 'Chaqueta' && '🧥'}
                    {prenda.tipo === 'Blusa' && '👚'}
                    {prenda.tipo === 'Cardigan' && '🧥'}
                    {prenda.tipo === 'Vestido' && '👗'}
                    {!['Camisa', 'Blazer', 'Pantalón', 'Suéter', 'Camiseta', 'Chaqueta', 'Blusa', 'Cardigan', 'Vestido'].includes(prenda.tipo) && '👕'}
                  </div>
                  <div style={styles.prendaInfo}>
                    <h4 style={styles.prendaTipo}>{prenda.tipo}</h4>
                    <p style={styles.prendaDescripcion}>{prenda.descripcion}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={styles.noPrendas}>No hay recomendaciones específicas para este color.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1001,
    padding: '1rem',
    backdropFilter: 'blur(4px)',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '20px',
    maxWidth: '500px',
    width: '100%',
    maxHeight: '80vh',
    overflowY: 'auto',
    position: 'relative',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    animation: 'slideUp 0.3s ease-out',
  },
  closeButton: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'rgba(0, 0, 0, 0.1)',
    border: 'none',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    fontSize: '1.5rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666',
    zIndex: 10,
  },
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '2rem 1.5rem',
    textAlign: 'center',
    borderRadius: '20px 20px 0 0',
  },
  colorCircle: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    margin: '0 auto 1rem',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
    border: '4px solid white',
  },
  colorName: {
    color: 'white',
    fontSize: '1.5rem',
    fontWeight: '700',
    margin: '0 0 0.5rem 0',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  },
  colorHex: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '0.9rem',
    fontFamily: 'monospace',
    margin: 0,
  },
  content: {
    padding: '1.5rem',
  },
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  prendasList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  prendaCard: {
    display: 'flex',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    border: '2px solid #e9ecef',
    transition: 'all 0.2s ease',
  },
  prendaIcon: {
    fontSize: '2rem',
    flexShrink: 0,
  },
  prendaInfo: {
    flex: 1,
  },
  prendaTipo: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1a1a1a',
    margin: '0 0 0.25rem 0',
  },
  prendaDescripcion: {
    fontSize: '0.9rem',
    color: '#6b7280',
    margin: 0,
    lineHeight: '1.5',
  },
  noPrendas: {
    textAlign: 'center',
    color: '#9ca3af',
    padding: '2rem',
    fontSize: '0.9rem',
  },
};

export default ColorModal;

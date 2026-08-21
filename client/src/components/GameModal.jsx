// client/src/components/GameModal.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Users, Smartphone } from 'lucide-react';
import '../styles/GameModal.css';


export default function GameModal({ isOpen, onClose, game, onStart }) {
  if (!isOpen || !game) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          style={{
            background: 'var(--bg-surface)',
            borderRadius: '20px',
            padding: '24px',
            width: '100%',
            maxWidth: '400px',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-pink)', fontWeight: 'bold', textTransform: 'uppercase' }}>{game.category}</span>
            <h2 style={{ fontSize: '1.5rem', color: 'white', marginTop: '4px' }}>{game.title}</h2>
          </div>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{game.description}</p>

          {/* Safe check for rules array */}
          {game.rules && game.rules.length > 0 && (
            <div style={{ background: 'var(--bg-base)', padding: '14px', borderRadius: '12px' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', marginBottom: '8px' }}>RULES</h4>
              <ul style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                {game.rules.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button 
              onClick={onClose}
              style={{ flex: 1, padding: '14px', borderRadius: '12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button 
              onClick={() => onStart(game)}
              style={{ flex: 1, padding: '14px', borderRadius: '12px', background: 'var(--accent-pink)', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Start Game
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

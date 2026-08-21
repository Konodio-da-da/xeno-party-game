// client/src/games/custom/KingsCupUI.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { singlePhoneGamesCatalog } from '../../data/singlePhoneGames';
import { triggerVibration, playSound } from '../../utils/soundManager';

export default function KingsCupUI() {
  const navigate = useNavigate();
  const gameData = singlePhoneGamesCatalog.kingsCup;
  const [deck, setDeck] = useState([]);
  const [activeCard, setActiveCard] = useState(null);

  useEffect(() => {
    resetDeck();
  }, []);

  const resetDeck = () => {
    const fullDeck = [];
    while (fullDeck.length < 52) {
      fullDeck.push(...gameData.prompts);
    }
    const shuffled = fullDeck.slice(0, 52).sort(() => Math.random() - 0.5);
    setDeck(shuffled.map((card, i) => ({ ...card, id: `card-${i}` })));
    setActiveCard(null);
  };

  const handleDrawCard = (cardId) => {
    if (activeCard) return;
    triggerVibration(30);
    playSound('swipe');
    const drawn = deck.find(c => c.id === cardId);
    setActiveCard(drawn);
    setDeck(deck.filter(c => c.id !== cardId));
  };

  const handleCloseCard = () => {
    playSound('swipe');
    setActiveCard(null);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: '85vh', position: 'relative', overflow: 'hidden' }}>
      
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', zIndex: 10 }}>
        <button onClick={() => navigate('/games')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ArrowLeft size={20} /> Library
        </button>
        <span style={{ fontSize: '0.75rem', color: 'var(--accent-pink)', fontWeight: 'bold', textTransform: 'uppercase' }}>{gameData.title}</span>
      </header>

      {/* The Ring of Cards */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {deck.length === 0 && !activeCard ? (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: 'var(--accent-cyan)' }}>Deck Empty!</h2>
            <button onClick={resetDeck} style={{ marginTop: '20px', padding: '14px 24px', borderRadius: '12px', background: 'var(--accent-pink)', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
              <RefreshCw size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Reshuffle
            </button>
          </div>
        ) : (
          deck.map((card, index) => {
            const angle = (index / deck.length) * 360;
            return (
              <motion.div
                key={card.id}
                onClick={() => handleDrawCard(card.id)}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1, rotate: angle }}
                whileHover={{ scale: 1.1, y: -10 }}
                style={{
                  position: 'absolute',
                  width: '50px',
                  height: '75px',
                  backgroundColor: 'var(--accent-cyan)',
                  border: '2px solid white',
                  borderRadius: '6px',
                  transformOrigin: 'bottom center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
                  marginTop: '-100px' 
                }}
              />
            );
          })
        )}
      </div>

      {/* The Revealed Card Popup - Wrapped in a full-screen flex container for guaranteed centering */}
      <AnimatePresence>
        {activeCard && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              backgroundColor: 'rgba(11, 11, 15, 0.85)', 
              zIndex: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <motion.div
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 50 }}
              style={{
                width: '100%',
                maxWidth: '320px',
                backgroundColor: 'var(--bg-surface)',
                border: '2px solid var(--accent-pink)',
                borderRadius: '20px',
                padding: '24px 20px',
                textAlign: 'center',
                boxShadow: '0 20px 50px rgba(0,0,0,0.9)'
              }}
            >
              <h2 style={{ fontSize: '1.8rem', color: 'var(--accent-cyan)', margin: '0 0 10px 0' }}>{activeCard.type}</h2>
              <p style={{ fontSize: '1.1rem', color: 'white', lineHeight: '1.4', marginBottom: '20px' }}>
                {activeCard.text}
              </p>
              <button 
                onClick={handleCloseCard}
                style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'var(--accent-pink)', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Confirm / Next
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

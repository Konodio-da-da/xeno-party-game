// client/src/games/LetsGetDrunk.jsx
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { usePlayerStore } from '../store/playerStore';
import '../styles/LetsGetDrunk.css';

export default function LetsGetDrunk() {
  const { deck, currentIndex, nextCard, shuffleDeck } = useGameStore();
  const { players } = usePlayerStore();
  
  const currentCard = deck[currentIndex];

  // Shuffle the deck when the game first loads
  useEffect(() => {
    shuffleDeck();
  }, [shuffleDeck]);

  // Helper function to replace [Player A] and [Player B] with real names
  const formatCardText = (text) => {
    if (!players || players.length === 0) return text;

    const p1 = players[Math.floor(Math.random() * players.length)];
    let p2 = players[Math.floor(Math.random() * players.length)];
    
    if (players.length > 1) {
      while (p2 === p1) {
        p2 = players[Math.floor(Math.random() * players.length)];
      }
    }

    return text
      .replace(/\[Player A\]/g, `**${p1}**`)
      .replace(/\[Player B\]/g, `**${p2}**`);
  };

  // Haptic trigger handler function
  const handleNext = () => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(40);
    }
    nextCard();
  };

  return (
    <div className="game-container">
      <div className="card-wrapper" onClick={handleNext}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard.id + currentIndex} 
            className="playing-card"
            initial={{ opacity: 0, x: 100, rotate: 10 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            exit={{ opacity: 0, x: -100, rotate: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <span className="card-type">{currentCard.type}</span>
            <p className="card-text">
              {formatCardText(currentCard.text).split('**').map((part, i) => 
                i % 2 === 1 ? <span key={i} style={{ color: 'var(--accent-cyan)' }}>{part}</span> : part
              )}
            </p>
            <span className="tap-hint">TAP CARD TO DRAW</span>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="controls">
        <button className="btn btn-primary" onClick={handleNext}>Next Card</button>
        <button className="btn" onClick={shuffleDeck}>Reshuffle</button>
      </div>
    </div>
  );
}

// client/src/games/custom/RussianRouletteUI.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayerStore } from '../../store/playerStore';
import { singlePhoneGamesCatalog } from '../../data/singlePhoneGames';
import { triggerVibration, playSound } from '../../utils/soundManager';
import { ArrowLeft, RefreshCw, Bomb } from 'lucide-react';

export default function RussianRouletteUI() {
  const navigate = useNavigate();
  const { players } = usePlayerStore();
  const gameData = singlePhoneGamesCatalog.russianRoulette;

  const GRID_SIZE = 12; // 3x4 grid
  const [bombIndex, setBombIndex] = useState(0);
  const [revealedCells, setRevealedCells] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [penaltyText, setPenaltyText] = useState('');

  // Setup the board
  useEffect(() => {
    resetBoard();
  }, []);

  const resetBoard = () => {
    setBombIndex(Math.floor(Math.random() * GRID_SIZE));
    setRevealedCells([]);
    setGameOver(false);
    setPenaltyText('');
  };

  const generatePenalty = () => {
    const penalties = [
      "BOOM! You found the bomb. Drink 4 sips.",
      "BOOM! Finish your drink immediately.",
      "BOOM! Take a shot.",
      "BOOM! You are the bomb. Give away 4 sips to anyone."
    ];
    return penalties[Math.floor(Math.random() * penalties.length)];
  };

  const handleCellClick = (index) => {
    if (gameOver || revealedCells.includes(index)) return;

    const newRevealed = [...revealedCells, index];
    setRevealedCells(newRevealed);

    if (index === bombIndex) {
      // Hit the bomb!
      triggerVibration([50, 100, 200]); // Huge explosion vibration
      playSound('buzzer');
      setGameOver(true);
      setPenaltyText(generatePenalty());
    } else {
      // Safe tap
      triggerVibration(20); // Light tap
      playSound('swipe');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: '85vh', justifyContent: 'space-between', position: 'relative' }}>
      
      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button onClick={() => navigate('/games')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ArrowLeft size={20} /> Library
        </button>
        <span style={{ fontSize: '0.75rem', color: 'var(--accent-pink)', fontWeight: 'bold', textTransform: 'uppercase' }}>{gameData.title}</span>
      </header>

      {/* Instructions */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.2rem', color: 'white' }}>Pass the phone.</h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Tap a square. Don't find the bomb.</p>
      </div>

      {/* The Minesweeper Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '12px', 
        flex: 1,
        alignContent: 'center'
      }}>
        {Array.from({ length: GRID_SIZE }).map((_, index) => {
          const isRevealed = revealedCells.includes(index);
          const isBomb = index === bombIndex;

          return (
            <motion.div
              key={index}
              onClick={() => handleCellClick(index)}
              animate={isRevealed ? (isBomb ? { scale: [1, 1.2, 1], rotate: [-10, 10, -10, 0] } : { scale: 0.95, opacity: 0.5 }) : { scale: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                aspectRatio: '1',
                backgroundColor: isRevealed ? (isBomb ? '#FF1E56' : 'var(--bg-base)') : 'var(--bg-surface)',
                border: isRevealed && isBomb ? '2px solid white' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isRevealed ? 'default' : 'pointer',
                boxShadow: isRevealed && isBomb ? '0 0 20px #FF1E56' : 'none'
              }}
            >
              {isRevealed && isBomb && <Bomb color="white" size={32} />}
            </motion.div>
          );
        })}
      </div>

      {/* Explosion Popup */}
      <AnimatePresence>
        {gameOver && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              right: '20px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '20px',
              padding: '24px',
              border: '2px solid var(--accent-pink)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
              textAlign: 'center',
              zIndex: 20
            }}
          >
            <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '10px' }}>{penaltyText}</h3>
            <button 
              onClick={resetBoard}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'var(--accent-pink)', border: 'none', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
            >
              <RefreshCw size={18} /> Play Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

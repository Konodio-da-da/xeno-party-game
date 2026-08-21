// client/src/games/custom/CardEngine.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCcw } from 'lucide-react';
import { singlePhoneGamesCatalog } from '../../data/singlePhoneGames';
import { triggerVibration, playSound } from '../../utils/soundManager';
import { usePlayerStore } from '../../store/playerStore';

export default function CardEngine({ gameId }) {
  const navigate = useNavigate();
  const gameData = singlePhoneGamesCatalog[gameId] || { title: 'XENO Game', prompts: [] };
  const players = usePlayerStore((state) => state.players);
  
  const [deck, setDeck] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [parsedText, setParsedText] = useState("");

  useEffect(() => {
    if (gameData.prompts.length > 0) {
      const shuffled = [...gameData.prompts].sort(() => Math.random() - 0.5);
      setDeck(shuffled);
    }
  }, [gameData]);

  const currentPrompt = deck[currentIndex];

  // Global Round-Robin Name Injector
  useEffect(() => {
    if (!currentPrompt) return;
    
    let rawText = typeof currentPrompt === 'string' ? currentPrompt : (currentPrompt.text || "");
    const activePlayers = (players || []).filter(p => p.trim() !== '');
    
    if (activePlayers.length > 0) {
      let pA = activePlayers[currentIndex % activePlayers.length];
      let pB = activePlayers[(currentIndex + 1) % activePlayers.length] || pA;
      let pC = activePlayers[(currentIndex + 2) % activePlayers.length] || pA;

      rawText = rawText
        .replace(/\[Player A\]/g, pA)
        .replace(/\[Player B\]/g, pB)
        .replace(/\[Player C\]/g, pC);
    }
    
    setParsedText(rawText);
  }, [currentIndex, currentPrompt, players]);

  const handleNextCard = () => {
    triggerVibration(30);
    playSound('swipe');
    setCurrentIndex((prev) => (prev + 1) % deck.length);
  };

  if (!currentPrompt) return null;

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: '85vh', justifyContent: 'space-between' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate('/games')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ArrowLeft size={20} /> Library
        </button>
        <span style={{ fontSize: '0.75rem', color: 'var(--accent-pink)', fontWeight: 'bold', textTransform: 'uppercase' }}>{gameData.title}</span>
      </header>

      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50, rotate: 5 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            exit={{ opacity: 0, x: -50, rotate: -5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{ width: '100%', height: '60%', backgroundColor: 'var(--bg-surface)', border: '2px solid var(--accent-cyan)', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '30px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', cursor: 'pointer' }}
            onClick={handleNextCard}
          >
            {currentPrompt.type && (
              <span style={{ fontSize: '0.9rem', color: 'var(--accent-pink)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold', marginBottom: '20px' }}>
                {currentPrompt.type}
              </span>
            )}
            <p style={{ fontSize: '1.4rem', lineHeight: '1.4', color: 'white' }}>
              {parsedText}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <button onClick={handleNextCard} style={{ width: '100%', padding: '16px', borderRadius: '14px', background: 'var(--accent-cyan)', color: 'var(--bg-base)', border: 'none', fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
        <RefreshCcw size={20} /> Next Card
      </button>
    </div>
  );
}

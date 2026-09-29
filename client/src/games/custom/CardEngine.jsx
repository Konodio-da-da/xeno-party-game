// client/src/games/custom/CardEngine.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCcw } from 'lucide-react';
import { singlePhoneGamesCatalog } from '../../data/singlePhoneGames';
import { adultGamesCatalog } from '../../data/adultGamesCatalog';
import { triggerVibration, playSound } from '../../utils/soundManager';
import { usePlayerStore } from '../../store/playerStore';

export default function CardEngine({ gameId, freakLevel = 'default' }) {
  const navigate = useNavigate();
  const players = usePlayerStore((state) => state.players);

  const gameData = singlePhoneGamesCatalog[gameId] || adultGamesCatalog?.[gameId] || { title: 'XENO Game', prompts: [] };
  
  const [deck, setDeck] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [parsedText, setParsedText] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    let rawPrompts = gameData.prompts || [];
    let promptsList = [];

    if (Array.isArray(rawPrompts)) {
      promptsList = rawPrompts;
    } else if (rawPrompts && typeof rawPrompts === 'object') {
      if (freakLevel === 'default') {
        // Combines spicy, spicier, and spiciest into one massive pool
        promptsList = Object.values(rawPrompts).flat();
      } else {
        promptsList = rawPrompts[freakLevel] || rawPrompts['spicy'] || Object.values(rawPrompts)[0] || [];
      }
    }

    if (promptsList.length > 0) {
      const shuffled = [...promptsList].sort(() => Math.random() - 0.5);
      setDeck(shuffled);
      setCurrentIndex(0);
      setShowAnswer(false);
    } else {
      setDeck([]);
    }
  }, [gameData, freakLevel]);

  const currentPrompt = deck[currentIndex];

  useEffect(() => {
    if (!currentPrompt) return;
    
    let rawText = typeof currentPrompt === 'string' 
      ? currentPrompt 
      : (currentPrompt.text || currentPrompt.q || currentPrompt.prompt || "");

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
    setShowAnswer(false);
  }, [currentIndex, currentPrompt, players]);

  const handleNextCard = () => {
    if (deck.length === 0) return;
    triggerVibration(30);
    playSound('swipe');
    setCurrentIndex((prev) => (prev + 1) % deck.length);
  };

  if (!currentPrompt) {
    return (
      <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', textAlign: 'center', color: 'white', paddingTop: '100px' }}>
        <p style={{ color: 'var(--text-muted)' }}>No cards found for this difficulty level.</p>
        <button onClick={() => navigate('/games')} style={{ marginTop: '20px', padding: '12px 24px', background: 'var(--accent-pink)', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
          Back to Vault
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: '85vh', justifyContent: 'space-between', paddingTop: '50px' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate('/games')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ArrowLeft size={20} /> Vault
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-pink)', fontWeight: 'bold', textTransform: 'uppercase' }}>{gameData.title}</span>
        </div>
      </header>

      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentIndex}-${freakLevel}`}
            initial={{ opacity: 0, x: 50, rotate: 5 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            exit={{ opacity: 0, x: -50, rotate: -5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{ 
              width: '100%', 
              minHeight: '65%', 
              backgroundColor: 'var(--bg-surface)', 
              border: '2px solid var(--accent-cyan)', 
              borderRadius: '24px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: '30px', 
              textAlign: 'center', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)', 
              cursor: 'pointer',
              userSelect: 'none'
            }}
            onClick={handleNextCard}
          >
            {currentPrompt.type && (
              <span style={{ fontSize: '0.9rem', color: 'var(--accent-pink)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold', marginBottom: '16px' }}>
                {currentPrompt.type}
              </span>
            )}
            
            <p style={{ fontSize: '1.35rem', lineHeight: '1.45', color: 'white', margin: 0 }}>
              {parsedText}
            </p>

            {currentPrompt.answer && (
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAnswer(!showAnswer);
                }}
                style={{ marginTop: '20px', padding: '8px 16px', background: 'rgba(255,255,255,0.06)', borderRadius: '10px', border: '1px dashed var(--accent-cyan)', cursor: 'pointer' }}
              >
                <span style={{ fontSize: '0.85rem', color: showAnswer ? '#10b981' : 'var(--accent-cyan)', fontWeight: 'bold' }}>
                  {showAnswer ? `Answer: ${currentPrompt.answer}` : 'Tap to Reveal Answer'}
                </span>
              </div>
            )}

            <span style={{ marginTop: '24px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Card {currentIndex + 1} of {deck.length} • Tap card to skip
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      <button onClick={handleNextCard} style={{ width: '100%', padding: '16px', borderRadius: '14px', background: 'var(--accent-cyan)', color: 'var(--bg-base)', border: 'none', fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
        <RefreshCcw size={20} /> Next Card
      </button>
    </div>
  );
}

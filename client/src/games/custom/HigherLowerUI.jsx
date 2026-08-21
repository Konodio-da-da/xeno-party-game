// client/src/games/custom/HigherLowerUI.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowUpCircle, ArrowDownCircle, Skull } from 'lucide-react';
import { singlePhoneGamesCatalog } from '../../data/singlePhoneGames';
import { triggerVibration, playSound } from '../../utils/soundManager';

const SUITS = ['♥', '♦', '♣', '♠'];
const VALUES = [
  { name: '2', val: 2 }, { name: '3', val: 3 }, { name: '4', val: 4 }, { name: '5', val: 5 }, 
  { name: '6', val: 6 }, { name: '7', val: 7 }, { name: '8', val: 8 }, { name: '9', val: 9 }, 
  { name: '10', val: 10 }, { name: 'J', val: 11 }, { name: 'Q', val: 12 }, { name: 'K', val: 13 }, { name: 'A', val: 14 }
];

export default function HigherLowerUI() {
  const navigate = useNavigate();
  const gameData = singlePhoneGamesCatalog.higherOrLower || { title: 'Higher or Lower' };
  
  const [deck, setDeck] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [streak, setStreak] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    generateDeck();
  }, []);

  const generateDeck = () => {
    let newDeck = [];
    SUITS.forEach(suit => {
      VALUES.forEach(v => {
        newDeck.push({ suit, name: v.name, val: v.val, color: (suit === '♥' || suit === '♦') ? '#FF1E56' : '#111' });
      });
    });
    newDeck = newDeck.sort(() => Math.random() - 0.5);
    setCurrentCard(newDeck.pop());
    setDeck(newDeck);
    setStreak(0);
    setFailed(false);
  };

  const handleGuess = (guessIsHigher) => {
    if (failed || deck.length === 0) return;

    const nextCard = deck.pop();
    setDeck([...deck]); // trigger re-render
    
    const isActuallyHigher = nextCard.val > currentCard.val;
    const isTie = nextCard.val === currentCard.val;

    if (isTie || (guessIsHigher === isActuallyHigher)) {
      // WIN
      playSound('success');
      triggerVibration(30);
      setStreak(s => s + 1);
      setCurrentCard(nextCard);
    } else {
      // LOSE
      playSound('buzzer');
      triggerVibration([100, 50, 200]);
      setCurrentCard(nextCard);
      setFailed(true);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: '85vh', justifyContent: 'space-between' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate('/games')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ArrowLeft size={20} /> Library
        </button>
        <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 'bold', textTransform: 'uppercase' }}>{gameData.title}</span>
      </header>

      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '5px' }}>Current Streak</p>
        <h2 style={{ fontSize: '2.5rem', color: 'white', margin: 0 }}>{streak}</h2>
      </div>

      {/* Realistic Card UI */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: '1000px' }}>
        <AnimatePresence mode="wait">
          {currentCard && (
            <motion.div
              key={currentCard.name + currentCard.suit}
              initial={{ rotateY: 90, scale: 0.8, opacity: 0 }}
              animate={{ rotateY: 0, scale: 1, opacity: 1 }}
              exit={{ rotateY: -90, scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                width: '200px', height: '300px', backgroundColor: 'white', borderRadius: '16px',
                boxShadow: '0 15px 35px rgba(0,0,0,0.5)', padding: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                color: currentCard.color, border: '1px solid rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', lineHeight: '1' }}>
                <div>{currentCard.name}</div>
                <div>{currentCard.suit}</div>
              </div>
              
              <div style={{ fontSize: '5rem', textAlign: 'center', alignSelf: 'center' }}>
                {currentCard.suit}
              </div>

              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', lineHeight: '1', transform: 'rotate(180deg)', alignSelf: 'flex-start' }}>
                <div>{currentCard.name}</div>
                <div>{currentCard.suit}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      {failed ? (
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#FF1E56', fontSize: '1.5rem', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Skull size={24} /> YOU DRINK {streak === 0 ? 1 : streak} SIPS!
          </h3>
          <button onClick={generateDeck} style={{ width: '100%', padding: '16px', borderRadius: '14px', background: 'var(--accent-cyan)', color: 'var(--bg-base)', border: 'none', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>
            Play Again
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={() => handleGuess(true)} style={{ flex: 1, padding: '20px', borderRadius: '16px', background: 'var(--accent-cyan)', color: 'var(--bg-base)', border: 'none', fontWeight: 'bold', fontSize: '1.2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
            <ArrowUpCircle size={28} /> HIGHER
          </button>
          <button onClick={() => handleGuess(false)} style={{ flex: 1, padding: '20px', borderRadius: '16px', background: 'var(--accent-pink)', color: 'white', border: 'none', fontWeight: 'bold', fontSize: '1.2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
            <ArrowDownCircle size={28} /> LOWER
          </button>
        </div>
      )}
    </div>
  );
}

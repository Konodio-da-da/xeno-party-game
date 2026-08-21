// client/src/games/custom/TriviaSurvivalUI.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock } from 'lucide-react';
import { singlePhoneGamesCatalog } from '../../data/singlePhoneGames';
import { triggerVibration, playSound } from '../../utils/soundManager';

export default function TriviaSurvivalUI() {
  const navigate = useNavigate();
  const gameData = singlePhoneGamesCatalog.brainFreeze; 
  
  const [deck, setDeck] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [isActive, setIsActive] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const shuffled = [...gameData.prompts].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
  }, [gameData]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
        playSound('swipe');
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      setFailed(true);
      playSound('buzzer');
      triggerVibration([100, 50, 300]);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const currentPrompt = deck[currentIndex];

  const handleStartTimer = () => {
    setIsActive(true);
    setFailed(false);
    setTimeLeft(5);
  };

  const handlePass = () => {
    if (!isActive) return;
    triggerVibration(30);
    playSound('success');
    setIsActive(false);
    setCurrentIndex((prev) => (prev + 1) % deck.length);
    setTimeLeft(5);
  };

  const handleNextRound = () => {
    setFailed(false);
    setIsActive(false);
    setCurrentIndex((prev) => (prev + 1) % deck.length);
    setTimeLeft(5);
  };

  if (!currentPrompt) return null;

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: '85vh', justifyContent: 'space-between', backgroundColor: failed ? '#FF1E56' : 'transparent', transition: 'background-color 0.3s ease' }}>
      
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate('/games')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ArrowLeft size={20} /> Library
        </button>
        <span style={{ fontSize: '0.75rem', color: failed ? 'white' : 'var(--accent-pink)', fontWeight: 'bold', textTransform: 'uppercase' }}>{gameData.title}</span>
      </header>

      {/* Timer Display */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <motion.div 
          animate={isActive ? { scale: [1, 1.1, 1] } : {}} 
          transition={{ repeat: Infinity, duration: 1 }}
          style={{ fontSize: '5rem', fontWeight: 'bold', color: failed ? 'white' : 'var(--accent-cyan)', textShadow: '0 0 20px rgba(0, 240, 255, 0.4)' }}
        >
          0:0{timeLeft}
        </motion.div>
      </div>

      {/* Prompt Card - Hidden until active */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', padding: '30px', backgroundColor: failed ? 'rgba(0,0,0,0.3)' : 'var(--bg-surface)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          {failed ? (
            <>
              <h2 style={{ fontSize: '2rem', color: 'white', marginBottom: '10px' }}>BRAIN FREEZE!</h2>
              <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)' }}>Time's up! Take a sip.</p>
            </>
          ) : !isActive ? (
            <>
              <h2 style={{ fontSize: '1.5rem', color: 'white', marginBottom: '10px' }}>Ready to Answer?</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Tap start to reveal the hidden challenge.</p>
            </>
          ) : (
            <>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>Challenge</span>
              <p style={{ fontSize: '1.4rem', lineHeight: '1.4', color: 'white', margin: '20px 0' }}>
                {currentPrompt.text || currentPrompt}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '10px' }}>
        {failed ? (
          <button onClick={handleNextRound} style={{ flex: 1, padding: '16px', borderRadius: '14px', background: 'white', color: '#FF1E56', border: 'none', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>
            Next Player
          </button>
        ) : !isActive ? (
          <button onClick={handleStartTimer} style={{ flex: 1, padding: '16px', borderRadius: '14px', background: 'var(--accent-cyan)', color: 'var(--bg-base)', border: 'none', fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <Clock size={20} /> Start Timer & Reveal
          </button>
        ) : (
          <button onClick={handlePass} style={{ flex: 1, padding: '16px', borderRadius: '14px', background: 'var(--accent-pink)', color: 'white', border: 'none', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>
            DONE! PASS IT!
          </button>
        )}
      </div>
    </div>
  );
}

// client/src/games/custom/SpinTheWheelUI.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayerStore } from '../../store/playerStore';
import { singlePhoneGamesCatalog } from '../../data/singlePhoneGames';
import { triggerVibration, playSound } from '../../utils/soundManager';
import { ArrowLeft, Play } from 'lucide-react';

export default function SpinTheWheelUI() {
  const navigate = useNavigate();
  const { players } = usePlayerStore();
  const gameData = singlePhoneGamesCatalog.spinTheWheel;

  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedResult, setSelectedResult] = useState(null);
  const [showResult, setShowResult] = useState(false);

  // Reusable text formatting for inserting player names
  const formatText = (text) => {
    if (!players || players.length === 0) return text;
    const p1 = players[Math.floor(Math.random() * players.length)];
    let p2 = players[Math.floor(Math.random() * players.length)];
    if (players.length > 1) {
      while (p2 === p1) p2 = players[Math.floor(Math.random() * players.length)];
    }
    return text
      .replace(/\[Player A\]/g, `**${p1}**`)
      .replace(/\[Player B\]/g, `**${p2}**`)
      .replace(/\[Player C\]/g, `**${players[Math.floor(Math.random() * players.length)]}**`);
  };

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setShowResult(false);
    playSound('swipe'); // Initial spin sound
    triggerVibration([20, 30, 20]); 

    // Calculate a random rotation: At least 5 full spins (1800deg) + random stopping angle
    const extraSpins = 1800; 
    const randomStopAngle = Math.floor(Math.random() * 360);
    const newRotation = rotation + extraSpins + randomStopAngle;

    setRotation(newRotation);

    // Wait for the animation to finish (set to 3 seconds below)
    setTimeout(() => {
      setIsSpinning(false);
      playSound('success');
      triggerVibration(50); // Hard buzz on stop

      // Pick a random prompt from the catalog
      const prompts = gameData.prompts;
      const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
      
      setSelectedResult(randomPrompt);
      setShowResult(true);
    }, 3000); 
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: '85vh', justifyContent: 'space-between', position: 'relative' }}>
      
      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
        <button onClick={() => navigate('/games')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ArrowLeft size={20} /> Library
        </button>
        <span style={{ fontSize: '0.75rem', color: 'var(--accent-pink)', fontWeight: 'bold', textTransform: 'uppercase' }}>{gameData.title}</span>
      </header>

      {/* The Wheel Container */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        
        {/* The Pointer */}
        <div style={{ 
          position: 'absolute', 
          top: '15%', 
          zIndex: 5,
          width: 0, 
          height: 0, 
          borderLeft: '20px solid transparent',
          borderRight: '20px solid transparent',
          borderTop: '35px solid var(--accent-pink)',
          filter: 'drop-shadow(0px 4px 4px rgba(0,0,0,0.5))'
        }}></div>

        {/* The Animated Wheel */}
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ type: 'tween', duration: 3, ease: 'circOut' }}
          style={{
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            // Creates a visually distinct roulette wheel using conic gradients
            background: 'conic-gradient(var(--accent-cyan) 0deg 45deg, var(--bg-surface) 45deg 90deg, var(--accent-pink) 90deg 135deg, var(--bg-surface) 135deg 180deg, var(--accent-cyan) 180deg 225deg, var(--bg-surface) 225deg 270deg, var(--accent-pink) 270deg 315deg, var(--bg-surface) 315deg 360deg)',
            border: '8px solid var(--bg-base)',
            boxShadow: '0 0 30px rgba(0, 240, 255, 0.2), inset 0 0 20px rgba(0,0,0,0.8)',
            position: 'relative'
          }}
        >
          {/* Inner center circle */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '40px',
            height: '40px',
            backgroundColor: 'var(--bg-base)',
            borderRadius: '50%',
            border: '4px solid white',
            zIndex: 2
          }}></div>
        </motion.div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '10px', zIndex: 10 }}>
        <button 
          onClick={handleSpin} 
          disabled={isSpinning}
          style={{ 
            flex: 1, padding: '16px', borderRadius: '12px', background: isSpinning ? 'var(--text-muted)' : 'var(--accent-cyan)', 
            color: 'var(--bg-base)', border: 'none', fontWeight: 'bold', fontSize: '1.2rem', 
            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
            cursor: isSpinning ? 'default' : 'pointer', transition: 'all 0.2s ease',
            boxShadow: isSpinning ? 'none' : '0 4px 15px rgba(0, 240, 255, 0.4)'
          }}
        >
          {isSpinning ? 'SPINNING...' : <><Play fill="currentColor" size={20} /> SPIN</>}
        </button>
      </div>

      {/* Result Overlay Popup */}
      <AnimatePresence>
        {showResult && selectedResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            style={{
              position: 'absolute',
              top: '20%',
              left: '20px',
              right: '20px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '20px',
              padding: '30px 20px',
              border: '2px solid var(--accent-pink)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
              textAlign: 'center',
              zIndex: 20
            }}
          >
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>
              {selectedResult.type}
            </span>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.5', color: 'white', margin: '20px 0' }}>
              {formatText(selectedResult.text).split('**').map((part, i) =>
                i % 2 === 1 ? <span key={i} style={{ color: 'var(--accent-pink)', fontWeight: 'bold' }}>{part}</span> : part
              )}
            </p>
            <button 
              onClick={() => setShowResult(false)}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'transparent', border: '1px solid var(--text-muted)', color: 'white', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

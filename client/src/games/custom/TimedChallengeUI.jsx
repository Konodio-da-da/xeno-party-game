// client/src/games/custom/TimedChallengeUI.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, RefreshCcw } from 'lucide-react';
import { singlePhoneGamesCatalog } from '../../data/singlePhoneGames';
import { triggerVibration, playSound } from '../../utils/soundManager';

export default function TimedChallengeUI({ gameId }) {
  const navigate = useNavigate();
  const gameData = singlePhoneGamesCatalog[gameId] || { title: 'Challenge', prompts: [] };
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10); // 7-second standard pressure timer
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((t) => t - 1);
        playSound('swipe');
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      setIsFinished(true);
      playSound('buzzer');
      triggerVibration([80, 40, 200]);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const currentPrompt = gameData.prompts[currentIndex] || { text: "Perform the challenge!" };

  const handleStart = () => {
    setIsActive(true);
    setIsFinished(false);
    setTimeLeft(10);
  };

  const handleNext = () => {
    setIsActive(false);
    setIsFinished(false);
    setTimeLeft(10);
    setCurrentIndex((prev) => (prev + 1) % gameData.prompts.length);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: '85vh', justifyContent: 'space-between' }}>
      
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate('/games')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ArrowLeft size={20} /> Library
        </button>
        <span style={{ fontSize: '0.75rem', color: 'var(--accent-pink)', fontWeight: 'bold', textTransform: 'uppercase' }}>{gameData.title}</span>
      </header>

      {/* Timer Circle */}
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <motion.div 
          animate={isActive ? { scale: [1, 1.08, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1 }}
          style={{ fontSize: '4.5rem', fontWeight: 'bold', color: isFinished ? '#FF1E56' : 'var(--accent-cyan)' }}
        >
          0:0{timeLeft}
        </motion.div>
      </div>

      {/* Challenge Card */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', padding: '30px', backgroundColor: 'var(--bg-surface)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          {isFinished ? (
            <>
              <h2 style={{ fontSize: '2rem', color: '#FF1E56', marginBottom: '10px' }}>TIME UP!</h2>
              <p style={{ fontSize: '1.1rem', color: 'white' }}>You failed the 10-second clock! Drink!</p>
            </>
          ) : !isActive ? (
            <>
              <h2 style={{ fontSize: '1.3rem', color: 'white', marginBottom: '10px' }}>Ready?</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Hit start to reveal and trigger the 10-second countdown.</p>
            </>
          ) : (
            <>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-pink)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>Action Required</span>
              <p style={{ fontSize: '1.4rem', lineHeight: '1.4', color: 'white', margin: '20px 0' }}>
                {currentPrompt.text || currentPrompt}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div>
        {!isActive && !isFinished ? (
          <button onClick={handleStart} style={{ width: '100%', padding: '16px', borderRadius: '14px', background: 'var(--accent-cyan)', color: 'var(--bg-base)', border: 'none', fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <Play size={20} /> START 10S TIMER
          </button>
        ) : (
          <button onClick={handleNext} style={{ width: '100%', padding: '16px', borderRadius: '14px', background: 'var(--accent-pink)', color: 'white', border: 'none', fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <RefreshCcw size={20} /> NEXT CHALLENGE
          </button>
        )}
      </div>
    </div>
  );
}

// client/src/games/custom/CharadesUI.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, XCircle, CheckCircle2 } from 'lucide-react';
import { singlePhoneGamesCatalog } from '../../data/singlePhoneGames';
import { triggerVibration, playSound } from '../../utils/soundManager';

export default function CharadesUI() {
  const navigate = useNavigate();
  const gameData = singlePhoneGamesCatalog.charades || { title: 'Charades', prompts: [] };
  
  const [deck, setDeck] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (gameData.prompts.length > 0) {
      const shuffled = [...gameData.prompts].sort(() => Math.random() - 0.5);
      setDeck(shuffled);
    }
  }, [gameData]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      playSound('buzzer');
      triggerVibration([100, 50, 300]);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const currentPrompt = deck[currentIndex];

  const startGame = () => {
    setIsActive(true);
    setScore(0);
    setTimeLeft(60);
  };

  const handleCorrect = () => {
    if (!isActive) return;
    playSound('success');
    triggerVibration(30);
    setScore(s => s + 1);
    setCurrentIndex((prev) => (prev + 1) % deck.length);
  };

  const handlePass = () => {
    if (!isActive) return;
    playSound('swipe');
    triggerVibration(20);
    setCurrentIndex((prev) => (prev + 1) % deck.length);
  };

  // Exit back to library
  const handleExit = () => {
    setIsActive(false);
    navigate('/games');
  };

  if (!currentPrompt) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: timeLeft === 0 ? '#FF1E56' : 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', zIndex: 9999 }}>
      
      {/* 90-Degree rotation wrapper to force landscape visually on mobile */}
      <div style={{ transform: 'rotate(90deg)', width: '100vh', height: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={handleExit} style={{ background: 'rgba(255,255,255,0.2)', padding: '10px 20px', borderRadius: '20px', border: 'none', color: 'white', fontWeight: 'bold' }}>Quit</button>
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>{timeLeft}s</span>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>Score: {score}</span>
        </header>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 20px' }}>
          {!isActive && timeLeft === 60 ? (
            <div>
              <h1 style={{ fontSize: '3rem', color: 'white', marginBottom: '20px' }}>Hold phone to forehead!</h1>
              <button onClick={startGame} style={{ padding: '20px 40px', fontSize: '1.5rem', borderRadius: '20px', backgroundColor: 'var(--accent-cyan)', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                <Play size={30} /> START 60s
              </button>
            </div>
          ) : !isActive && timeLeft === 0 ? (
            <div>
              <h1 style={{ fontSize: '4rem', color: 'white', marginBottom: '10px' }}>TIME UP!</h1>
              <h2 style={{ fontSize: '2rem', color: 'white' }}>You got {score} correct!</h2>
              <button onClick={startGame} style={{ marginTop: '30px', padding: '15px 30px', fontSize: '1.2rem', borderRadius: '15px', backgroundColor: 'white', color: '#FF1E56', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                Play Again
              </button>
            </div>
          ) : (
            <h1 style={{ fontSize: '4.5rem', color: 'white', fontWeight: '900', textTransform: 'uppercase', lineHeight: '1.2' }}>
              {currentPrompt.text || currentPrompt}
            </h1>
          )}
        </div>

        {/* Side-by-side massive controls for the holder to blindly tap */}
        {isActive && (
           <div style={{ display: 'flex', gap: '20px', height: '120px' }}>
             <button onClick={handlePass} style={{ flex: 1, backgroundColor: 'rgba(255, 30, 86, 0.8)', border: 'none', borderRadius: '20px', color: 'white', fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
               <XCircle size={40} /> PASS
             </button>
             <button onClick={handleCorrect} style={{ flex: 1, backgroundColor: 'rgba(16, 185, 129, 0.8)', border: 'none', borderRadius: '20px', color: 'white', fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
               <CheckCircle2 size={40} /> CORRECT
             </button>
           </div>
        )}
      </div>
    </div>
  );
}

// client/src/games/custom/ParanoiaUI.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCcw, CircleDollarSign } from 'lucide-react';
import { singlePhoneGamesCatalog } from '../../data/singlePhoneGames';
import { triggerVibration, playSound } from '../../utils/soundManager';
import { usePlayerStore } from '../../store/playerStore'; // <-- Pull in the players

export default function ParanoiaUI() {
  const navigate = useNavigate();
  const gameData = singlePhoneGamesCatalog.paranoia;
  const players = usePlayerStore((state) => state.players); // <-- Get active players
  
  const [deck, setDeck] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [coinState, setCoinState] = useState('idle');
  const [parsedText, setParsedText] = useState(""); // Holds the text with real names

  useEffect(() => {
    if (gameData && gameData.prompts) {
      const shuffled = [...gameData.prompts].sort(() => Math.random() - 0.5);
      setDeck(shuffled);
    }
  }, [gameData]);

  const currentPrompt = deck[currentIndex];

  // Dynamically inject player names whenever the prompt changes
  useEffect(() => {
    if (!currentPrompt) return;
    
    let rawText = currentPrompt.text || currentPrompt;
    
    // Fallbacks just in case players array is empty
    let pA = "Player 1";
    let pB = "Player 2";

    // If we have real players, shuffle them and pick two random distinct ones
    if (players && players.length >= 2) {
      const activePlayers = players.filter(p => p.trim() !== '');
      const shuffledPlayers = [...activePlayers].sort(() => Math.random() - 0.5);
      pA = shuffledPlayers[0] || "Player A";
      pB = shuffledPlayers[1] || "Player B";
    }

    // Replace the placeholders with the real names
    let finalString = rawText.replace(/\[Player A\]/g, pA).replace(/\[Player B\]/g, pB);
    setParsedText(finalString);

  }, [currentIndex, currentPrompt, players]);

  const handleFlipCoin = () => {
    if (coinState === 'flipping') return;
    
    setCoinState('flipping');
    playSound('swipe');
    triggerVibration(50);

    setTimeout(() => {
      const isHeads = Math.random() > 0.5;
      setCoinState(isHeads ? 'heads' : 'tails');
      triggerVibration(isHeads ? [50, 50, 50] : 100);
      playSound(isHeads ? 'buzzer' : 'success'); 
    }, 1500);
  };

  const handleNextRound = () => {
    setCoinState('idle');
    setCurrentIndex((prev) => (prev + 1) % deck.length);
  };

  if (!currentPrompt) return null;

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: '85vh', justifyContent: 'space-between' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate('/games')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ArrowLeft size={20} /> Library
        </button>
        <span style={{ fontSize: '0.75rem', color: 'var(--accent-pink)', fontWeight: 'bold', textTransform: 'uppercase' }}>{gameData?.title || 'Paranoia'}</span>
      </header>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
        
        {/* Prompt Card */}
        <div style={{ width: '100%', padding: '30px', backgroundColor: 'var(--bg-surface)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>Whisper To Someone</span>
          
          {/* Render the dynamically injected text */}
          <p style={{ fontSize: '1.4rem', lineHeight: '1.4', color: 'white', margin: '20px 0' }}>
            {parsedText}
          </p>
          
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>They must point at the person who fits this description.</p>
        </div>

        {/* Coin Flip Area */}
        <div style={{ width: '100%', padding: '20px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '20px', textAlign: 'center', minHeight: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {coinState === 'idle' ? (
            <button onClick={handleFlipCoin} style={{ padding: '16px 24px', borderRadius: '16px', background: '#FFD700', color: '#000', border: 'none', fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <CircleDollarSign size={20} /> FLIP COIN TO REVEAL
            </button>
          ) : (
            <motion.div 
              animate={coinState === 'flipping' ? { rotateY: 1080, scale: [1, 1.2, 1] } : { rotateY: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: coinState === 'heads' ? '#FF1E56' : coinState === 'tails' ? 'var(--accent-cyan)' : '#FFD700', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid white', boxShadow: '0 10px 20px rgba(0,0,0,0.5)' }}
            >
              {coinState === 'flipping' ? (
                <CircleDollarSign size={50} color="#000" />
              ) : (
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', textShadow: '1px 1px 2px #000' }}>
                  {coinState === 'heads' ? 'HEADS' : 'TAILS'}
                </span>
              )}
            </motion.div>
          )}

          {coinState === 'heads' && <p className="animate-fade-in" style={{ color: '#FF1E56', fontWeight: 'bold', marginTop: '15px', fontSize: '1.1rem' }}>REVEAL THE QUESTION OUT LOUD!</p>}
          {coinState === 'tails' && <p className="animate-fade-in" style={{ color: 'var(--accent-cyan)', fontWeight: 'bold', marginTop: '15px', fontSize: '1.1rem' }}>SECRET IS SAFE. DON'T TELL!</p>}
        </div>

      </div>

      <button onClick={handleNextRound} style={{ width: '100%', padding: '16px', borderRadius: '14px', background: 'var(--accent-pink)', color: 'white', border: 'none', fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
        <RefreshCcw size={20} /> Next Player
      </button>
    </div>
  );
}

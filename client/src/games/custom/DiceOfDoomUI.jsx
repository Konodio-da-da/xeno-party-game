// client/src/games/custom/DiceOfDoomUI.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCcw, Dices, Trophy, AlertTriangle } from 'lucide-react';
import { singlePhoneGamesCatalog } from '../../data/singlePhoneGames';
import { triggerVibration, playSound } from '../../utils/soundManager';
import { usePlayerStore } from '../../store/playerStore';

export default function DiceOfDoomUI() {
  const navigate = useNavigate();
  const gameData = singlePhoneGamesCatalog.diceOfDoom;
  const players = usePlayerStore((state) => state.players).filter(p => p.trim() !== '');
  
  // Active game sequence state
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [playerRolls, setPlayerRolls] = useState({}); // Stores { "PlayerName": rollValue }
  const [isRolling, setIsRolling] = useState(false);
  const [currentDiceFace, setCurrentDiceFace] = useState(1);
  const [roundComplete, setRoundComplete] = useState(false);
  const [loserInfo, setLoserInfo] = useState({ name: '', roll: 0, punishment: '' });

  const activePlayer = players[activePlayerIndex] || "Player 1";

  const rollDice = () => {
    if (isRolling || roundComplete) return;
    
    setIsRolling(true);
    playSound('swipe');
    triggerVibration([30, 30, 30]);

    // Simulate dice rolling animation
    setTimeout(() => {
      const rolledValue = Math.floor(Math.random() * 6) + 1;
      setCurrentDiceFace(rolledValue);
      setIsRolling(false);
      playSound('success');
      triggerVibration(100);

      // Lock in this player's roll
      const updatedRolls = { ...playerRolls, [activePlayer]: rolledValue };
      setPlayerRolls(updatedRolls);

      // Check if there are more players left to roll
      if (activePlayerIndex < players.length - 1) {
        // Move to next player after a brief pause
        setTimeout(() => {
          setActivePlayerIndex(prev => prev + 1);
        }, 800);
      } else {
        // All players have rolled! Evaluate results.
        evaluateDoom(updatedRolls);
      }
    }, 1200);
  };

  const evaluateDoom = (finalRolls) => {
    let lowestPlayer = players[0];
    let lowestScore = finalRolls[lowestPlayer];

    // Find the player with the lowest score
    players.forEach(p => {
      if (finalRolls[p] < lowestScore) {
        lowestScore = finalRolls[p];
        lowestPlayer = p;
      }
    });

    // Pick a random doom punishment from the list
    const punishments = gameData.punishments || [
      "Take 4 sips while standing on one foot.",
      "Down your entire drink immediately.",
      "Let the group write a word on your forehead."
    ];
    const randomPunishment = punishments[Math.floor(Math.random() * punishments.length)];

    setLoserInfo({
      name: lowestPlayer,
      roll: lowestScore,
      punishment: randomPunishment
    });
    setRoundComplete(true);
  };

  const handleNextRound = () => {
    setActivePlayerIndex(0);
    setPlayerRolls({});
    setCurrentDiceFace(1);
    setRoundComplete(false);
    setLoserInfo({ name: '', roll: 0, punishment: '' });
  };

  // Helper to render dots on the dice face
  const renderDiceDots = (value) => {
    const dots = Array(value).fill(0);
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', width: '50px', height: '50px', placeItems: 'center' }}>
        {dots.map((_, i) => (
          <div key={i} style={{ width: '12px', height: '12px', backgroundColor: '#FF1E56', borderRadius: '50%', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)' }} />
        ))}
      </div>
    );
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: '85vh', justifyContent: 'space-between' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate('/games')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ArrowLeft size={20} /> Library
        </button>
        <span style={{ fontSize: '0.75rem', color: 'var(--accent-pink)', fontWeight: 'bold', textTransform: 'uppercase' }}>{gameData?.title || 'Dice of Doom'}</span>
      </header>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
        
        {!roundComplete ? (
          <>
            {/* Turn Announcement */}
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>Current Turn</span>
              <h2 style={{ fontSize: '1.8rem', color: 'white', margin: '5px 0 0 0' }}>{activePlayer}'s Roll</h2>
            </div>

            {/* Dice Area */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
              <motion.div
                onClick={!isRolling ? rollDice : undefined}
                animate={isRolling ? { rotateX: 720, rotateY: 720, scale: [1, 1.2, 1] } : { rotateX: 0, rotateY: 0 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                style={{ 
                  width: '110px', height: '110px', backgroundColor: '#fff', borderRadius: '24px', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  boxShadow: isRolling ? '0 0 30px var(--accent-cyan)' : 'inset -5px -5px 15px rgba(0,0,0,0.2), 0 10px 20px rgba(0,0,0,0.5)',
                  cursor: isRolling ? 'not-allowed' : 'pointer', transformStyle: 'preserve-3d'
                }}
              >
                {isRolling ? <Dices size={45} color="var(--accent-cyan)" className="animate-pulse" /> : renderDiceDots(currentDiceFace)}
              </motion.div>
              
              {!isRolling && <p style={{ color: 'var(--accent-cyan)', fontWeight: 'bold', fontSize: '0.9rem', letterSpacing: '1px' }}>TAP DICE TO LOCK ROLL</p>}
            </div>

            {/* Locked Rolls Tracker Card */}
            <div style={{ width: '100%', backgroundColor: 'var(--bg-surface)', padding: '15px 20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px', margin: '0 0 8px 0' }}>Round Rolls Progress</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {players.map((p, idx) => {
                  const hasRolled = playerRolls[p] !== undefined;
                  const isCurrent = idx === activePlayerIndex;
                  return (
                    <div key={p} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', color: isCurrent ? 'var(--accent-pink)' : 'white' }}>
                      <span style={{ fontWeight: isCurrent ? 'bold' : 'normal' }}>{p} {isCurrent && '👈'}</span>
                      <span style={{ color: hasRolled ? '#10b981' : 'var(--text-muted)' }}>
                        {hasRolled ? `Rolled: ${playerRolls[p]} 🎯` : 'Waiting...'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          /* Round Over / Verdict Card */
          <div style={{ width: '100%', backgroundColor: 'rgba(255, 30, 86, 0.1)', border: '2px solid var(--accent-pink)', padding: '25px', borderRadius: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--accent-pink)' }}>
              <AlertTriangle size={40} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-pink)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>Round Verdict</span>
              <h3 style={{ fontSize: '1.4rem', color: 'white', margin: '5px 0' }}>{loserInfo.name} Rolled Lowest ({loserInfo.roll})!</h3>
            </div>
            <div style={{ background: 'var(--bg-surface)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 5px 0' }}>Doom Punishment:</p>
              <p style={{ fontSize: '1rem', color: 'white', fontWeight: 'bold', margin: 0 }}>{loserInfo.punishment}</p>
            </div>
          </div>
        )}

      </div>

      {/* Action Footer Button */}
      {roundComplete ? (
        <button onClick={handleNextRound} style={{ width: '100%', padding: '16px', borderRadius: '14px', background: 'var(--accent-pink)', color: 'white', border: 'none', fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <RefreshCcw size={20} /> Next Round
        </button>
      ) : (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Pass the phone around sequentially.
        </div>
      )}
    </div>
  );
}

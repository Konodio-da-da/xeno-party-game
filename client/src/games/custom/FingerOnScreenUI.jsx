// client/src/games/custom/FingerOnScreenUI.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCcw, AlertTriangle } from 'lucide-react';
import { usePlayerStore } from '../../store/playerStore';
import { triggerVibration, playSound } from '../../utils/soundManager';

export default function FingerOnScreenUI() {
  const navigate = useNavigate();
  // Fetch only active players
  const players = usePlayerStore((state) => state.players).filter(p => p.trim() !== '');
  
  const [activeTouches, setActiveTouches] = useState(new Set());
  const [gameState, setGameState] = useState('waiting'); // waiting, ready, countdown, red, result
  const [loser, setLoser] = useState(null);
  const [loserReason, setLoserReason] = useState("");
  const [releaseOrder, setReleaseOrder] = useState([]);
  
  const timerRef = useRef(null);

  // Cleanup timers if unmounted
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  // GAME LOGIC 1: Wait for all fingers to touch
  useEffect(() => {
    if (gameState === 'waiting' && activeTouches.size === players.length && players.length >= 2) {
      setGameState('ready');
      playSound('success');
      triggerVibration(50);
      
      // Brief pause, then start suspense timer
      timerRef.current = setTimeout(() => {
        setGameState('countdown');
        
        // Random time between 2 to 6 seconds before it goes RED
        const randomDelay = Math.floor(Math.random() * 4000) + 2000;
        
        timerRef.current = setTimeout(() => {
          setGameState('red');
          playSound('buzzer');
          triggerVibration([100, 100, 100, 100]); 
        }, randomDelay);
        
      }, 1000);
    }
  }, [activeTouches, gameState, players.length]);

  // GAME LOGIC 2: Check who lost during the RED state
  useEffect(() => {
    if (gameState === 'red') {
      const playersWhoReleased = releaseOrder.length;
      
      // If everyone EXCEPT ONE person has released, the slowpoke loses
      if (playersWhoReleased === players.length - 1) {
        const slowpoke = players.find(p => !releaseOrder.includes(p));
        setLoser(slowpoke);
        setLoserReason("Slowest reflexes! You were the last to let go.");
        setGameState('result');
      } 
      // Failsafe: if everyone releases simultaneously, grab the absolute last one recorded
      else if (playersWhoReleased === players.length) {
        setLoser(releaseOrder[releaseOrder.length - 1]);
        setLoserReason("You were the last one to let go.");
        setGameState('result');
      }
    }
  }, [releaseOrder, gameState, players]);

  // Handle a player touching their spot
  const handleTouchStart = (playerName, e) => {
    if (gameState === 'result') return;
    
    setActiveTouches(prev => {
      const next = new Set(prev);
      next.add(playerName);
      return next;
    });
  };

  // Handle a player lifting their finger
  const handleTouchEnd = (playerName, e) => {
    setActiveTouches(prev => {
      const next = new Set(prev);
      next.delete(playerName);
      return next;
    });

    if (gameState === 'countdown') {
      // FALSE START - Instant Loss
      clearTimeout(timerRef.current);
      setLoser(playerName);
      setLoserReason("False start! You let go too early.");
      setGameState('result');
      playSound('buzzer');
      triggerVibration([200, 50, 200]);
    } else if (gameState === 'red') {
      // VALID RELEASE - Record their time
      if (!releaseOrder.includes(playerName)) {
        setReleaseOrder(prev => [...prev, playerName]);
        triggerVibration(20);
      }
    } else if (gameState === 'ready') {
      // Lifted before suspense even started
      clearTimeout(timerRef.current);
      setGameState('waiting');
    }
  };

  const resetGame = () => {
    clearTimeout(timerRef.current);
    setActiveTouches(new Set());
    setReleaseOrder([]);
    setLoser(null);
    setLoserReason("");
    setGameState('waiting');
  };

  if (players.length < 2) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'white' }}>
        <h2>Not enough players!</h2>
        <p>Go back and add at least 2 players to play Finger on Screen.</p>
        <button onClick={() => navigate('/games')} style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '12px', background: 'var(--accent-pink)', border: 'none', color: 'white', fontWeight: 'bold' }}>Back to Library</button>
      </div>
    );
  }

  // Calculate dynamic circular positions based on player count
  const getCirclePosition = (index, total) => {
    const angle = (index / total) * (2 * Math.PI) - (Math.PI / 2); 
    const radius = 35; // 35% radius from center
    return {
      top: `calc(50% + ${radius * Math.sin(angle)}%)`,
      left: `calc(50% + ${radius * Math.cos(angle)}%)`,
      transform: 'translate(-50%, -50%)'
    };
  };

  const getBackgroundColor = () => {
    if (gameState === 'countdown') return 'var(--accent-cyan)';
    if (gameState === 'red') return '#FF1E56';
    return 'var(--bg-base)';
  };

  return (
    <div 
      style={{ 
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
        backgroundColor: getBackgroundColor(), 
        transition: gameState === 'red' ? 'none' : 'background-color 0.3s ease',
        touchAction: 'none', // CRITICAL: Stops mobile browser from zooming/scrolling on multi-touch
        overflow: 'hidden',
        zIndex: 9999
      }}
    >
      <header style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10 }}>
        <button onClick={() => navigate('/games')} style={{ background: 'rgba(0,0,0,0.3)', border: 'none', color: 'white', padding: '10px 15px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ArrowLeft size={20} /> Quit
        </button>
      </header>

      {/* Main Status Text */}
      <div style={{ position: 'absolute', top: '15%', left: '0', width: '100%', textAlign: 'center', zIndex: 5, pointerEvents: 'none' }}>
        {gameState === 'waiting' && (
           <>
             <h2 style={{ color: 'white', fontSize: '1.5rem', margin: '0 20px' }}>Waiting for all fingers...</h2>
             <p style={{ color: 'var(--text-muted)', margin: '10px 20px' }}>{activeTouches.size} / {players.length} fingers on screen</p>
           </>
        )}
        {gameState === 'ready' && <h2 style={{ color: 'var(--accent-cyan)', fontSize: '2rem' }}>Get Ready...</h2>}
        {gameState === 'countdown' && <h2 style={{ color: '#000', fontSize: '2.5rem', fontWeight: '900' }}>HOLD IT...</h2>}
        {gameState === 'red' && <h2 style={{ color: 'white', fontSize: '3.5rem', fontWeight: '900' }}>RELEASE!</h2>}
      </div>

      {/* Touch Target Rings */}
      {gameState !== 'result' && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: '100%', maxWidth: '400px', height: '60%', transform: 'translate(-50%, -50%)' }}>
          {players.map((player, index) => {
            const isTouching = activeTouches.has(player);
            const pos = getCirclePosition(index, players.length);
            
            return (
              <div 
                key={player}
                onTouchStart={(e) => handleTouchStart(player, e)}
                onTouchEnd={(e) => handleTouchEnd(player, e)}
                onTouchCancel={(e) => handleTouchEnd(player, e)}
                style={{
                  position: 'absolute', top: pos.top, left: pos.left,
                  width: '90px', height: '90px',
                  borderRadius: '50%',
                  border: isTouching ? '4px solid white' : '2px dashed rgba(255,255,255,0.5)',
                  backgroundColor: isTouching ? 'rgba(255,255,255,0.2)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                  boxShadow: isTouching ? '0 0 20px rgba(255,255,255,0.5)' : 'none'
                }}
              >
                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.9rem', textAlign: 'center', pointerEvents: 'none', padding: '5px', textShadow: '1px 1px 2px #000' }}>
                  {player}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Results Screen */}
      {gameState === 'result' && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', width: '90%', maxWidth: '400px', backgroundColor: 'var(--bg-surface)', padding: '40px 20px', borderRadius: '24px', border: '2px solid #FF1E56', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
          <AlertTriangle size={50} color="#FF1E56" style={{ margin: '0 auto 20px' }} />
          <h2 style={{ fontSize: '2.5rem', color: 'white', marginBottom: '10px' }}>{loser} LOSES!</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '30px' }}>{loserReason}</p>
          
          <button onClick={resetGame} style={{ width: '100%', padding: '16px', borderRadius: '14px', background: 'var(--accent-pink)', color: 'white', border: 'none', fontWeight: 'bold', fontSize: '1.2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <RefreshCcw size={20} /> Play Again
          </button>
        </div>
      )}
    </div>
  );
}

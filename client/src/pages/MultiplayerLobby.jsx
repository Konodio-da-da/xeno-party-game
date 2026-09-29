// client/src/pages/MultiplayerLobby.jsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { socket } from '../socket';
import { Users, LogIn, PlusCircle, Play, ArrowLeft, ChevronDown, Flame } from 'lucide-react';
import MostLikelyTo from '../games/MostLikelyTo';
import MultiPhoneEngine from '../games/MultiPhoneEngine';
import { multiPhoneGamesCatalog } from '../data/multiPhoneGames';
import { adultGamesCatalog } from '../data/adultGamesCatalog'; // <-- Added adult catalog
import { useStatsStore } from '../store/statsStore'; 

export default function MultiplayerLobby() {
  const location = useLocation();
  const navigate = useNavigate();
  const { playerName: savedName, unlockedPacks = [] } = useStatsStore(); 

  // Combine catalogs for the lobby selector
  const combinedCatalog = { ...multiPhoneGamesCatalog, ...adultGamesCatalog };

  const [selectedGame, setSelectedGame] = useState(location.state?.selectedGame || Object.values(combinedCatalog)[0]);
  const [playerName, setPlayerName] = useState(savedName || ''); 
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [currentRoom, setCurrentRoom] = useState(null);
  const [playersList, setPlayersList] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeGameType, setActiveGameType] = useState(selectedGame.id);
  const [showGameSelector, setShowGameSelector] = useState(false);
  const [error, setError] = useState('');
  
  // NEW: Render Wake-Up and Freakish Level State
  const [isWakingServer, setIsWakingServer] = useState(false);
  const [countdown, setCountdown] = useState(45);
  const [freakLevel, setFreakLevel] = useState('spicy'); 

  // Wake-up Server Countdown Ticker
  useEffect(() => {
    let timer;
    if (isWakingServer && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    } else if (countdown === 0) {
      setIsWakingServer(false); // Failsafe if it takes too long
    }
    return () => clearInterval(timer);
  }, [isWakingServer, countdown]);

  useEffect(() => {
    socket.connect();

    const onRoomCreated = ({ roomCode, players, gameType }) => {
      setIsWakingServer(false); // Stop countdown when connected
      setCurrentRoom(roomCode);
      setPlayersList(players);
      setActiveGameType(gameType);
      setIsHost(true);
    };

    socket.on('room-created', onRoomCreated);

    socket.on('joined-success', ({ roomCode, players, gameType, freakLevel: syncedLevel }) => {
      setCurrentRoom(roomCode);
      setPlayersList(players);
      setActiveGameType(gameType);
      if (syncedLevel) setFreakLevel(syncedLevel); // Sync level for joiners
      setIsHost(false);
    });

    socket.on('update-players', (players) => {
      setPlayersList(players);
    });

    socket.on('game-type-changed', (newGameType) => {
      setActiveGameType(newGameType);
      const updatedGame = Object.values(combinedCatalog).find(g => g.id === newGameType);
      if (updatedGame) setSelectedGame(updatedGame);
    });

    // Sync Freakish level across the room
    socket.on('freak-level-changed', (newLevel) => {
      setFreakLevel(newLevel);
    });

    socket.on('game-started', (data) => {
      if (data?.gameType) setActiveGameType(data.gameType);
      if (data?.freakLevel) setFreakLevel(data.freakLevel);
      setIsPlaying(true);
    });

    socket.on('force-back-to-lobby', () => {
      setIsPlaying(false); 
    });

    socket.on('error-message', (msg) => {
      setError(msg);
      setIsWakingServer(false);
    });

    return () => {
      socket.off('room-created', onRoomCreated);
      socket.off('joined-success');
      socket.off('update-players');
      socket.off('game-type-changed');
      socket.off('freak-level-changed');
      socket.off('game-started');
      socket.off('force-back-to-lobby'); 
      socket.off('error-message');
      socket.disconnect();
    };
  }, []); 

  const handleCreateRoom = () => {
    if (!playerName.trim()) {
      setError('Please enter your name first!');
      return;
    }
    setError('');

    // Trigger Render Wake Up Modal if socket is sleeping
    if (!socket.connected) {
      setIsWakingServer(true);
      setCountdown(45);
      socket.connect();
    }

    socket.emit('create-room', { playerName, gameType: selectedGame.id, freakLevel });
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!playerName.trim() || !roomCodeInput.trim()) {
      setError('Enter your name and a 4-digit room code!');
      return;
    }
    setError('');
    
    if (!socket.connected) {
      socket.connect();
    }
    
    socket.emit('join-room', { roomCode: roomCodeInput.trim(), playerName });
  };

  const handleGameChange = (game) => {
    setSelectedGame(game);
    setActiveGameType(game.id);
    setShowGameSelector(false);
    socket.emit('update-game-type', { roomCode: currentRoom, gameType: game.id });
  };

  const handleFreakLevelChange = (level) => {
    setFreakLevel(level);
    socket.emit('update-freak-level', { roomCode: currentRoom, freakLevel: level });
  };

  const handleStartGame = () => {
    socket.emit('start-game', { roomCode: currentRoom, gameType: activeGameType, freakLevel });
  };

  if (isPlaying) {
    if (activeGameType === 'mostLikelyTo') {
      return <MostLikelyTo roomCode={currentRoom} players={playersList} />;
    }
    // Passing freakLevel into the engine so it knows which array to pull prompts from
    return <MultiPhoneEngine roomCode={currentRoom} players={playersList} gameType={activeGameType} freakLevel={freakLevel} />;
  }

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '400px', margin: '0 auto', paddingBottom: '80px' }}>
      
      {/* WAKE UP OVERLAY MODAL */}
      {isWakingServer && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '24px', zIndex: 100, textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px', animation: 'pulse 1.5s infinite' }}>⚡</div>
          <h3 style={{ color: 'var(--accent-cyan)', fontSize: '1.4rem', marginBottom: '8px' }}>
            Waking Up Game Server...
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '300px', lineHeight: '1.5' }}>
            The cloud instance takes about 45 seconds to boot when asleep. Your room will open the second it connects!
          </p>
          <div style={{
            marginTop: '20px', fontSize: '2.5rem', fontWeight: 'bold',
            color: 'var(--accent-pink)', letterSpacing: '2px'
          }}>
            {countdown}s
          </div>
        </div>
      )}

      {/* HEADER */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate('/games')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ArrowLeft size={20} /> Vault
        </button>
        <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 'bold' }}>Multiplayer Setup</span>
      </header>

      {/* LOBBY ROOM VIEW */}
      {currentRoom ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <header style={{ textAlign: 'center', marginTop: '10px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', letterSpacing: '2px' }}>ROOM CODE</span>
            <h1 style={{ fontSize: '3rem', color: 'white', letterSpacing: '6px' }}>{currentRoom}</h1>
          </header>

          <div style={{ backgroundColor: 'var(--bg-surface)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Current Game Option</span>
            <div 
              onClick={() => isHost && setShowGameSelector(!showGameSelector)}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', cursor: isHost ? 'pointer' : 'default' }}
            >
              <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-pink)' }}>{selectedGame.title}</h3>
              {isHost && <ChevronDown size={18} color="white" />}
            </div>

            {showGameSelector && isHost && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--bg-base)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', marginTop: '8px', maxHeight: '200px', overflowY: 'auto', zIndex: 50 }}>
                {Object.values(combinedCatalog)
                  .filter(g => g.playMode !== 'single-phone')
                  .map((g) => {
                  const isUnlocked = !g.isPremium || unlockedPacks.includes(g.id);
                  
                  return (
                    <div 
                      key={g.id} 
                      onClick={() => isUnlocked ? handleGameChange(g) : null} 
                      style={{ 
                        padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', 
                        cursor: isUnlocked ? 'pointer' : 'not-allowed', color: isUnlocked ? 'white' : 'var(--text-muted)',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                      }}
                    >
                      <span>{g.title}</span>
                      {!isUnlocked && <span style={{ fontSize: '1.1rem' }}>🔒</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* NEW: Freakish Level Selector (Only shows if game has prompts object) */}
          {selectedGame.prompts && !Array.isArray(selectedGame.prompts) && (
            <div style={{ backgroundColor: 'var(--bg-surface)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Freakish Level</span>
              {isHost ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleFreakLevelChange('spicy')} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: freakLevel === 'spicy' ? '2px solid #FF1E56' : '1px solid rgba(255,255,255,0.1)', background: freakLevel === 'spicy' ? 'rgba(255,30,86,0.1)' : 'var(--bg-base)', color: 'white', fontSize: '0.85rem' }}>🌶️ Spicy</button>
                  <button onClick={() => handleFreakLevelChange('spicier')} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: freakLevel === 'spicier' ? '2px solid #FF1E56' : '1px solid rgba(255,255,255,0.1)', background: freakLevel === 'spicier' ? 'rgba(255,30,86,0.1)' : 'var(--bg-base)', color: 'white', fontSize: '0.85rem' }}>🔥 Spicier</button>
                  <button onClick={() => handleFreakLevelChange('spiciest')} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: freakLevel === 'spiciest' ? '2px solid #FF1E56' : '1px solid rgba(255,255,255,0.1)', background: freakLevel === 'spiciest' ? 'rgba(255,30,86,0.1)' : 'var(--bg-base)', color: 'white', fontSize: '0.85rem' }}>🌋 Spiciest</button>
                </div>
              ) : (
                <div style={{ padding: '10px', background: 'var(--bg-base)', borderRadius: '8px', color: 'var(--accent-pink)', textAlign: 'center', fontWeight: 'bold' }}>
                  {freakLevel.toUpperCase()} LEVEL LOCKED IN
                </div>
              )}
            </div>
          )}

          <div style={{ backgroundColor: 'var(--bg-surface)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ marginBottom: '15px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} color="var(--accent-pink)" />
              Connected Players ({playersList.length})
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {playersList.map((p, idx) => (
                <li key={idx} style={{ padding: '10px 14px', background: 'var(--bg-base)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{p.name}</span>
                  {p.isHost && <span style={{ fontSize: '0.75rem', color: 'var(--accent-pink)', fontWeight: 'bold' }}>HOST</span>}
                </li>
              ))}
            </ul>
          </div>

          {isHost ? (
            <button 
              onClick={handleStartGame}
              style={{ padding: '16px', borderRadius: '14px', background: 'var(--accent-pink)', color: 'white', border: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', fontSize: '1rem' }}
            >
              <Play size={20} fill="currentColor" /> START GAME
            </button>
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Waiting for host to start the game...</p>
          )}
        </div>
      ) : (
        // SETUP VIEW 
        <>
          <div>
            <h1 style={{ color: 'var(--accent-pink)', fontSize: '1.8rem', marginBottom: '4px' }}>XENO Live</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Create or join a room to get started.</p>
          </div>

          {error && <div style={{ background: 'rgba(255,30,86,0.1)', border: '1px solid var(--accent-pink)', padding: '10px', borderRadius: '8px', color: 'var(--accent-pink)', fontSize: '0.85rem' }}>{error}</div>}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input 
              type="text" 
              placeholder="Your Display Name" 
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              maxLength={12}
              style={{ padding: '14px', borderRadius: '12px', background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem' }}
            />

            <button 
              onClick={handleCreateRoom}
              style={{ padding: '16px', borderRadius: '12px', background: 'var(--accent-pink)', color: 'white', border: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
            >
              <PlusCircle size={20} /> Create Room & Host
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '5px 0', color: 'var(--text-muted)' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
            <span>OR JOIN ROOM</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
          </div>

          <form onSubmit={handleJoinRoom} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input 
              type="text" 
              placeholder="Enter 4-Digit Code" 
              value={roomCodeInput}
              onChange={(e) => setRoomCodeInput(e.target.value)}
              maxLength={4}
              style={{ padding: '14px', borderRadius: '12px', background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '1.2rem', textAlign: 'center', letterSpacing: '4px', textTransform: 'uppercase' }}
            />

            <button 
              type="submit"
              style={{ padding: '16px', borderRadius: '12px', background: 'var(--accent-cyan)', color: 'var(--bg-base)', border: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
            >
              <LogIn size={20} /> Join Room
            </button>
          </form>
        </>
      )}
    </div>
  );
}

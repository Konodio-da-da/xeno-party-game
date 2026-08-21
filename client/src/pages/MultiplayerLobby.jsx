// client/src/pages/MultiplayerLobby.jsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { socket } from '../socket';
import { Users, LogIn, PlusCircle, Play, ArrowLeft, ChevronDown } from 'lucide-react';
import MostLikelyTo from '../games/MostLikelyTo';
import MultiPhoneEngine from '../games/MultiPhoneEngine';
import { multiPhoneGamesCatalog } from '../data/multiPhoneGames';
import { useStatsStore } from '../store/statsStore'; 

export default function MultiplayerLobby() {
  const location = useLocation();
  const navigate = useNavigate();
  // ADDED: Pull unlockedPacks from your store to verify purchases
  const { playerName: savedName, unlockedPacks = [] } = useStatsStore(); 

  const [selectedGame, setSelectedGame] = useState(location.state?.selectedGame || Object.values(multiPhoneGamesCatalog)[0]);
  const [playerName, setPlayerName] = useState(savedName || ''); 
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [currentRoom, setCurrentRoom] = useState(null);
  const [playersList, setPlayersList] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeGameType, setActiveGameType] = useState(selectedGame.id);
  const [showGameSelector, setShowGameSelector] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    socket.connect();

    socket.on('room-created', ({ roomCode, players, gameType }) => {
      setCurrentRoom(roomCode);
      setPlayersList(players);
      setActiveGameType(gameType);
      setIsHost(true);
    });

    socket.on('joined-success', ({ roomCode, players, gameType }) => {
      setCurrentRoom(roomCode);
      setPlayersList(players);
      setActiveGameType(gameType);
      setIsHost(false);
    });

    socket.on('update-players', (players) => {
      setPlayersList(players);
    });

    socket.on('game-type-changed', (newGameType) => {
      setActiveGameType(newGameType);
      const updatedGame = Object.values(multiPhoneGamesCatalog).find(g => g.id === newGameType);
      if (updatedGame) setSelectedGame(updatedGame);
    });

    socket.on('game-started', (finalGameType) => {
      if (finalGameType) {
        setActiveGameType(finalGameType);
      }
      setIsPlaying(true);
    });

    socket.on('force-back-to-lobby', () => {
      setIsPlaying(false); 
    });

    socket.on('error-message', (msg) => {
      setError(msg);
    });

    return () => {
      socket.off('room-created');
      socket.off('joined-success');
      socket.off('update-players');
      socket.off('game-type-changed');
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
    socket.emit('create-room', { playerName, gameType: selectedGame.id });
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!playerName.trim() || !roomCodeInput.trim()) {
      setError('Enter your name and a 4-digit room code!');
      return;
    }
    setError('');
    socket.emit('join-room', { roomCode: roomCodeInput.trim(), playerName });
  };

  const handleGameChange = (game) => {
    setSelectedGame(game);
    setActiveGameType(game.id);
    setShowGameSelector(false);
    socket.emit('update-game-type', { roomCode: currentRoom, gameType: game.id });
  };

  const handleStartGame = () => {
    socket.emit('start-game', { roomCode: currentRoom, gameType: activeGameType });
  };

  if (isPlaying) {
    if (activeGameType === 'mostLikelyTo') {
      return <MostLikelyTo roomCode={currentRoom} players={playersList} />;
    }
    return <MultiPhoneEngine roomCode={currentRoom} players={playersList} gameType={activeGameType} />;
  }

  // LOBBY ROOM VIEW
  if (currentRoom) {
    return (
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '400px', margin: '0 auto', paddingBottom: '60px' }}>
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
              {/* UPDATED: Map over games and verify if they are unlocked */}
              {Object.values(multiPhoneGamesCatalog).map((g) => {
                const isUnlocked = !g.isPremium || unlockedPacks.includes(g.id);
                
                return (
                  <div 
                    key={g.id} 
                    onClick={() => isUnlocked ? handleGameChange(g) : null} 
                    style={{ 
                      padding: '12px 16px', 
                      borderBottom: '1px solid rgba(255,255,255,0.05)', 
                      cursor: isUnlocked ? 'pointer' : 'not-allowed', 
                      color: isUnlocked ? 'white' : 'var(--text-muted)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
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
    );
  }

  // SETUP VIEW
  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '400px', margin: '0 auto', paddingBottom: '80px' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate('/games')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ArrowLeft size={20} /> Vault
        </button>
        <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 'bold' }}>Multiplayer Setup</span>
      </header>

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
    </div>
  );
}

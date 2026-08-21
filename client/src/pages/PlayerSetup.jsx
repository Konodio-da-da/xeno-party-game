// client/src/pages/PlayerSetup.jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePlayerStore } from '../store/playerStore';
import { useStatsStore } from '../store/statsStore';
import { Plus, Trash2, ArrowRight, Play } from 'lucide-react';

export default function PlayerSetup() {
  const navigate = useNavigate();
  const location = useLocation();
  const setPlayers = usePlayerStore((state) => state.setPlayers);
  const { playerName } = useStatsStore(); 
  
  const [localPlayers, setLocalPlayers] = useState([playerName, '']);
  
  // Extract target game ID if passed from Library
  const targetGameId = location.state?.targetGameId;

  const handleAddPlayer = () => {
    setLocalPlayers([...localPlayers, '']);
  };

  const handleRemovePlayer = (index) => {
    const newPlayers = [...localPlayers];
    newPlayers.splice(index, 1);
    setLocalPlayers(newPlayers);
  };

  const handleNameChange = (text, index) => {
    const newPlayers = [...localPlayers];
    newPlayers[index] = text;
    setLocalPlayers(newPlayers);
  };

  const handleProceedToGames = () => {
    const activePlayers = localPlayers.filter(p => p.trim() !== '');
    if (activePlayers.length < 2) return;

    setPlayers(activePlayers);

    // If they came here trying to play a specific game, send them straight to it
    if (targetGameId) {
      navigate(`/play/${targetGameId}`, { replace: true });
    } else {
      // Otherwise, just send them to the library
      navigate('/games', { replace: true });
    }
  };

  const activeCount = localPlayers.filter(p => p.trim() !== '').length;

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h1 style={{ color: 'var(--accent-pink)', marginBottom: '10px' }}>Add Players</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Enter the names of everyone playing.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
        {localPlayers.map((player, index) => (
          <div key={index} style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={player}
              onChange={(e) => handleNameChange(e.target.value, index)}
              placeholder={`Player ${index + 1}`}
              style={{ flex: 1, padding: '16px', borderRadius: '12px', background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem' }}
            />
            {index > 1 && (
              <button onClick={() => handleRemovePlayer(index)} style={{ padding: '0 20px', borderRadius: '12px', background: 'rgba(255, 30, 86, 0.2)', border: '1px solid #FF1E56', color: '#FF1E56', cursor: 'pointer' }}>
                <Trash2 size={20} />
              </button>
            )}
          </div>
        ))}
      </div>

      <button onClick={handleAddPlayer} style={{ width: '100%', padding: '16px', borderRadius: '12px', background: 'transparent', border: '2px dashed var(--accent-cyan)', color: 'var(--accent-cyan)', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '20px' }}>
        <Plus size={20} /> Add Another Player
      </button>

      <button 
        onClick={handleProceedToGames}
        disabled={activeCount < 2}
        style={{ width: '100%', padding: '16px', borderRadius: '12px', background: activeCount < 2 ? 'var(--bg-surface)' : 'var(--accent-pink)', color: activeCount < 2 ? 'var(--text-muted)' : 'white', border: 'none', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: activeCount < 2 ? 'not-allowed' : 'pointer' }}
      >
        {targetGameId ? (
           <><Play size={20} /> START GAME</>
        ) : (
           <>SELECT GAME <ArrowRight size={20} /></>
        )}
      </button>
    </div>
  );
}

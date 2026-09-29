// client/src/pages/Profile.jsx
import { useState } from 'react';
import { useStatsStore } from '../store/statsStore';
import { useSettingsStore } from '../store/settingsStore';
import { Trophy, Flame, Activity, Volume2, Vibrate, Trash2, Edit2, Check } from 'lucide-react';
import { Mail } from 'lucide-react'; 
// (Keep your other existing imports here)

export default function Profile() {
  const { playerName, setPlayerName, totalGamesPlayed, gameCounts, recentActivity, clearStats } = useStatsStore();
  const { soundEnabled, hapticsEnabled, toggleSound, toggleHaptics } = useSettingsStore();
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(playerName);

  // Dynamic Rank System
  const getRank = (games) => {
    if (games >= 50) return { title: 'XENO God', color: '#FFD700' };
    if (games >= 20) return { title: 'XENO Veteran', color: 'var(--accent-pink)' };
    if (games >= 5) return { title: 'Regular', color: 'var(--accent-cyan)' };
    return { title: 'Newbie', color: 'var(--text-muted)' };
  };

  const currentRank = getRank(totalGamesPlayed);
  const favoriteGame = Object.entries(gameCounts).sort((a, b) => b[1] - a[1])[0];

  const handleSaveName = () => {
    if (tempName.trim()) {
      setPlayerName(tempName.trim());
    }
    setIsEditingName(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', paddingBottom: '90px' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: `linear-gradient(135deg, ${currentRank.color}, var(--bg-surface))`, margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${currentRank.color}`, transition: 'all 0.3s ease' }}>
          <Trophy size={40} color={totalGamesPlayed > 0 ? "white" : "var(--text-muted)"} />
        </div>
        
        {/* Editable Name Section */}
        {isEditingName ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
            <input 
              type="text" 
              value={tempName} 
              onChange={(e) => setTempName(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--accent-cyan)', background: 'var(--bg-base)', color: 'white', fontSize: '1.2rem', textAlign: 'center', width: '200px' }}
              autoFocus
            />
            <button onClick={handleSaveName} style={{ background: 'var(--accent-cyan)', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <Check size={20} color="var(--bg-base)" />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
            <h1 style={{ fontSize: '1.8rem', color: 'white', margin: 0 }}>{playerName}</h1>
            <button onClick={() => setIsEditingName(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <Edit2 size={16} />
            </button>
          </div>
        )}
        
        <p style={{ color: currentRank.color, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '5px' }}>
          {currentRank.title}
        </p>
      </header>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
        <div style={{ background: 'var(--bg-surface)', padding: '20px', borderRadius: '16px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
          <Flame size={24} color={currentRank.color} style={{ margin: '0 auto 10px' }} />
          <h2 style={{ fontSize: '2rem', color: 'white', margin: 0 }}>{totalGamesPlayed}</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '5px' }}>Games Played</p>
        </div>
        <div style={{ background: 'var(--bg-surface)', padding: '20px', borderRadius: '16px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
          <Activity size={24} color="var(--accent-cyan)" style={{ margin: '0 auto 10px' }} />
          <h2 style={{ fontSize: '1.2rem', color: 'white', margin: 0 }}>{favoriteGame ? favoriteGame[0] : 'None'}</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '5px' }}>Top Game</p>
        </div>
      </div>

      {/* Settings & Activity */}
      <div style={{ background: 'var(--bg-surface)', borderRadius: '16px', padding: '20px', marginBottom: '30px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '15px' }}>Device Settings</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)' }}><Volume2 size={20} color={soundEnabled ? 'var(--accent-cyan)' : 'var(--text-muted)'} /> Sound Effects</div>
          <button onClick={toggleSound} style={{ padding: '8px 16px', borderRadius: '20px', background: soundEnabled ? 'var(--accent-cyan)' : 'var(--bg-base)', color: soundEnabled ? '#000' : 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>{soundEnabled ? 'ON' : 'OFF'}</button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)' }}><Vibrate size={20} color={hapticsEnabled ? 'var(--accent-pink)' : 'var(--text-muted)'} /> Haptics (Vibration)</div>
          <button onClick={toggleHaptics} style={{ padding: '8px 16px', borderRadius: '20px', background: hapticsEnabled ? 'var(--accent-pink)' : 'var(--bg-base)', color: hapticsEnabled ? '#000' : 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>{hapticsEnabled ? 'ON' : 'OFF'}</button>
        </div>
      </div>

     


      {totalGamesPlayed > 0 && (
        <div style={{ textAlign: 'center' }}>
          <button 
            onClick={clearStats}
            style={{ background: 'rgba(255,30,86,0.1)', border: '1px solid #FF1E56', color: '#FF1E56', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}
          >
            <Trash2 size={16} /> Reset Profile Stats
          </button>
        </div>
      )}
       {/* SUPPORT SECTION */}
<div style={{ marginTop: '20px', backgroundColor: 'var(--bg-surface)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
  <h3 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
    Help & Support
  </h3>
  
  <a 
    href="mailto:zahantom@gmail.com?subject=XENO%20Party%20Game%20Support"
    style={{ 
      display: 'flex', alignItems: 'center', gap: '15px', color: 'white', textDecoration: 'none', 
      padding: '12px', backgroundColor: 'var(--bg-base)', borderRadius: '12px', 
      border: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' 
    }}
  >
    <div style={{ padding: '10px', backgroundColor: 'rgba(0, 240, 255, 0.1)', borderRadius: '10px' }}>
      <Mail size={22} color="var(--accent-cyan)" />
    </div>
    <div>
      <div style={{ fontWeight: 'bold', fontSize: '1.05rem' }}>Contact Developer</div>
      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
        Report a bug, payment issue, or suggest an idea
      </div>
    </div>
  </a>
</div>
    </div>
  );
}

// client/src/pages/Home.jsx
import { useNavigate } from 'react-router-dom';
import { Flame, Users, Sparkles, ArrowRight } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '100px', maxWidth: '400px', margin: '0 auto' }}>
      {/* App Header Banner */}
      <header style={{ textAlign: 'center', marginTop: '10px' }}>
        <h1 style={{ color: 'var(--accent-pink)', fontSize: '2.5rem', letterSpacing: '2px', marginBottom: '4px' }}>XENO</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>The Ultimate Pregame & Party OS</p>
      </header>

      {/* Quick Launch Card: Let's Get Drunk */}
      <div 
        onClick={() => navigate('/setup-players')}
        style={{ 
          background: 'linear-gradient(135deg, rgba(255,30,86,0.15), var(--bg-surface))', 
          border: '1px solid rgba(255,30,86,0.3)',
          padding: '24px 20px', 
          borderRadius: '20px', 
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          boxShadow: '0 8px 24px rgba(255,30,86,0.1)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-pink)', fontWeight: 'bold', letterSpacing: '1.5px' }}>SINGLE PHONE</span>
          <Flame size={22} color="var(--accent-pink)" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.3rem', color: 'white', marginBottom: '4px' }}>Let's Get Drunk</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pass & play card engine with customized player names.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-pink)', fontSize: '0.85rem', fontWeight: 'bold', marginTop: '4px' }}>
          <span>Play Now</span>
          <ArrowRight size={16} />
        </div>
      </div>

      {/* Quick Launch Card: Multiplayer Rooms */}
      <div 
        onClick={() => navigate('/multiplayer')}
        style={{ 
          background: 'linear-gradient(135deg, rgba(0,240,255,0.15), var(--bg-surface))', 
          border: '1px solid rgba(0,240,255,0.3)',
          padding: '24px 20px', 
          borderRadius: '20px', 
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          boxShadow: '0 8px 24px rgba(0,240,255,0.1)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 'bold', letterSpacing: '1.5px' }}>MULTI-PHONE LIVE</span>
          <Users size={22} color="var(--accent-cyan)" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.3rem', color: 'white', marginBottom: '4px' }}>XENO Live Rooms</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Host a 4-digit room code or join friends for real-time voting.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-cyan)', fontSize: '0.85rem', fontWeight: 'bold', marginTop: '4px' }}>
          <span>Enter Lobby</span>
          <ArrowRight size={16} />
        </div>
      </div>
    </div>
  );
}

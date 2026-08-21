// client/src/games/custom/SoundboardUI.jsx
import { useState, useEffect } from 'react';
import { socket } from '../../socket';
import { playSound, triggerVibration } from '../../utils/soundManager';
import { Volume2, Radio, Zap, Flame, Award, Bell } from 'lucide-react';

export default function SoundboardUI({ roomCode, players }) {
  const [activeEffect, setActiveEffect] = useState(null);

  useEffect(() => {
    console.log("Soundboard mounted for room:", roomCode);

    socket.on('play-sound-effect', (soundName) => {
      console.log("Received sound effect:", soundName);
      playSound(soundName);
      triggerVibration(50);
      setActiveEffect(soundName);
      setTimeout(() => setActiveEffect(null), 600);
    });

    return () => {
      socket.off('play-sound-effect');
    };
  }, [roomCode]);

  const triggerEffect = (soundName) => {
    console.log("Button clicked! Triggering sound:", soundName);
    socket.emit('trigger-sound', { roomCode, soundName });
  };

  const soundButtons = [
    { id: 'airhorn', label: 'Airhorn 📯', color: 'var(--accent-pink)', icon: Zap },
    { id: 'cheer', label: 'Crowd Cheer 🙌', color: 'var(--accent-cyan)', icon: Award },
    { id: 'buzzer', label: 'Wrong Buzzer ❌', color: '#FF1E56', icon: Radio },
    { id: 'boo', label: 'Boo 🍅', color: '#a855f7', icon: Bell },
    { id: 'success', label: 'Ding! ✨', color: '#10b981', icon: Flame },
    { id: 'swipe', label: 'Whoosh 💨', color: '#f59e0b', icon: Volume2 },
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: '85vh', justifyContent: 'space-between' }}>
      
      <header style={{ textAlign: 'center', marginTop: '10px' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', letterSpacing: '2px', fontWeight: 'bold' }}>LIVE SOUNDBOARD</span>
        <h1 style={{ fontSize: '1.5rem', color: 'white', marginTop: '4px' }}>Chaos Room</h1>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tap buttons to spam sound effects!</p>
      </header>

      {/* Soundboard Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', flex: 1, alignContent: 'center' }}>
        {soundButtons.map((btn) => {
          const IconComponent = btn.icon;
          const isTriggered = activeEffect === btn.id;

          return (
            <button
              key={btn.id}
              type="button"
              onClick={() => triggerEffect(btn.id)}
              style={{
                backgroundColor: isTriggered ? 'white' : 'var(--bg-surface)',
                border: `2px solid ${btn.color}`,
                borderRadius: '20px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                cursor: 'pointer',
                transform: isTriggered ? 'scale(0.95)' : 'scale(1)',
                transition: 'transform 0.1s ease, background-color 0.1s ease',
                boxShadow: isTriggered ? `0 0 25px ${btn.color}` : '0 10px 20px rgba(0,0,0,0.3)'
              }}
            >
              <IconComponent size={32} color={isTriggered ? '#000' : btn.color} />
              <span style={{ fontSize: '0.95rem', fontWeight: 'bold', color: isTriggered ? '#000' : 'white' }}>
                {btn.label}
              </span>
            </button>
          );
        })}
      </div>

      <div style={{ textAlign: 'center', padding: '10px', background: 'var(--bg-surface)', borderRadius: '12px' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Connected Players: <strong style={{ color: 'white' }}>{players?.length || 1}</strong></span>
      </div>
    </div>
  );
}

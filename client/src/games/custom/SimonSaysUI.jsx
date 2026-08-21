// client/src/games/custom/SimonSaysUI.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, RefreshCcw, Volume2, EyeOff, Eye } from 'lucide-react';
import { singlePhoneGamesCatalog } from '../../data/singlePhoneGames';
import { triggerVibration } from '../../utils/soundManager';

export default function SimonSaysUI() {
  const navigate = useNavigate();
  const gameData = singlePhoneGamesCatalog.simonSays;
  
  const [deck, setDeck] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false); // Tracks if text should be shown

  useEffect(() => {
    if (gameData && gameData.prompts) {
      const shuffled = [...gameData.prompts].sort(() => Math.random() - 0.5);
      setDeck(shuffled);
    }
  }, [gameData]);

  const currentPrompt = deck[currentIndex];

  const handlePlayAudio = () => {
    if (!currentPrompt) return;
    
    setIsPlaying(true);
    setIsRevealed(false); // Hide text while speaking
    triggerVibration(30);

    window.speechSynthesis.cancel();

    const textToRead = currentPrompt.text || currentPrompt;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    
    utterance.rate = 0.9; 
    utterance.pitch = 1.1;

    // Reveal the text the exact moment the voice finishes!
    utterance.onend = () => {
      setIsPlaying(false);
      setIsRevealed(true); 
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleNextRound = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsRevealed(false); // Hide text again for the new round
    setCurrentIndex((prev) => (prev + 1) % deck.length);
  };

  if (!currentPrompt) return null;

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: '85vh', justifyContent: 'space-between' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => { window.speechSynthesis.cancel(); navigate('/games'); }} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ArrowLeft size={20} /> Library
        </button>
        <span style={{ fontSize: '0.75rem', color: 'var(--accent-pink)', fontWeight: 'bold', textTransform: 'uppercase' }}>{gameData?.title || 'Simon Says'}</span>
      </header>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', padding: '40px 20px', backgroundColor: 'var(--bg-surface)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          
          {/* Toggle between Eyes Off and the Revealed Text */}
          {isRevealed ? (
            <div className="animate-fade-in">
              <Eye size={48} color="var(--accent-pink)" style={{ margin: '0 auto 20px' }} />
              <h2 style={{ fontSize: '1.6rem', color: 'white', lineHeight: '1.4' }}>
                {currentPrompt.text || currentPrompt}
              </h2>
            </div>
          ) : (
            <div>
              <EyeOff size={48} color="var(--accent-cyan)" style={{ margin: '0 auto 20px' }} />
              <h2 style={{ fontSize: '1.5rem', color: 'white', marginBottom: '10px' }}>Eyes Off!</h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
                Listen closely. The text is hidden so players can't cheat.
              </p>
            </div>
          )}

          <button 
            onClick={handlePlayAudio}
            disabled={isPlaying}
            style={{ 
              marginTop: '30px', width: '100%', padding: '20px', borderRadius: '16px', 
              background: isPlaying ? 'var(--bg-base)' : 'var(--accent-cyan)', 
              color: isPlaying ? 'var(--accent-cyan)' : 'var(--bg-base)', 
              border: isPlaying ? '2px solid var(--accent-cyan)' : 'none', 
              fontWeight: 'bold', fontSize: '1.2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {isPlaying ? <><Volume2 size={24} className="animate-pulse" /> Speaking...</> : <><Play size={24} /> {isRevealed ? 'Replay Audio' : 'Play Audio'}</>}
          </button>
        </div>
      </div>

      <button onClick={handleNextRound} style={{ width: '100%', padding: '16px', borderRadius: '14px', background: 'var(--accent-pink)', color: 'white', border: 'none', fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
        <RefreshCcw size={20} /> Next Prompt
      </button>
    </div>
  );
}

// client/src/games/custom/BouncerUI.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Check, X, Eye, RefreshCcw, Users } from 'lucide-react';
import { singlePhoneGamesCatalog } from '../../data/singlePhoneGames';
import { usePlayerStore } from '../../store/playerStore';
import { triggerVibration, playSound } from '../../utils/soundManager';

// Fallback rules just in case your catalog array is empty
const FALLBACK_RULES = [
  "Things that are green", "Words starting with a vowel", "Things you find in a bathroom", 
  "Things that are cold", "Animals that lay eggs", "Brands of cars", "Things smaller than a baseball"
];

export default function BouncerUI() {
  const navigate = useNavigate();
  const gameData = singlePhoneGamesCatalog.theBouncer || { title: 'The Bouncer', prompts: FALLBACK_RULES };
  const players = usePlayerStore((state) => state.players).filter(p => p.trim() !== '');
  
  const [deck, setDeck] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState("pass"); // 'pass' -> 'reveal' -> 'play' -> 'result'
  const [stats, setStats] = useState({ accepted: 0, rejected: 0 });

  useEffect(() => {
    const promptsToUse = (gameData.prompts && gameData.prompts.length > 0) ? gameData.prompts : FALLBACK_RULES;
    const shuffled = [...promptsToUse].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
  }, [gameData]);

  const currentRule = deck[currentIndex];
  // Round-robin Bouncer selection
  const bouncerName = players.length > 0 ? players[currentIndex % players.length] : "The Bouncer";

  const handleReveal = () => {
    setPhase("reveal");
    playSound('swipe');
    triggerVibration(20);
  };

  const handleStartJudging = () => {
    setPhase("play");
    setStats({ accepted: 0, rejected: 0 });
    playSound('success');
    triggerVibration(30);
  };

  const handleAccept = () => {
    setStats(prev => ({ ...prev, accepted: prev.accepted + 1 }));
    playSound('success'); // Ping!
    triggerVibration(20);
  };

  const handleReject = () => {
    setStats(prev => ({ ...prev, rejected: prev.rejected + 1 }));
    playSound('buzzer'); // Buzz!
    triggerVibration([50, 50]);
  };

  const handleRuleGuessed = () => {
    setPhase("result");
    playSound('success');
    triggerVibration([50, 50, 100]);
  };

  const handleNextRound = () => {
    setCurrentIndex(prev => (prev + 1) % deck.length);
    setPhase("pass");
  };

  if (!currentRule) return null;

  const ruleText = typeof currentRule === 'string' ? currentRule : (currentRule.text || "Unknown Rule");

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: '85vh', justifyContent: 'space-between', backgroundColor: phase === 'play' ? '#0a0a0a' : 'transparent', transition: 'background-color 0.3s' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate('/games')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ArrowLeft size={20} /> Library
        </button>
        <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>{gameData.title}</span>
      </header>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: '20px' }}>
        
        {/* PHASE 1: Pass the phone */}
        {phase === "pass" && (
          <div className="animate-fade-in" style={{ width: '100%', padding: '40px 20px', backgroundColor: 'var(--bg-surface)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Users size={60} color="var(--accent-cyan)" style={{ margin: '0 auto 20px' }} />
            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-muted)', marginBottom: '10px' }}>Pass the phone to...</h2>
            <h1 style={{ fontSize: '2.5rem', color: 'white', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '30px' }}>
              {bouncerName}
            </h1>
            <button onClick={handleReveal} style={{ width: '100%', padding: '16px', borderRadius: '12px', background: 'var(--accent-cyan)', color: '#000', border: 'none', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '8px' }}>
              <Eye size={20} /> I am {bouncerName}
            </button>
          </div>
        )}

        {/* PHASE 2: Secret Reveal */}
        {phase === "reveal" && (
          <div className="animate-fade-in" style={{ width: '100%', padding: '40px 20px', backgroundColor: 'var(--bg-surface)', borderRadius: '24px', border: '2px solid var(--accent-pink)' }}>
            <ShieldCheck size={60} color="var(--accent-pink)" style={{ margin: '0 auto 20px' }} />
            <h2 style={{ fontSize: '1.2rem', color: 'var(--accent-pink)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>Top Secret Rule</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '10px', marginBottom: '20px' }}>Don't let anyone else see this. Only allow items into the club that fit this rule:</p>
            <h1 style={{ fontSize: '1.8rem', color: 'white', lineHeight: '1.3', marginBottom: '30px', padding: '15px', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '12px' }}>
              {ruleText}
            </h1>
            <button onClick={handleStartJudging} style={{ width: '100%', padding: '16px', borderRadius: '12px', background: 'var(--accent-pink)', color: 'white', border: 'none', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>
              Hide & Start Judging
            </button>
          </div>
        )}

        {/* PHASE 3: Gameplay (Judging) */}
        {phase === "play" && (
          <div className="animate-fade-in" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
            
            <div style={{ flex: 1, backgroundColor: '#111', borderRadius: '24px', border: '1px solid #333', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h2 style={{ fontSize: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px' }}>The Rule</h2>
              <p style={{ fontSize: '1.4rem', color: 'white', fontWeight: 'bold', margin: '10px 0' }}>{ruleText}</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
                <span style={{ color: 'rgba(16, 185, 129, 0.8)', fontWeight: 'bold' }}>{stats.accepted} Accepted</span>
                <span style={{ color: 'rgba(255, 30, 86, 0.8)', fontWeight: 'bold' }}>{stats.rejected} Rejected</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <button onClick={handleReject} style={{ flex: 1, padding: '30px 10px', borderRadius: '20px', background: 'rgba(255, 30, 86, 0.1)', border: '2px solid #FF1E56', color: '#FF1E56', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <X size={40} /> <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>REJECT</span>
              </button>
              <button onClick={handleAccept} style={{ flex: 1, padding: '30px 10px', borderRadius: '20px', background: 'rgba(16, 185, 129, 0.1)', border: '2px solid #10b981', color: '#10b981', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <Check size={40} /> <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>ACCEPT</span>
              </button>
            </div>

            <button onClick={handleRuleGuessed} style={{ width: '100%', padding: '16px', borderRadius: '12px', background: 'var(--bg-surface)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', marginTop: '10px' }}>
              Someone Guessed The Rule!
            </button>
          </div>
        )}

        {/* PHASE 4: Result / Summary */}
        {phase === "result" && (
          <div className="animate-fade-in" style={{ width: '100%', padding: '40px 20px', backgroundColor: 'var(--bg-surface)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h1 style={{ fontSize: '2.5rem', color: 'var(--accent-cyan)', marginBottom: '10px' }}>Round Over!</h1>
            <p style={{ fontSize: '1.2rem', color: 'white', marginBottom: '30px' }}>The rule was: <br/><strong style={{ color: 'var(--accent-pink)' }}>{ruleText}</strong></p>
            
            <div style={{ display: 'flex', justifyContent: 'space-around', backgroundColor: 'var(--bg-base)', padding: '20px', borderRadius: '16px', marginBottom: '30px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', color: '#10b981', fontWeight: 'bold' }}>{stats.accepted}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Accepted</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', color: '#FF1E56', fontWeight: 'bold' }}>{stats.rejected}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Rejected</div>
              </div>
            </div>

            <button onClick={handleNextRound} style={{ width: '100%', padding: '16px', borderRadius: '14px', background: 'var(--accent-pink)', color: 'white', border: 'none', fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <RefreshCcw size={20} /> Next Bouncer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

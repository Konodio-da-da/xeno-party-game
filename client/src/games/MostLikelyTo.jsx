// client/src/games/MostLikelyTo.jsx
import { useState, useEffect } from 'react';
import { socket } from '../socket';
import { Flame, Trophy, CheckCircle2, ArrowLeft } from 'lucide-react';


const samplePrompts = [
  "Most likely to accidentally join a cult",
  "Most likely to text their ex at 3 AM",
  "Most likely to spend their rent money on online shopping",
  "Most likely to get kicked out of a club for no reason",
  "Most likely to become a secret millionaire"
];

export default function MostLikelyTo({ roomCode, players }) {
  const [promptIndex, setPromptIndex] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [results, setResults] = useState(null);

  const prompt = samplePrompts[promptIndex];

  useEffect(() => {
    socket.on('show-results', (voteTally) => {
      setResults(voteTally);
    });

    socket.on('advance-prompt', () => {
      setHasVoted(false);
      setSelectedTarget(null);
      setResults(null);
      setPromptIndex((prev) => (prev + 1) % samplePrompts.length);
    });

    return () => {
      socket.off('show-results');
      socket.off('advance-prompt');
    };
  }, []);

  const handleVote = (targetName) => {
    if (hasVoted) return;
    setSelectedTarget(targetName);
    setHasVoted(true);
    socket.emit('submit-vote', { roomCode, targetName });
  };

  const handleReturnToLobby = () => {
    socket.emit('return-to-lobby', { roomCode });
  };

  const handleNextPrompt = () => {
    socket.emit('next-prompt', { roomCode });
  };

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
            <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        <button 
          onClick={handleReturnToLobby} 
          style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '8px 12px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 'bold', zIndex: 10 }}
        >
          <ArrowLeft size={16} /> Lobby
        </button>
        
        <div style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center', zIndex: 0 }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', letterSpacing: '2px', fontWeight: 'bold' }}>LIVE: {roomCode}</span>
          <h1 style={{ fontSize: '1.2rem', color: 'white', marginTop: '2px' }}>Most Likely To</h1>
        </div>
        
        <div style={{ width: '60px' }}></div> {/* Spacer to keep center aligned */}
      </header>


      {/* Prompt Card */}
      <div style={{ backgroundColor: 'var(--bg-surface)', padding: '30px 20px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <Flame size={32} color="var(--accent-pink)" style={{ marginBottom: '10px' }} />
        <h2 style={{ fontSize: '1.25rem', lineHeight: '1.4', color: 'var(--text-primary)' }}>{prompt}</h2>
      </div>

      {/* Results View or Voting Buttons */}
      {results ? (
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '20px', borderRadius: '20px', border: '1px solid var(--accent-cyan)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--accent-cyan)' }}>
            <Trophy size={20} />
            <h3 style={{ fontSize: '1.1rem' }}>Vote Results</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {Object.entries(results).map(([name, count], idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-base)', borderRadius: '10px' }}>
                <span>{name}</span>
                <span style={{ fontWeight: 'bold', color: 'var(--accent-pink)' }}>{count} vote{count > 1 ? 's' : ''}</span>
              </div>
            ))}
          </div>

          <button 
            onClick={handleNextPrompt}
            style={{ padding: '14px', borderRadius: '12px', background: 'var(--accent-pink)', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}
          >
            Next Prompt
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {hasVoted ? "Waiting for other players to vote..." : "Tap who you're voting for:"}
          </p>
          
          {players.map((player, idx) => (
            <button
              key={idx}
              onClick={() => handleVote(player.name)}
              disabled={hasVoted}
              style={{
                padding: '14px',
                borderRadius: '12px',
                background: selectedTarget === player.name ? 'var(--accent-cyan)' : 'var(--bg-surface)',
                color: selectedTarget === player.name ? 'var(--bg-base)' : 'white',
                border: '1px solid rgba(255,255,255,0.05)',
                fontWeight: 'bold',
                fontSize: '1rem',
                cursor: hasVoted ? 'default' : 'pointer',
                opacity: hasVoted && selectedTarget !== player.name ? 0.5 : 1,
                transition: 'all 0.2s ease'
              }}
            >
              {player.name} {selectedTarget === player.name && " ✓"}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

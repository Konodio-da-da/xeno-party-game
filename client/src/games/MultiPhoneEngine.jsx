// client/src/games/MultiPhoneEngine.jsx
import { useState, useEffect } from 'react';
import { socket } from '../socket';
import { multiPhoneGamesCatalog } from '../data/multiPhoneGames';
import { Send, CheckCircle2, Trophy, Flame, ArrowLeft, ShieldQuestion, Timer } from 'lucide-react';
import DrawingCanvas from '../components/DrawingCanvas';
import SoundboardUI from './custom/SoundboardUI';
import { useStatsStore } from '../store/statsStore'; 

export default function MultiPhoneEngine({ roomCode, players, gameType }) {
  const recordGamePlayed = useStatsStore((state) => state.recordGamePlayed);
  
  // Identify the player by their unique live socket connection
  const myPlayer = players.find(p => p.id === socket.id);
  const myName = myPlayer ? myPlayer.name : "Unknown";
  const isHost = myPlayer ? myPlayer.isHost : false;

  if (gameType === 'soundboard') {
    return <SoundboardUI roomCode={roomCode} players={players} />;
  }
  
  const gameData = multiPhoneGamesCatalog[gameType] || Object.values(multiPhoneGamesCatalog)[0];
  
  // Detect Game Types
  const isDrawingGame = gameType === 'drawingBoard' || gameData?.id === 'drawingBoard';
  const isTwoTruths = gameType.includes('twoTruths') || gameData?.id?.includes('twoTruths');
  const isTrivia = gameType.includes('trivia') || gameData?.id?.includes('trivia');
  const isRankEm = gameType.includes('rankEm') || gameData?.id?.includes('rankEm');
  const isUpvoteDownvote = gameType.includes('upvote') || gameData?.id?.includes('upvote');
  const isImposterGame = gameType.includes('imposter') || gameType.includes('spyfall') || gameData?.id?.includes('imposter') || gameData?.id?.includes('spyfall') || gameData?.title?.toLowerCase().includes('imposter');

  // Universal State
  const [promptIndex, setPromptIndex] = useState(0);
  const [phase, setPhase] = useState('input');
  const [inputText, setInputText] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [votingPool, setVotingPool] = useState([]);
  const [selectedVote, setSelectedVote] = useState(null);
  const [results, setResults] = useState(null);

  // TTOL State
  const [ttolInputs, setTtolInputs] = useState({ truth1: '', truth2: '', lie: '' });
  const [ttolActiveSet, setTtolActiveSet] = useState(null);

  // Trivia State
  const [timeLeft, setTimeLeft] = useState(6);

  // Rank 'Em & Upvote State
  const [singleRankInput, setSingleRankInput] = useState('');
  const [sortableItems, setSortableItems] = useState([]);
  const [activeOpinion, setActiveOpinion] = useState(null);
  const [opinionResult, setOpinionResult] = useState(null);

  // Imposter State
  const [imposterData, setImposterData] = useState(null);
  const [accuseCooldown, setAccuseCooldown] = useState(0);
  const [autoContinueTimer, setAutoContinueTimer] = useState(3);

  const promptsList = gameData?.prompts || [{ text: "Respond to the prompt!" }];
  const currentPrompt = promptsList[promptIndex] || promptsList[0];
  const promptText = typeof currentPrompt === 'string' ? currentPrompt : (currentPrompt.text || currentPrompt.q || currentPrompt.secretLocation || "Respond to the prompt!");

  useEffect(() => {
    const activeGameData = multiPhoneGamesCatalog[gameType] || Object.values(multiPhoneGamesCatalog)[0];
    if (activeGameData) {
      recordGamePlayed(gameType, activeGameData.title);
    }
  }, [gameType, recordGamePlayed]);
  
  // TRIVIA TIMER EFFECT
  useEffect(() => {
    if (isTrivia && phase === 'input' && !hasSubmitted) {
      if (timeLeft > 0) {
        const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
        return () => clearTimeout(timer);
      } else if (timeLeft === 0) {
        handleTriviaSubmit("TIMEOUT");
      }
    }
  }, [isTrivia, phase, hasSubmitted, timeLeft]);

  // ACCUSATION COOLDOWN TICKER
  useEffect(() => {
    if (accuseCooldown > 0) {
      const timer = setTimeout(() => setAccuseCooldown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [accuseCooldown]);

  // AUTO-CONTINUE TICKER ON IMPOSTER RESULTS
  useEffect(() => {
    if (phase === 'imposter-results') {
      setAutoContinueTimer(3);
      const interval = setInterval(() => {
        setAutoContinueTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setPhase('imposter-role');
            setAccuseCooldown(20); // Reset 20s cooldown universally when back on role page
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [phase]);

  // IMPOSTER AUTO-START (Host triggers role assignment)
  useEffect(() => {
    if (isImposterGame && isHost && phase === 'input') {
      const catalog = gameData?.prompts || [{ secretLocation: "A VIP Nightclub" }];
      socket.emit('start-imposter-game', { roomCode, locationsCatalog: catalog });
    }
  }, [isImposterGame, isHost, phase]);

  // SOCKET LISTENERS
  useEffect(() => {
    socket.on('start-voting-phase', (anonymousAnswers) => {
      setVotingPool(anonymousAnswers);
      setPhase('voting');
      setHasSubmitted(false);
    });

    socket.on('start-drawing-voting', (anonymousDrawings) => {
      setVotingPool(anonymousDrawings);
      setPhase('voting');
      setHasSubmitted(false);
    });

    socket.on('show-universal-results', (finalResults) => {
      setResults(finalResults);
      setPhase('results');
    });

    socket.on('start-ttol-voting', (submission) => {
      setTtolActiveSet(submission);
      setPhase('ttol-voting');
      setHasSubmitted(false);
      setSelectedVote(null);
    });

    socket.on('ttol-results', (data) => {
      setResults(data);
      setPhase('ttol-results');
    });

    socket.on('trivia-results', (answersMap) => {
      setResults(answersMap);
      setPhase('trivia-results');
    });

    socket.on('start-rank-sorting', (pool) => {
      setSortableItems(pool);
      setPhase('rank-sorting');
      setHasSubmitted(false);
    });

    socket.on('show-ranking-leaderboard', (leaderboard) => {
      setResults(leaderboard);
      setPhase('rank-leaderboard');
    });

    socket.on('start-opinion-voting', (opinionData) => {
      setActiveOpinion(opinionData);
      setOpinionResult(null);
      setPhase('opinion-voting');
      setHasSubmitted(false);
      setSelectedVote(null);
    });

    socket.on('opinion-score-reveal', (resData) => {
      setOpinionResult(resData);
      setPhase('opinion-reveal');
    });

    socket.on('imposter-role-assigned', (data) => {
      setImposterData(data);
      setPhase('imposter-role');
      setAccuseCooldown(20); // 20s cooldown starts immediately upon entering role page
      setHasSubmitted(false);
      setSelectedVote(null);
    });

    socket.on('force-imposter-voting', () => {
      setPhase('imposter-voting');
      setHasSubmitted(false);
      setSelectedVote(null);
    });

    socket.on('imposter-results', (data) => {
      setResults(data);
      setPhase('imposter-results');
    });

    socket.on('advance-prompt', () => {
      setPhase('input');
      setHasSubmitted(false);
      setInputText('');
      setTtolInputs({ truth1: '', truth2: '', lie: '' });
      setSingleRankInput('');
      setSortableItems([]);
      setImposterData(null);
      setTtolActiveSet(null);
      setSelectedVote(null);
      setResults(null);
      setTimeLeft(6);
      setPromptIndex((prev) => (prev + 1) % promptsList.length);
    });

    return () => {
      socket.off('start-voting-phase');
      socket.off('start-drawing-voting');
      socket.off('show-universal-results');
      socket.off('start-ttol-voting');
      socket.off('ttol-results');
      socket.off('trivia-results');
      socket.off('start-rank-sorting');
      socket.off('show-ranking-leaderboard');
      socket.off('start-opinion-voting');
      socket.off('opinion-score-reveal');
      socket.off('imposter-role-assigned');
      socket.off('force-imposter-voting');
      socket.off('imposter-results');
      socket.off('advance-prompt');
    };
  }, [promptsList.length]);

  // --- HANDLERS ---
  
  const handleReturnToLobby = () => {
    socket.emit('return-to-lobby', { roomCode });
  };

  const handleTriggerAccusation = () => {
    if (accuseCooldown > 0) return;
    socket.emit('trigger-imposter-vote-phase', { roomCode });
  };

  const handleSubmitText = (e) => {
    e.preventDefault();
    if (!inputText.trim() || hasSubmitted) return;
    setHasSubmitted(true);
    socket.emit('submit-text-answer', { roomCode, text: inputText });
  };

  const handleSubmitDrawing = (base64Image) => {
    if (hasSubmitted) return;
    setHasSubmitted(true);
    socket.emit('submit-drawing', { roomCode, drawingData: base64Image });
  };

  const handleVote = (answerId) => {
    if (hasSubmitted) return;
    setSelectedVote(answerId);
    setHasSubmitted(true);
    socket.emit('submit-answer-vote', { roomCode, answerId });
  };

  const handleNextPrompt = () => {
    socket.emit('next-prompt', { roomCode });
  };

  const handleTtolSubmit = (e) => {
    e.preventDefault();
    if (!ttolInputs.truth1.trim() || !ttolInputs.truth2.trim() || !ttolInputs.lie.trim() || hasSubmitted) return;
    setHasSubmitted(true);
    
    const statements = [
      { id: 't1', text: ttolInputs.truth1 },
      { id: 't2', text: ttolInputs.truth2 },
      { id: 'lie', text: ttolInputs.lie }
    ];

    for (let i = statements.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [statements[i], statements[j]] = [statements[j], statements[i]];
    }

    socket.emit('submit-ttol', { roomCode, statements, lieId: 'lie' });
  };

  const handleTtolVote = (stmtId) => {
    if (hasSubmitted) return;
    setSelectedVote(stmtId);
    setHasSubmitted(true);
    socket.emit('submit-ttol-vote', { roomCode, voteId: stmtId });
  };

  const handleNextTtolRound = () => {
    socket.emit('next-ttol-round', { roomCode });
  };

  const handleTriviaSubmit = (answer) => {
    if (hasSubmitted) return;
    setHasSubmitted(true);
    setSelectedVote(answer);
    socket.emit('submit-trivia', { roomCode, answer });
  };

  const handleSingleRankSubmit = (e) => {
    e.preventDefault();
    if (!singleRankInput.trim() || hasSubmitted) return;
    setHasSubmitted(true);
    socket.emit('submit-rank-item', { roomCode, itemText: singleRankInput });
  };

  const moveSortableItem = (index, direction) => {
    const newItems = [...sortableItems];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setSortableItems(newItems);
  };

  const handleLockInFinalRanking = () => {
    if (hasSubmitted) return;
    setHasSubmitted(true);
    const rankedIds = sortableItems.map(i => i.id);
    socket.emit('submit-final-ranking', { roomCode, rankedIds });
  };

  const handleOpinionVote = (direction) => {
    if (hasSubmitted) return;
    setHasSubmitted(true);
    setSelectedVote(direction);
    socket.emit('vote-opinion', { roomCode, opinionId: activeOpinion.id, direction });
  };

  const handleNextOpinionRound = () => {
    socket.emit('next-opinion', { roomCode });
  };

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '400px', margin: '0 auto', paddingBottom: '80px' }}>
      
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        {isHost ? (
           <button onClick={handleReturnToLobby} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '8px 12px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 'bold', zIndex: 10 }}>
             <ArrowLeft size={16} /> Lobby
           </button>
        ) : <div style={{ width: '60px' }}></div>}
        
        <div style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center', zIndex: 0 }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', letterSpacing: '2px', fontWeight: 'bold' }}>LIVE: {roomCode}</span>
          <h1 style={{ fontSize: '1.2rem', color: 'white', marginTop: '2px' }}>{gameData?.title || 'XENO Live'}</h1>
        </div>
        
        <div style={{ width: '60px' }}></div> 
      </header>

      {/* Persistent Prompt Card */}
      {!isImposterGame && phase !== 'ttol-voting' && phase !== 'ttol-results' && phase !== 'trivia-results' && phase !== 'rank-sorting' && phase !== 'rank-leaderboard' && phase !== 'opinion-voting' && phase !== 'opinion-reveal' && (
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', zIndex: 1 }}>
          <Flame size={24} color="var(--accent-pink)" style={{ margin: '0 auto 10px' }} />
          <h2 style={{ fontSize: '1.1rem', lineHeight: '1.4', color: 'var(--text-primary)' }}>
            {promptText}
          </h2>
        </div>
      )}

      {/* IMPOSTER: WAITING */}
      {isImposterGame && phase === 'input' && (
        <div style={{ padding: '40px 20px', textAlign: 'center', background: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <Flame size={32} color="var(--accent-pink)" style={{ margin: '0 auto 15px', animation: 'pulse 1.5s infinite' }} />
          <h2 style={{ color: 'white', fontSize: '1.2rem' }}>Distributing Secret Roles...</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '8px' }}>The game is starting shortly!</p>
        </div>
      )}

      {/* PHASE 1: STANDARD INPUT */}
      {!isImposterGame && phase === 'input' && (
        <>
          {hasSubmitted ? (
            <div style={{ padding: '30px', textAlign: 'center', background: 'var(--bg-surface)', borderRadius: '16px' }}>
              <CheckCircle2 size={40} color="var(--accent-cyan)" style={{ margin: '0 auto 10px' }} />
              <p style={{ color: 'var(--text-muted)' }}>Locked in! Waiting for others...</p>
            </div>
          ) : isTrivia ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', color: timeLeft <= 3 ? '#FF1E56' : 'var(--accent-cyan)', marginBottom: '10px' }}>
                <Timer size={28} className={timeLeft <= 3 ? 'animate-pulse' : ''} />
                <h2 style={{ fontSize: '2.5rem', margin: 0 }}>{timeLeft}s</h2>
              </div>
              
              {currentPrompt.options?.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTriviaSubmit(opt)}
                  style={{
                    padding: '20px', borderRadius: '12px', textAlign: 'center', fontWeight: 'bold', fontSize: '1.1rem',
                    background: 'var(--bg-base)', border: '2px solid var(--accent-cyan)', color: 'white',
                    cursor: 'pointer', transition: 'all 0.1s'
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : isDrawingGame ? (
            <DrawingCanvas onSubmit={handleSubmitDrawing} />
          ) : isTwoTruths ? (
            <form onSubmit={handleTtolSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input 
                value={ttolInputs.truth1}
                onChange={(e) => setTtolInputs({...ttolInputs, truth1: e.target.value})}
                placeholder="Write Truth #1 here..."
                style={{ padding: '16px', borderRadius: '12px', background: 'var(--bg-base)', border: '1px solid #10b981', color: 'white', fontSize: '1rem' }}
              />
              <input 
                value={ttolInputs.truth2}
                onChange={(e) => setTtolInputs({...ttolInputs, truth2: e.target.value})}
                placeholder="Write Truth #2 here..."
                style={{ padding: '16px', borderRadius: '12px', background: 'var(--bg-base)', border: '1px solid #10b981', color: 'white', fontSize: '1rem' }}
              />
              <input 
                value={ttolInputs.lie}
                onChange={(e) => setTtolInputs({...ttolInputs, lie: e.target.value})}
                placeholder="Write your completely fake LIE here..."
                style={{ padding: '16px', borderRadius: '12px', background: 'var(--bg-base)', border: '1px solid #FF1E56', color: 'white', fontSize: '1rem' }}
              />
              <button type="submit" style={{ padding: '16px', borderRadius: '12px', background: 'var(--accent-cyan)', color: 'black', border: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', marginTop: '10px' }}>
                <ShieldQuestion size={18} /> Lock In Statements
              </button>
            </form>
          ) : isRankEm ? (
            <form onSubmit={handleSingleRankSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Type your single choice for this topic:</p>
              <input
                value={singleRankInput}
                onChange={(e) => setSingleRankInput(e.target.value)}
                placeholder="Type your answer here..."
                style={{ padding: '16px', borderRadius: '12px', background: 'var(--bg-base)', border: '1px solid var(--accent-cyan)', color: 'white', fontSize: '1rem' }}
              />
              <button type="submit" disabled={hasSubmitted} style={{ padding: '16px', borderRadius: '12px', background: 'var(--accent-cyan)', color: 'black', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
                {hasSubmitted ? "Locked In!" : "Submit Choice"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmitText} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <textarea 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your answer here..."
                rows={4}
                style={{ padding: '16px', borderRadius: '12px', background: 'var(--bg-base)', border: '1px solid var(--accent-pink)', color: 'white', fontSize: '1rem', resize: 'none' }}
              />
              <button 
                type="submit"
                style={{ padding: '16px', borderRadius: '12px', background: 'var(--accent-pink)', color: 'white', border: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
              >
                <Send size={18} /> Submit Answer
              </button>
            </form>
          )}
        </>
      )}

      {/* IMPOSTER: ROLE REVEAL PHASE */}
      {phase === 'imposter-role' && imposterData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--accent-cyan)', fontSize: '1.4rem' }}>Your Secret Role</h2>
          
          <div style={{ padding: '30px 20px', background: 'var(--bg-surface)', borderRadius: '16px', border: `2px solid ${imposterData.isImposter ? '#FF1E56' : '#10b981'}` }}>
            {imposterData.isImposter ? (
              <>
                <span style={{ fontSize: '2.5rem' }}>🕵️‍♂️</span>
                <h3 style={{ color: '#FF1E56', fontSize: '1.5rem', marginTop: '10px' }}>YOU ARE THE IMPOSTER</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>Blend in! You have no idea where the group is. Listen closely to everyone's questions.</p>
              </>
            ) : (
              <>
                <span style={{ fontSize: '2.5rem' }}>📍</span>
                <h3 style={{ color: '#10b981', fontSize: '1.2rem', marginTop: '10px' }}>SECRET LOCATION:</h3>
                <p style={{ color: 'white', fontSize: '1.4rem', fontWeight: 'bold', marginTop: '5px' }}>
                  {typeof imposterData.secretLocation === 'string' ? imposterData.secretLocation : (imposterData.secretLocation?.secretLocation || imposterData.secretLocation?.text || "Unknown Location")}
                </p>
                <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>Ask vague questions to find out who doesn't know this location.</p>
              </>
            )}
          </div>

          <button 
            onClick={handleTriggerAccusation}
            disabled={accuseCooldown > 0}
            style={{ 
              padding: '16px', borderRadius: '12px', 
              background: accuseCooldown > 0 ? 'rgba(255,255,255,0.1)' : 'var(--accent-pink)', 
              color: accuseCooldown > 0 ? 'var(--text-muted)' : 'white', 
              border: 'none', fontWeight: 'bold', cursor: accuseCooldown > 0 ? 'not-allowed' : 'pointer' 
            }}
          >
            {accuseCooldown > 0 ? `Start Accusation Vote (${accuseCooldown}s)` : 'Start Accusation Vote'}
          </button>
        </div>
      )}

      {/* IMPOSTER: VOTING PHASE */}
      {phase === 'imposter-voting' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'center' }}>
          <h2 style={{ color: '#FF1E56', fontSize: '1.4rem' }}>Who is the Imposter?</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Tap the player you want to accuse:</p>
          
          {players.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                if (hasSubmitted) return;
                setHasSubmitted(true);
                setSelectedVote(p.name);
                socket.emit('submit-imposter-vote', { roomCode, suspectName: p.name });
              }}
              disabled={hasSubmitted}
              style={{
                padding: '16px', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem',
                background: selectedVote === p.name ? '#FF1E56' : 'var(--bg-surface)',
                color: 'white', border: '1px solid rgba(255,255,255,0.1)', cursor: hasSubmitted ? 'default' : 'pointer'
              }}
            >
              {p.name}
            </button>
          ))}
        </div>
      )}

      {/* IMPOSTER: RESULTS PHASE WITH 3S AUTO-CONTINUE */}
      {phase === 'imposter-results' && results && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
          <h2 style={{ color: 'white', fontSize: '1.4rem' }}>Accusation Verdict</h2>
          
          <div style={{ padding: '20px', background: 'var(--bg-surface)', borderRadius: '16px', border: `2px solid ${results.caughtImposter ? '#10b981' : '#FF1E56'}` }}>
            <h3 style={{ color: results.caughtImposter ? '#10b981' : '#FF1E56', fontSize: '1.2rem', marginBottom: '8px' }}>
              {results.caughtImposter ? "🎉 IMPOSTER CAUGHT!" : "❌ WRONG ACCUSATION!"}
            </h3>
            <p style={{ color: 'white', fontSize: '0.95rem' }}>
              {results.caughtImposter 
                ? `The room successfully majority-voted ${results.mostVotedName} as the Imposter!`
                : `The room failed to catch the imposter. The game continues!`}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {Object.entries(results.tally).map(([name, votes]) => (
              <div key={name} style={{ padding: '12px', background: 'var(--bg-base)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'white' }}>{name}</span>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 'bold' }}>{votes} Vote{votes !== 1 && 's'}</span>
              </div>
            ))}
          </div>

          <button 
            onClick={() => {
              setPhase('imposter-role');
              setAccuseCooldown(20);
            }} 
            style={{ padding: '16px', borderRadius: '12px', background: 'var(--accent-cyan)', color: 'black', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}
          >
            Continue Playing ({autoContinueTimer}s)
          </button>
        </div>
      )}

      {/* PHASE 2.5: TTOL VOTING */}
      {phase === 'ttol-voting' && ttolActiveSet && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ color: 'white', textAlign: 'center', fontSize: '1.4rem' }}>
            Find <span style={{ color: 'var(--accent-pink)' }}>{ttolActiveSet.author}'s</span> Lie!
          </h2>
          
          {ttolActiveSet.author === myName ? (
             <div style={{ padding: '30px', textAlign: 'center', background: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
               <ShieldQuestion size={40} color="var(--accent-cyan)" style={{ margin: '0 auto 10px' }} />
               <p style={{ color: 'white', fontSize: '1.1rem' }}>It's your turn!</p>
               <p style={{ color: 'var(--text-muted)' }}>Watch everyone try to guess your lie.</p>
             </div>
          ) : (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
               <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                 {hasSubmitted ? "Waiting for everyone to vote..." : "Tap the statement you think is the LIE!"}
               </p>
               {ttolActiveSet.statements.map((stmt) => (
                 <button
                   key={stmt.id}
                   onClick={() => handleTtolVote(stmt.id)}
                   disabled={hasSubmitted}
                   style={{
                     padding: '20px 16px', borderRadius: '12px', textAlign: 'left',
                     background: selectedVote === stmt.id ? 'var(--accent-pink)' : 'var(--bg-surface)',
                     color: selectedVote === stmt.id ? 'white' : 'var(--text-primary)',
                     border: selectedVote === stmt.id ? '2px solid #FF1E56' : '1px solid rgba(255,255,255,0.05)',
                     cursor: hasSubmitted ? 'default' : 'pointer',
                     opacity: hasSubmitted && selectedVote !== stmt.id ? 0.4 : 1,
                     transition: 'all 0.2s ease', fontSize: '1.05rem', lineHeight: '1.4'
                   }}
                 >
                   {stmt.text}
                 </button>
               ))}
             </div>
          )}
        </div>
      )}

      {/* RANK 'EM SORTING PHASE (Drag/Pull UI) */}
      {phase === 'rank-sorting' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h2 style={{ color: 'white', textAlign: 'center', fontSize: '1.2rem' }}>Order from Best to Worst</h2>
          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {hasSubmitted ? "Locked in! Waiting for others..." : "Use arrows to sort your favorite at the top:"}
          </p>
          {sortableItems.map((item, idx) => (
            <div key={item.id} style={{ padding: '14px', background: 'var(--bg-surface)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 'bold', marginRight: '8px' }}>#{idx + 1}</span>
                <span style={{ color: 'white', fontWeight: 'bold' }}>{item.text}</span>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>by {item.author}</div>
              </div>
              {!hasSubmitted && (
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => moveSortableItem(idx, 'up')} disabled={idx === 0} style={{ padding: '8px 10px', background: 'var(--bg-base)', color: 'white', border: 'none', borderRadius: '8px', cursor: idx === 0 ? 'not-allowed' : 'pointer' }}>⬆️</button>
                  <button onClick={() => moveSortableItem(idx, 'down')} disabled={idx === sortableItems.length - 1} style={{ padding: '8px 10px', background: 'var(--bg-base)', color: 'white', border: 'none', borderRadius: '8px', cursor: idx === sortableItems.length - 1 ? 'not-allowed' : 'pointer' }}>⬇️</button>
                </div>
              )}
            </div>
          ))}
          {!hasSubmitted && (
            <button onClick={handleLockInFinalRanking} style={{ padding: '16px', borderRadius: '12px', background: 'var(--accent-cyan)', color: 'black', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginTop: '10px' }}>
              Lock In Order
            </button>
          )}
        </div>
      )}

      {/* RANK 'EM LEADERBOARD PHASE */}
      {phase === 'rank-leaderboard' && results && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 style={{ textAlign: 'center', color: 'var(--accent-cyan)' }}>Official Room Ranking</h3>
          {results.map((res, idx) => {
            const isLast = idx === results.length - 1;
            return (
              <div key={res.id} style={{ padding: '14px', background: 'var(--bg-surface)', borderRadius: '12px', border: `2px solid ${isLast ? '#FF1E56' : 'rgba(255,255,255,0.05)'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1.05rem' }}>{idx + 1}. {res.text}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Suggested by {res.author}</div>
                </div>
                {isLast && <div style={{ color: '#FF1E56', fontSize: '0.75rem', fontWeight: '900', textAlign: 'right' }}>DEAD LAST:<br/>TAKE A DRINK!</div>}
              </div>
            );
          })}
          {isHost && (
            <button onClick={handleNextPrompt} style={{ padding: '16px', borderRadius: '12px', background: 'var(--accent-pink)', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
              Next Round
            </button>
          )}
        </div>
      )}

      {/* OPINION VOTING PHASE (Upvote / Downvote) */}
      {phase === 'opinion-voting' && activeOpinion && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--accent-pink)', fontSize: '1.2rem' }}>Hot Take by {activeOpinion.author}</h2>
          <div style={{ padding: '30px 20px', background: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <p style={{ color: 'white', fontSize: '1.3rem', lineHeight: '1.4' }}>"{activeOpinion.text}"</p>
          </div>
          {activeOpinion.author === myName ? (
            <p style={{ color: 'var(--text-muted)' }}>Waiting for the room to judge your take...</p>
          ) : hasSubmitted ? (
            <p style={{ color: 'var(--accent-cyan)' }}>Vote recorded! Waiting for others...</p>
          ) : (
            <div style={{ display: 'flex', gap: '15px' }}>
              <button onClick={() => handleOpinionVote('down')} style={{ flex: 1, padding: '20px', background: 'rgba(255,30,86,0.2)', border: '2px solid #FF1E56', color: '#FF1E56', borderRadius: '16px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>
                👎 Downvote
              </button>
              <button onClick={() => handleOpinionVote('up')} style={{ flex: 1, padding: '20px', background: 'rgba(16,185,129,0.2)', border: '2px solid #10b981', color: '#10b981', borderRadius: '16px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>
                👍 Upvote
              </button>
            </div>
          )}
        </div>
      )}

      {/* OPINION SCORE REVEAL */}
      {phase === 'opinion-reveal' && opinionResult && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
          <h2 style={{ color: 'white', fontSize: '1.4rem' }}>{opinionResult.author}'s Verdict</h2>
          <div style={{ padding: '20px', background: 'var(--bg-surface)', borderRadius: '16px' }}>
            <p style={{ color: 'white', fontSize: '1.1rem', marginBottom: '15px' }}>"{opinionResult.text}"</p>
            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: opinionResult.score >= 0 ? '#10b981' : '#FF1E56' }}>
              {opinionResult.score > 0 ? `+${opinionResult.score}` : opinionResult.score}
            </div>
            <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>{opinionResult.score < 0 ? "Downvoted to oblivion! Take a sip." : "The room approves!"}</p>
          </div>
          {isHost && (
            <button onClick={handleNextOpinionRound} style={{ padding: '16px', borderRadius: '12px', background: 'var(--accent-cyan)', color: 'black', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
              Next Hot Take
            </button>
          )}
        </div>
      )}

      {/* PHASE 3.5: TTOL RESULTS */}
      {phase === 'ttol-results' && results && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ color: 'white', textAlign: 'center', fontSize: '1.4rem' }}>
            {results.author}'s Reveal
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {results.statements.map(stmt => {
              const isLie = stmt.id === results.lieId;
              return (
                <div key={stmt.id} style={{ padding: '16px', background: 'var(--bg-surface)', border: isLie ? '2px solid #FF1E56' : '1px solid rgba(16, 185, 129, 0.5)', borderRadius: '12px' }}>
                  <div style={{ color: 'white', fontSize: '1.1rem', marginBottom: '8px', opacity: isLie ? 1 : 0.6 }}>{stmt.text}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: isLie ? '#FF1E56' : '#10b981', fontSize: '0.85rem', fontWeight: '900', textTransform: 'uppercase' }}>
                      {isLie ? 'THE LIE' : 'TRUTH'}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      {results.tally[stmt.id] || 0} Votes
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {isHost && (
            <button onClick={handleNextTtolRound} style={{ padding: '16px', borderRadius: '12px', background: 'var(--accent-cyan)', color: 'black', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
              Next Player's Truths
            </button>
          )}
        </div>
      )}

      {/* PHASE 3.6: TRIVIA RESULTS */}
      {phase === 'trivia-results' && results && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ padding: '20px', background: 'var(--bg-surface)', borderRadius: '16px', textAlign: 'center', border: '2px solid var(--accent-cyan)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Correct Answer</span>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginTop: '5px' }}>{currentPrompt.answer}</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.entries(results).map(([playerDisplayName, playerAnswer]) => {
              const isCorrect = playerAnswer === currentPrompt.answer;
              const isTimeout = playerAnswer === "TIMEOUT";
              
              return (
                <div key={playerDisplayName} style={{ padding: '16px', borderRadius: '12px', background: 'var(--bg-base)', border: `2px solid ${isCorrect ? '#10b981' : '#FF1E56'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'white', fontWeight: 'bold' }}>{playerDisplayName}</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Guessed: {isTimeout ? 'Nothing' : playerAnswer}</div>
                    <div style={{ color: isCorrect ? '#10b981' : '#FF1E56', fontWeight: '900', fontSize: '1.1rem' }}>
                      {isTimeout ? 'OUT OF TIME' : (isCorrect ? 'SAFE' : 'DRINK!')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {isHost && (
            <button onClick={handleNextPrompt} style={{ padding: '16px', borderRadius: '12px', background: 'var(--accent-pink)', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
              Next Question
            </button>
          )}
        </div>
      )}

      {/* UNIVERSAL VOTING / RESULTS CODE */}
      {phase === 'voting' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {hasSubmitted ? "Waiting for everyone to vote..." : "Vote for the best submission!"}
          </p>
          
          {votingPool.map((answer) => (
            <div
              key={answer.id}
              onClick={() => handleVote(answer.id)}
              style={{
                borderRadius: '12px',
                background: selectedVote === answer.id ? 'var(--accent-cyan)' : 'var(--bg-surface)',
                border: '1px solid rgba(255,255,255,0.05)',
                cursor: hasSubmitted ? 'default' : 'pointer',
                opacity: hasSubmitted && selectedVote !== answer.id ? 0.5 : 1,
                overflow: 'hidden',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {answer.image ? (
                <img src={answer.image} alt="Player Drawing" style={{ width: '100%', backgroundColor: '#fff' }} />
              ) : (
                <div style={{ padding: '16px', color: selectedVote === answer.id ? 'var(--bg-base)' : 'white' }}>
                  {answer.text}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {phase === 'results' && results && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--accent-cyan)', marginBottom: '10px' }}>
            <Trophy size={24} />
            <h3 style={{ fontSize: '1.2rem' }}>Final Results</h3>
          </div>
          
          {results.map((res, idx) => (
            <div key={idx} style={{ padding: '14px', background: idx === 0 ? 'rgba(0, 240, 255, 0.1)' : 'var(--bg-surface)', border: idx === 0 ? '1px solid var(--accent-cyan)' : '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>By: <strong style={{ color: 'white' }}>{res.author}</strong></span>
                <span style={{ fontWeight: 'bold', color: 'var(--accent-pink)' }}>{res.votes} Vote{res.votes !== 1 && 's'}</span>
              </div>
              
              {res.image ? (
                <img src={res.image} alt="Winning Drawing" style={{ width: '100%', borderRadius: '8px', backgroundColor: '#fff' }} />
              ) : (
                <p style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>"{res.text}"</p>
              )}
            </div>
          ))}

          {isHost && (
            <button 
              onClick={handleNextPrompt}
              style={{ padding: '16px', borderRadius: '12px', background: 'var(--accent-pink)', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}
            >
              Next Round
            </button>
          )}
        </div>
      )}
    </div>
  );
}

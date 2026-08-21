// client/src/games/custom/StoryModeUI.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Send, Play, RefreshCcw } from 'lucide-react';
import { singlePhoneGamesCatalog } from '../../data/singlePhoneGames';
import { usePlayerStore } from '../../store/playerStore';
import { triggerVibration, playSound } from '../../utils/soundManager';

// Fallback templates in case the catalog doesn't have them formatted right
const STORY_TEMPLATES = [
  {
    title: "The Wild Night Out",
    blanks: ["Adjective", "Noun (Animal)", "Verb (Past Tense)", "A Place", "Plural Noun", "Exclamation"],
    generate: (words, pA, pB) => `It was a incredibly ${words[0]} night. ${pA} and ${pB} were riding a giant ${words[1]} when they suddenly ${words[2]} straight into ${words[3]}. "Watch out for the ${words[4]}!" ${pA} screamed. ${pB} just looked back and yelled, "${words[5]}!"`
  },
  {
    title: "The Secret Weapon",
    blanks: ["Body Part", "Adjective", "Type of Food", "Verb (Ending in -ing)", "Noun", "A Celebrity Name"],
    generate: (words, pA, pB) => `${pA} woke up with a sharp pain in their ${words[0]}. It felt extremely ${words[1]}. To cure it, ${pB} suggested rubbing a mashed ${words[2]} on it while ${words[3]} around a ${words[4]}. Strangely enough, it worked, but now ${pA} sounds exactly like ${words[5]}.`
  }
];

export default function StoryModeUI() {
  const navigate = useNavigate();
  const gameData = singlePhoneGamesCatalog.storyMode || { title: 'Story Mode' };
  const players = usePlayerStore((state) => state.players).filter(p => p.trim() !== '');
  
  const [template, setTemplate] = useState(null);
  const [currentBlankIndex, setCurrentBlankIndex] = useState(0);
  const [userInputs, setUserInputs] = useState([]);
  const [currentInput, setCurrentInput] = useState("");
  const [phase, setPhase] = useState("input"); // 'input' | 'reveal'
  const [finalStory, setFinalStory] = useState("");

  useEffect(() => {
    startNewStory();
  }, []);

  const startNewStory = () => {
    const randomTemplate = STORY_TEMPLATES[Math.floor(Math.random() * STORY_TEMPLATES.length)];
    setTemplate(randomTemplate);
    setUserInputs([]);
    setCurrentBlankIndex(0);
    setCurrentInput("");
    setPhase("input");
  };

  const handleNextWord = (e) => {
    e.preventDefault();
    if (!currentInput.trim()) return;

    playSound('swipe');
    triggerVibration(20);

    const newInputs = [...userInputs, currentInput.trim()];
    setUserInputs(newInputs);
    setCurrentInput("");

    if (newInputs.length >= template.blanks.length) {
      // Generate the story!
      let pA = players[0] || "Player A";
      let pB = players[1] || "Player B";
      
      // Shuffle players for randomness if we have enough
      if (players.length > 2) {
        const shuffled = [...players].sort(() => Math.random() - 0.5);
        pA = shuffled[0];
        pB = shuffled[1];
      }

      const generatedText = template.generate(newInputs, pA, pB);
      setFinalStory(generatedText);
      setPhase("reveal");
      playSound('success');
      triggerVibration(100);
    } else {
      setCurrentBlankIndex(prev => prev + 1);
    }
  };

  const handleReadAloud = () => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(finalStory);
    utterance.rate = 0.9;
    utterance.pitch = 1.2;
    window.speechSynthesis.speak(utterance);
    triggerVibration(30);
  };

  if (!template) return null;

  // Determine whose turn it is to type the word
  const currentPlayer = players.length > 0 ? players[currentBlankIndex % players.length] : "Player";

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: '85vh', justifyContent: 'space-between' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => { window.speechSynthesis.cancel(); navigate('/games'); }} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ArrowLeft size={20} /> Library
        </button>
        <span style={{ fontSize: '0.75rem', color: 'var(--accent-pink)', fontWeight: 'bold', textTransform: 'uppercase' }}>{gameData.title}</span>
      </header>

      {phase === "input" ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '20px' }}>
          <div style={{ textAlign: 'center' }}>
            <BookOpen size={48} color="var(--accent-cyan)" style={{ margin: '0 auto 10px' }} />
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '5px' }}>{template.title}</h2>
            <p style={{ color: 'var(--text-muted)' }}>Word {currentBlankIndex + 1} of {template.blanks.length}</p>
          </div>

          <div style={{ backgroundColor: 'var(--bg-surface)', padding: '30px 20px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            <p style={{ color: 'var(--accent-pink)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '10px' }}>{currentPlayer}'s Turn!</p>
            <h3 style={{ color: 'white', fontSize: '1.8rem', marginBottom: '20px' }}>Enter a {template.blanks[currentBlankIndex]}</h3>
            
            <form onSubmit={handleNextWord} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input 
                type="text" 
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                placeholder="Type your word..."
                autoFocus
                style={{ width: '100%', padding: '16px', borderRadius: '12px', background: 'var(--bg-base)', border: '2px solid var(--accent-cyan)', color: 'white', fontSize: '1.2rem', textAlign: 'center' }}
              />
              <button type="submit" disabled={!currentInput.trim()} style={{ width: '100%', padding: '16px', borderRadius: '12px', background: currentInput.trim() ? 'var(--accent-cyan)' : 'var(--bg-base)', color: currentInput.trim() ? '#000' : 'var(--text-muted)', border: 'none', fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: currentInput.trim() ? 'pointer' : 'not-allowed' }}>
                <Send size={20} /> Next Word
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '20px' }}>
          <div style={{ backgroundColor: 'var(--bg-surface)', padding: '30px 20px', borderRadius: '24px', border: '2px solid var(--accent-pink)', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            <h2 style={{ color: 'var(--accent-cyan)', fontSize: '1.8rem', marginBottom: '20px' }}>{template.title}</h2>
            <p style={{ color: 'white', fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '20px', textAlign: 'left' }}>
              {finalStory}
            </p>
            
            <button onClick={handleReadAloud} style={{ width: '100%', padding: '16px', borderRadius: '12px', background: 'white', color: '#000', border: 'none', fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <Play size={20} /> Read Aloud (TTS)
            </button>
          </div>

          <button onClick={startNewStory} style={{ width: '100%', padding: '16px', borderRadius: '14px', background: 'var(--accent-pink)', color: 'white', border: 'none', fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <RefreshCcw size={20} /> Create New Story
          </button>
        </div>
      )}
    </div>
  );
}

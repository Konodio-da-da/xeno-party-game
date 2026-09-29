// client/src/games/SinglePhoneEngine.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useStatsStore } from '../store/statsStore';
import { singlePhoneGamesCatalog } from '../data/singlePhoneGames';
import { adultGamesCatalog } from '../data/adultGamesCatalog';

import CardEngine from './custom/CardEngine';
import SpinTheWheelUI from './custom/SpinTheWheelUI';
import RussianRouletteUI from './custom/RussianRouletteUI';
import KingsCupUI from './custom/KingsCupUI';
import TriviaSurvivalUI from './custom/TriviaSurvivalUI';
import TimedChallengeUI from './custom/TimedChallengeUI'; 
import SimonSaysUI from './custom/SimonSaysUI';
import ParanoiaUI from './custom/ParanoiaUI';
import DiceOfDoomUI from './custom/DiceOfDoomUI'; 
import HigherLowerUI from './custom/HigherLowerUI'; 
import CharadesUI from './custom/CharadesUI'; 
import FingerOnScreenUI from './custom/FingerOnScreenUI'; 
import StoryModeUI from './custom/StoryModeUI'; 
import BouncerUI from './custom/BouncerUI'; 

export default function SinglePhoneEngine() {
  const { gameId } = useParams();
  const recordGamePlayed = useStatsStore((state) => state.recordGamePlayed);
  
  // Set default to mix all catalogs together
  const [freakLevel, setFreakLevel] = useState('default');

  const gameData = singlePhoneGamesCatalog[gameId] || adultGamesCatalog[gameId];

  useEffect(() => {
    if (gameData) {
      recordGamePlayed(gameId, gameData.title);
    }
  }, [gameId, recordGamePlayed, gameData]);

  const hasFreakLevels = gameData?.prompts && !Array.isArray(gameData.prompts);

  const renderEngine = () => {
    switch (gameId) {
      case 'spinTheWheel': return <SpinTheWheelUI />;
      case 'russianRoulette': return <RussianRouletteUI />;
      case 'kingsCup': return <KingsCupUI />;
      case 'brainFreeze':
      case 'triviaSurvival': return <TriviaSurvivalUI />;
      case 'tongueTwister':
      case 'impressionist': return <TimedChallengeUI gameId={gameId} />;
      case 'simonSays': return <SimonSaysUI />;
      case 'paranoia': return <ParanoiaUI />;
      case 'diceOfDoom': return <DiceOfDoomUI />;
      case 'higherOrLower': return <HigherLowerUI />;
      case 'charades': return <CharadesUI />; 
      case 'fingersGame':
      case 'fingerOnScreen': return <FingerOnScreenUI />; 
      case 'storyMode': return <StoryModeUI />;
      case 'theBouncer': return <BouncerUI />;
      default:
        return <CardEngine gameId={gameId} freakLevel={freakLevel} />;
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {hasFreakLevels && (
        <div style={{ position: 'absolute', top: '10px', left: 0, right: 0, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', zIndex: 50, gap: '6px', padding: '0 10px' }}>
          {['default', 'spicy', 'spicier', 'spiciest'].map(level => (
            <button
              key={level}
              onClick={() => setFreakLevel(level)}
              style={{
                padding: '6px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer',
                background: freakLevel === level ? '#FF1E56' : 'rgba(0,0,0,0.5)',
                color: 'white', border: freakLevel === level ? '1px solid #FF1E56' : '1px solid rgba(255,255,255,0.2)'
              }}
            >
              {level.toUpperCase()}
            </button>
          ))}
        </div>
      )}
      
      {renderEngine()}
    </div>
  );
}

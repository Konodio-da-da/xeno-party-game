// client/src/games/SinglePhoneEngine.jsx
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useStatsStore } from '../store/statsStore';
import { singlePhoneGamesCatalog } from '../data/singlePhoneGames';

import CardEngine from './custom/CardEngine';
import SpinTheWheelUI from './custom/SpinTheWheelUI';
import RussianRouletteUI from './custom/RussianRouletteUI';
import KingsCupUI from './custom/KingsCupUI';
import TriviaSurvivalUI from './custom/TriviaSurvivalUI';
import TimedChallengeUI from './custom/TimedChallengeUI'; // <-- Import
import SimonSaysUI from './custom/SimonSaysUI';
import ParanoiaUI from './custom/ParanoiaUI';
import DiceOfDoomUI from './custom/DiceOfDoomUI'; // <-- Add
import HigherLowerUI from './custom/HigherLowerUI'; // <-- Add
import CharadesUI from './custom/CharadesUI'; // <-- Add this
import FingerOnScreenUI from './custom/FingerOnScreenUI'; // <-- Add Import
import StoryModeUI from './custom/StoryModeUI'; // <-- Add Import
import BouncerUI from './custom/BouncerUI'; // <-- Add Import



export default function SinglePhoneEngine() {
  const { gameId } = useParams();
  const recordGamePlayed = useStatsStore((state) => state.recordGamePlayed);

  useEffect(() => {
    const gameData = singlePhoneGamesCatalog[gameId];
    if (gameData) {
      recordGamePlayed(gameId, gameData.title);
    }
  }, [gameId, recordGamePlayed]);

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
    case 'charades': return <CharadesUI />; // <-- Route this
    case 'fingersGame':
    case 'fingerOnScreen': 
      return <FingerOnScreenUI />; 
      case 'storyMode':          
      return <StoryModeUI />;
      case 'theBouncer':          
      return <BouncerUI />;
    default:
      return <CardEngine gameId={gameId} />;
  }
}

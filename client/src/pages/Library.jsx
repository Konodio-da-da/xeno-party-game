// client/src/pages/Library.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smartphone, Users, Flame, Skull, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import GameModal from '../components/GameModal';
import ShopModal from '../components/ShopModal';
import { singlePhoneGamesCatalog } from '../data/singlePhoneGames';
import { multiPhoneGamesCatalog } from '../data/multiPhoneGames';
import { usePlayerStore } from '../store/playerStore';
import { useShopStore } from '../store/shopStore';
import { expansionPacks } from '../data/expansionPacks';

export default function Library() {
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState(null);
  const [openSection, setOpenSection] = useState('single'); // Default open single player
  const [isShopOpen, setIsShopOpen] = useState(false);
  
  const players = usePlayerStore((state) => state.players);
  const { isPackUnlocked } = useShopStore();

  // Helper to check if a game is locked behind a premium pack
  const getRequiredPack = (gameId) => {
    return expansionPacks.find(pack => pack.gamesIncluded.includes(gameId));
  };

  const handleGameSelect = (game, category) => {
    const requiredPack = getRequiredPack(game.id);
    
    // If the game belongs to a premium pack and it is NOT unlocked
    if (requiredPack && !isPackUnlocked(requiredPack.id)) {
      setIsShopOpen(true);
      return; // Stop the game from opening
    }

    // Otherwise, open the game details modal
    setSelectedGame({ ...game, category });
  };

  const handleStartGame = (game) => {
    setSelectedGame(null);
    if (game.category === "Single Phone") {
      // Check if we already have at least 2 valid players set up
      const hasEnoughPlayers = players && players.filter(p => p.trim() !== '').length >= 2;

      if (hasEnoughPlayers) {
        // Blast them straight into the game!
        navigate(`/play/${game.id}`);
      } else {
        // Passes the clicked game ID directly to player setup
        navigate('/setup-players', { state: { targetGameId: game.id } });
      }
    } else {
      // Passes the selected multiplayer game directly to the lobby
      navigate('/multiplayer', { state: { selectedGame: game } });
    }
  };

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '100px', maxWidth: '480px', margin: '0 auto' }}>
      <header>
        <h1 style={{ color: 'var(--accent-cyan)', fontSize: '2rem', marginBottom: '5px' }}>Game Vault</h1>
        <p style={{ color: 'var(--text-muted)' }}>Select a category to pick your game option.</p>
      </header>

      {/* Single Phone Section */}
      <section>
        <div 
          onClick={() => toggleSection('single')}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: 'var(--bg-surface)', borderRadius: '16px', cursor: 'pointer', border: openSection === 'single' ? '1px solid var(--accent-pink)' : '1px solid rgba(255,255,255,0.05)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Smartphone size={24} color="var(--accent-pink)" />
            <h2 style={{ fontSize: '1.2rem', color: 'white' }}>Single Phone Games</h2>
          </div>
          {openSection === 'single' ? <ChevronUp color="var(--text-muted)" /> : <ChevronDown color="var(--text-muted)" />}
        </div>
        
        {openSection === 'single' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px', paddingLeft: '10px' }}>
            {Object.values(singlePhoneGamesCatalog).map((game) => {
              const requiredPack = getRequiredPack(game.id);
              const isLocked = requiredPack && !isPackUnlocked(requiredPack.id);

              return (
                <div 
                  key={game.id}
                  onClick={() => handleGameSelect(game, 'Single Phone')}
                  style={{ 
                    backgroundColor: 'var(--bg-surface)', 
                    padding: '16px 20px', 
                    borderRadius: '12px', 
                    border: isLocked ? '1px solid rgba(255, 255, 255, 0.02)' : '1px solid rgba(255, 255, 255, 0.05)', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    opacity: isLocked ? 0.5 : 1, // Dim locked games
                    transition: 'opacity 0.2s'
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '1.05rem', marginBottom: '4px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {game.title} {isLocked && <Lock size={16} color="var(--accent-pink)" />}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {isLocked ? `Requires: ${requiredPack.title}` : game.description}
                    </p>
                  </div>
                  {isLocked ? <Lock size={20} color="var(--text-muted)" /> : <Flame size={20} color="var(--accent-pink)" />}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Multi-Phone Live Section */}
      <section>
        <div 
          onClick={() => toggleSection('multi')}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: 'var(--bg-surface)', borderRadius: '16px', cursor: 'pointer', border: openSection === 'multi' ? '1px solid var(--accent-cyan)' : '1px solid rgba(255,255,255,0.05)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={24} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.2rem', color: 'white' }}>Multi-Phone Live</h2>
          </div>
          {openSection === 'multi' ? <ChevronUp color="var(--text-muted)" /> : <ChevronDown color="var(--text-muted)" />}
        </div>
        
        {openSection === 'multi' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px', paddingLeft: '10px' }}>
            {Object.values(multiPhoneGamesCatalog).map((game) => {
              const requiredPack = getRequiredPack(game.id);
              const isLocked = requiredPack && !isPackUnlocked(requiredPack.id);

              return (
                <div 
                  key={game.id}
                  onClick={() => handleGameSelect(game, 'Multi-Phone')}
                  style={{ 
                    backgroundColor: 'var(--bg-surface)', 
                    padding: '16px 20px', 
                    borderRadius: '12px', 
                    border: isLocked ? '1px solid rgba(255, 255, 255, 0.02)' : '1px solid rgba(255, 255, 255, 0.05)', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    opacity: isLocked ? 0.5 : 1, // Dim locked games
                    transition: 'opacity 0.2s'
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '1.05rem', marginBottom: '4px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {game.title} {isLocked && <Lock size={16} color="var(--accent-cyan)" />}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {isLocked ? `Requires: ${requiredPack.title}` : game.description}
                    </p>
                  </div>
                  {isLocked ? <Lock size={20} color="var(--text-muted)" /> : <Skull size={20} color="var(--accent-cyan)" />}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Render Modals */}
      <GameModal isOpen={!!selectedGame} onClose={() => setSelectedGame(null)} game={selectedGame} onStart={() => handleStartGame(selectedGame)} />
      <ShopModal isOpen={isShopOpen} onClose={() => setIsShopOpen(false)} />
    </div>
  );
}

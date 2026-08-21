// client/src/components/BottomNav.jsx
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Library, UserCircle2, ShoppingBag } from 'lucide-react';
import ShopModal from './ShopModal';
import '../styles/BottomNav.css';

export default function BottomNav() {
  const [isShopOpen, setIsShopOpen] = useState(false);

  return (
    <>
      <nav className="bottom-nav">
        <NavLink 
          to="/" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          <Home size={24} />
          <span>HUB</span>
        </NavLink>

        <NavLink 
          to="/games" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          <Library size={24} />
          <span>GAMES</span>
        </NavLink>

        {/* Shop Button Trigger */}
        <button 
          onClick={() => setIsShopOpen(true)}
          className="nav-item"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-pink)' }}
        >
          <ShoppingBag size={24} />
          <span>SHOP</span>
        </button>

        <NavLink 
          to="/profile" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          <UserCircle2 size={24} />
          <span>PROFILE</span>
        </NavLink>
      </nav>

      {/* Render the Shop Modal */}
      <ShopModal isOpen={isShopOpen} onClose={() => setIsShopOpen(false)} />
    </>
  );
}

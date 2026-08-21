// client/src/components/Layout.jsx
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function Layout() {
  return (
    <>
      {/* Outlet is where our specific page content (Home, Lobby, Game) will render */}
      <main className="app-content">
        <Outlet />
      </main>
      
      {/* BottomNav stays fixed at the bottom */}
      <BottomNav />
    </>
  );
}

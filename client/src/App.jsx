// client/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Library from './pages/Library';
import PlayerSetup from './pages/PlayerSetup';
import MultiplayerLobby from './pages/MultiplayerLobby';
import Profile from './pages/Profile';
import SinglePhoneEngine from './games/SinglePhoneEngine';
import Success from './pages/Success';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Main App Layout with Bottom Nav */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="games" element={<Library />} />
          <Route path="profile" element={<Profile />} />
          
          <Route path="setup-players" element={<PlayerSetup />} />
          <Route path="multiplayer" element={<MultiplayerLobby />} />
          <Route path="play/:gameId" element={<SinglePhoneEngine />} />
        </Route>

        {/* Standalone Success Route for Paystack Redirect */}
        <Route path="/success" element={<Success />} />
      </Routes>
    </Router>
  );
}

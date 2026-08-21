// client/src/pages/Success.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useShopStore } from '../store/shopStore';
import { CheckCircle, Loader2 } from 'lucide-react';

export default function Success() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const unlockPack = useShopStore((state) => state.unlockPack);
  const [status, setStatus] = useState('Verifying your purchase...');

  useEffect(() => {
    const packId = searchParams.get('packId');
    
    if (packId) {
      // Unlock the pack permanently in local storage
      unlockPack(packId);
      setStatus('Payment Successful! Unlocking your premium pack...');
      
      // Send them back to the games library after 3 seconds
      setTimeout(() => {
        navigate('/games');
      }, 3000);
    } else {
      setStatus('Invalid session. Redirecting...');
      setTimeout(() => {
        navigate('/games');
      }, 2000);
    }
  }, [searchParams, unlockPack, navigate]);

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', 
      justifyContent: 'center', height: '100vh', padding: '20px', 
      textAlign: 'center', background: 'var(--bg-base)' 
    }}>
      <CheckCircle size={80} color="#10b981" style={{ marginBottom: '20px' }} />
      <h1 style={{ color: 'white', marginBottom: '10px' }}>You're all set!</h1>
      <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Loader2 className="animate-spin" size={18} /> {status}
      </p>
    </div>
  );
}

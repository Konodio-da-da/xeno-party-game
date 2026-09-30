// client/src/components/ShopModal.jsx
import React, { useState } from 'react';
import { useShopStore } from '../store/shopStore';
import { expansionPacks } from '../data/expansionPacks';
import { ShoppingBag, CheckCircle, Sparkles, X, Mail, Loader2 } from 'lucide-react';

export default function ShopModal({ isOpen, onClose }) {
  const { unlockedPacks, unlockPack } = useShopStore();
  const [userEmail, setUserEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  if (!isOpen) return null;

    const handlePurchase = async (pack) => {
    if (!userEmail) {
      setMessage({ text: 'Please enter your email to proceed with the purchase.', type: 'error' });
      return;
    }

    setIsProcessing(true);
    setMessage({ text: 'Connecting to server...', type: 'success' });

    try {
      // BULLETPROOF PRICE EXTRACTOR:
      // Tries to use numericPrice. If missing, it extracts "1,500" from "1,500 NGN", removes the comma, and converts to 1500.
      let rawPrice = pack.numericPrice;
      if (!rawPrice) {
        rawPrice = parseInt(pack.price.split(' ')[0].replace(/,/g, ''), 10);
      }
      
      const priceInKobo = rawPrice * 100;

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

      // Log the exact payload to your browser console so you can see the math working
      console.log("Sending checkout payload:", { 
        packId: pack.id, 
        rawPriceExtracted: rawPrice,
        priceInKobo: priceInKobo,
        email: userEmail 
      });

      const response = await fetch(`${API_URL}/api/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packId: pack.id,
          packTitle: pack.title,
          packPriceInKobo: priceInKobo,
          email: userEmail.toLowerCase().trim()
        }),
      });

      const session = await response.json();
      console.log("Response from backend:", session);

      if (session.url) {
        window.location.href = session.url;
      } else {
        setMessage({ text: session.error || 'Failed to initiate payment.', type: 'error' });
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Client fetch error:", error);
      setMessage({ text: 'Checkout error. Check browser console.', type: 'error' });
      setIsProcessing(false);
    }
  };


  const handleRestore = async () => {
    if (!userEmail) {
      setMessage({ text: 'Please enter your email to restore purchases.', type: 'error' });
      return;
    }
    
    setIsProcessing(true);
    setMessage({ text: '', type: '' });

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

      const response = await fetch(`${API_URL}/api/restore-purchases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail.toLowerCase().trim() })
      });
      
      const data = await response.json();
      
      if (data.unlockedPacks && data.unlockedPacks.length > 0) {
        data.unlockedPacks.forEach(packId => unlockPack(packId));
        setMessage({ text: 'Purchases successfully restored!', type: 'success' });
      } else {
        setMessage({ text: 'No purchases found for this email.', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Failed to connect to server.', type: 'error' });
    }
    
    setIsProcessing(false);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div style={{ background: 'var(--bg-base)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', maxWidth: '450px', width: '100%', padding: '25px', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '90vh', overflowY: 'auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)' }}>
            <ShoppingBag size={24} />
            <h2 style={{ fontSize: '1.3rem', color: 'white', margin: 0 }}>XENO Shop</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {/* Global Email Anchor */}
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 10px 0' }}>
            Enter your email below to unlock premium packs or restore past purchases.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-surface)', borderRadius: '12px', padding: '0 12px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Mail size={18} color="var(--accent-cyan)" />
            <input 
              type="email" 
              placeholder="your@email.com" 
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', padding: '14px', outline: 'none', fontSize: '1rem' }}
            />
          </div>
          {message.text && (
            <p style={{ color: message.type === 'success' ? '#10b981' : 'var(--accent-pink)', fontSize: '0.85rem', marginTop: '10px', textAlign: 'center' }}>
              {message.text}
            </p>
          )}
        </div>

        {/* Premium Packs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {expansionPacks.map((pack) => {
            const isUnlocked = unlockedPacks.includes(pack.id);

            return (
              <div key={pack.id} style={{ background: 'var(--bg-surface)', padding: '20px', borderRadius: '16px', border: `2px solid ${isUnlocked ? '#10b981' : 'rgba(255,255,255,0.05)'}`, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', color: 'white', margin: '0 0 4px 0' }}>{pack.title}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{pack.description}</p>
                  </div>
                  <span style={{ fontWeight: 'bold', color: pack.color || 'var(--accent-pink)', fontSize: '0.95rem', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '8px' }}>
                    {pack.price}
                  </span>
                </div>

                <button
                  onClick={() => !isUnlocked && handlePurchase(pack)}
                  disabled={isUnlocked || isProcessing}
                  style={{
                    padding: '12px', borderRadius: '12px', fontWeight: 'bold', fontSize: '0.95rem', border: 'none',
                    background: isUnlocked ? 'rgba(16, 185, 129, 0.2)' : 'var(--accent-pink)',
                    color: isUnlocked ? '#10b981' : 'white', cursor: isUnlocked ? 'default' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                  }}
                >
                  {isUnlocked ? <><CheckCircle size={18} /> Unlocked</> : <><Sparkles size={18} /> Buy Now</>}
                </button>
              </div>
            );
          })}
        </div>

        {/* Restore Button */}
        <button 
          onClick={handleRestore}
          disabled={isProcessing}
          style={{ background: 'transparent', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
        >
          {isProcessing ? <Loader2 className="animate-spin" size={16} /> : 'Restore Purchases'}
        </button>

      </div>
    </div>
  );
}

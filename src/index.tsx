import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import PlatformSelectionUI from '../PlatformSelectionUI';

const initialPlatforms = [
  "YouTube",
  "Facebook",
  "Twitch",
  "Instagram",
  "LinkedIn",
  "Twitter (X)",
  "WeChat",
  "Kick",
  "Trovo",
  "DLive",
  "Vimeo",
  "TikTok",
  "Custom RTMP"
];

const App: React.FC = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [platforms, setPlatforms] = useState<string[]>(initialPlatforms);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setEmail('');
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
      console.error('Subscription error:', error);
    }
  };

  return (
    <div>
      <PlatformSelectionUI
        allPlatforms={platforms}
        setAllPlatforms={setPlatforms}
        selectedPlatforms={selected}
        setSelectedPlatforms={setSelected}
      />
      <div style={{ padding: '20px', marginTop: '20px', borderTop: '1px solid #ccc' }}>
        <h2>Subscribe for updates</h2>
        <form onSubmit={handleSubscribe}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            style={{ padding: '10px', marginRight: '10px', width: '250px' }}
          />
          <button type="submit" style={{ padding: '10px' }}>Subscribe</button>
        </form>
        {message && <p style={{ marginTop: '10px' }}>{message}</p>}
      </div>
    </div>
  );
};

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = createRoot(rootEl);
  root.render(<App />);
}

// Centralized service worker registration
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((reg) => {
      console.log('Service worker registered from central entry:', reg.scope);
    }).catch((err) => {
      console.warn('Service worker registration failed:', err);
    });
  });
}

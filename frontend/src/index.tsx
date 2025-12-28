// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import LiveStreamUI from './components/LiveStreamUI';
import MetricsDashboard from './components/MetricsDashboard';
import SessionManager from './components/SessionManager';
import './styles/Branding.css';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'broadcast' | 'metrics' | 'session'>('broadcast');

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'var(--font-body)' }}>
            <header style={{ marginBottom: '30px', borderBottom: '1px solid #ddd', paddingBottom: '20px' }}>
                <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>VM Chat Control Center</h1>
                <nav style={{ display: 'flex', gap: '10px' }}>
                    <button
                        className={activeTab === 'broadcast' ? 'btn-primary' : 'btn-secondary'}
                        onClick={() => setActiveTab('broadcast')}
                    >
                        Start Broadcast
                    </button>
                    <button
                        className={activeTab === 'metrics' ? 'btn-primary' : 'btn-secondary'}
                        onClick={() => setActiveTab('metrics')}
                    >
                        Metrics Dashboard
                    </button>
                    <button
                        className={activeTab === 'session' ? 'btn-primary' : 'btn-secondary'}
                        onClick={() => setActiveTab('session')}
                    >
                        Session Manager
                    </button>
                </nav>
            </header>

            <main>
                {activeTab === 'broadcast' && <LiveStreamUI />}
                {activeTab === 'metrics' && <MetricsDashboard />}
                {activeTab === 'session' && <SessionManager />}
            </main>
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

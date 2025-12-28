// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import LiveStreamUI from './components/LiveStreamUI';
import MetricsDashboard from './components/MetricsDashboard';
import SessionManager from './components/SessionManager';
import Login from './components/Login';
import './styles/Branding.css';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'broadcast' | 'metrics' | 'session'>('broadcast');
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        try {
            // Use metrics endpoint as a proxy for session validation
            const res = await fetch('/stream-metrics');
            if (res.ok) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        } catch (e) {
            setIsAuthenticated(false);
        }
    };

    const handleLoginSuccess = (userData: any) => {
        setUser(userData);
        setIsAuthenticated(true);
    };

    const handleLogout = async () => {
        try {
            await fetch('/auth/logout');
            setIsAuthenticated(false);
            setUser(null);
        } catch (e) {
            console.error("Logout failed", e);
        }
    };

    if (isAuthenticated === null) {
        return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'var(--font-body)' }}>
            <header style={{ marginBottom: '30px', borderBottom: '1px solid #ddd', paddingBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', margin: 0 }}>VM Chat Control Center</h1>
                    {user && <span style={{ fontSize: '0.9em', color: '#666' }}>Logged in as: {user.username || 'User'}</span>}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
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
                    <button
                        className="btn-secondary"
                        onClick={handleLogout}
                        style={{ borderColor: '#d32f2f', color: '#d32f2f' }}
                    >
                        Logout
                    </button>
                </div>
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

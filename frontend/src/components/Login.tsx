
import React, { useState } from 'react';

interface LoginProps {
    onLoginSuccess: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');

    const handleLocalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const endpoint = isRegistering ? '/auth/register' : '/auth/login';

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(isRegistering ? { username, password, email } : { username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                onLoginSuccess(data.user);
            } else {
                const errData = await response.json();
                setError(errData.message || 'Authentication failed');
            }
        } catch (err) {
            setError('Network error occurring. Please try again.');
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = '/auth/google';
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            backgroundColor: '#f4f4f4',
            fontFamily: 'sans-serif'
        }}>
            <div style={{
                padding: '40px',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                width: '100%',
                maxWidth: '400px'
            }}>
                <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>
                    {isRegistering ? 'Create Account' : 'Welcome Back'}
                </h1>

                {error && <div style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleLocalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    {isRegistering && (
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    )}
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />

                    <button type="submit" className="btn-primary" style={{ padding: '10px', marginTop: '10px' }}>
                        {isRegistering ? 'Sign Up' : 'Log In'}
                    </button>
                </form>

                <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#ccc' }} />
                    <span style={{ padding: '0 10px', color: '#666' }}>OR</span>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#ccc' }} />
                </div>

                <button
                    onClick={handleGoogleLogin}
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#db4437',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Continue with Google
                </button>

                <p style={{ marginTop: '20px', textAlign: 'center' }}>
                    {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
                    <span
                        onClick={() => setIsRegistering(!isRegistering)}
                        style={{ color: '#0052cc', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        {isRegistering ? 'Log In' : 'Sign Up'}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;

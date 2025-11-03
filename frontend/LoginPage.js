import React from 'react';

function LoginPage() {
  return (
    <div>
      <h2>Welcome</h2>
      <p>Please log in to manage your streams.</p>
      <a href="/api/auth/google" className="login-button">Login with Google</a>
    </div>
  );
}

export default LoginPage;
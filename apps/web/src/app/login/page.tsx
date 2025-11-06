'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import './login.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { theme } = useTheme();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Logging in with:', { email, password });
    // Temporary redirect after manual login
    router.push('/profile');
  };

  const handleGoogleSignIn = () => {
    // Redirect to backend Google OAuth
    window.location.href = 'http://127.0.0.1:8000/auth/google';
  };

  const handleCreateAccount = () => {
    router.push('/signup');
  };

  return (
    <div className={`login-container ${theme}`}>
      <div className="login-box">
        <h1>Welcome Back</h1>
        <p>Sign in to continue to Lyra</p>

        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

            <button
              type="button"
              className="login-btn"
              onClick={() => {
                // Persist a simple dev login. In production this should be set by the auth flow.
                localStorage.setItem('currentUserId', String(999));
                localStorage.setItem('currentUserName', 'John');
                localStorage.setItem('currentUserAvatar', '/default-avatar.png');
                
                // Notify ALL tabs about the login
                window.dispatchEvent(new Event('lyra:user:update'));
                window.dispatchEvent(new StorageEvent('storage', {
                  key: 'currentUserId',
                  newValue: String(999)
                }));
                
                router.push('/profile');
              }}
            >
              Log In
            </button>
        </form>

        <div className="divider">or</div>

        <div className="social-login">
          <button onClick={handleGoogleSignIn} className="google-btn">
            <img src="/icons/google.svg" alt="Google" />
            Continue with Google
          </button>
        </div>

        <button onClick={() => router.push('/signup')} className="signup-link">
  Don’t have an account? <span>Create one</span>
</button>

      </div>
    </div>
  );
}

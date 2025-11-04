'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import './login.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Logging in with:', { email, password });
  };

  const handleGoogleSignIn = () => {
    // Handle Google sign-in
    console.log('Sign in with Google');
  };

  const handleAppleSignIn = () => {
    // Handle Apple sign-in
    console.log('Sign in with Apple');
  };

  const handleCreateAccount = () => {
    // Redirect or open signup page
    console.log('Go to signup page');
  };

  const { theme } = useTheme();

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
            onClick={() => router.push('/profile')}
            >
            Log In
            </button>
        </form>

        <div className="divider">or</div>

        <div className="social-login">
          <button onClick={handleGoogleSignIn} className="google-btn">
            <img src="/icons/google.svg" alt="Google" />
            Sign in with Google
          </button>

          <button onClick={handleAppleSignIn} className="apple-btn">
            <img src="/icons/apple.svg" alt="Apple" />
            Sign in with Apple
          </button>
        </div>

        <button onClick={handleCreateAccount} className="signup-link">
          Don’t have an account? <span>Create one</span>
        </button>
      </div>
    </div>
  );
}

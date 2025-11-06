'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import './signup.css';

export default function SignUpPage() {
  const router = useRouter();
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating account:', formData);
    router.push('/auth/success'); // redirect to success page after signup
  };

  const handleGoogleSignUp = () => {
    window.location.href = 'http://127.0.0.1:8000/auth/google'; // backend OAuth route
  };

  return (
    <div className={`signup-container ${theme}`}>
      <div className="signup-box">
        <h1>Create Account</h1>
        <p>Join Lyra to connect with people safely and meaningfully.</p>

        <form onSubmit={handleSubmit} className="signup-form">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="signup-btn">
            Sign Up
          </button>
        </form>

        <div className="divider">or</div>

        <button onClick={handleGoogleSignUp} className="google-btn">
          <img src="/icons/google.svg" alt="Google" />
          Sign up with Google
        </button>

        <p className="switch-link">
          Already have an account?{' '}
          <span onClick={() => router.push('/login')} className="link-text">
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import './SettingsPage.css';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`settings-page ${theme}`}>
      <main className="settings-main">
        <h1 className="settings-title">Settings</h1>

        <div className="settings-section">
          <h3>Appearance</h3>
          <div className="toggle-row">
            <span>Light Mode</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={theme === 'blue'}
                onChange={toggleTheme}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
      </main>
    </div>
  );
}

import React from 'react';
import { UserButton } from "@clerk/clerk-react";
import { Zap, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar = ({ points }) => {
    const { theme, toggleTheme } = useTheme();
    // Level calculation: 100 points per level
    const level = Math.floor(points / 100) + 1;
    const progress = points % 100;

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour >= 4 && hour < 12) return "Good Morning";
        if (hour >= 12 && hour < 17) return "Good Afternoon";
        if (hour >= 17 && hour < 19) return "Good Evening";
        return "Good Night";
    };

    return (
        <nav className="navbar glass-panel">
            <div className="nav-brand">
                <div className="brand-icon">
                    <Zap size={24} fill="currentColor" />
                </div>
                <div className="brand-text">
                    <h1>FlowState</h1>
                    <span className="greeting">{getGreeting()}</span>
                </div>
            </div>

            <div className="nav-actions">
                <div className="level-info">
                    <span className="level-label">Level {level}</span>
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="points-badge">
                    {points} XP
                </div>

                <button
                    onClick={toggleTheme}
                    className="theme-toggle"
                    title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <UserButton afterSignOutUrl="/" appearance={{
                    elements: {
                        avatarBox: "clerk-avatar"
                    }
                }} />
            </div>

            <style>{`
                .navbar {
                    position: sticky;
                    top: 0;
                    z-index: 100;
                    padding: 0.75rem 1.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .nav-brand {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                .brand-text {
                    display: flex;
                    flex-direction: column;
                    line-height: 1.2;
                }
                .brand-icon {
                    color: var(--text); /* White icon */
                    display: flex;
                }
                .nav-brand h1 {
                    font-size: 1rem;
                    font-weight: 600;
                    color: var(--text);
                }
                .greeting {
                    font-size: 0.75rem;
                    color: var(--text);
                    font-weight: 500;
                }
                .nav-actions {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }
                .level-info {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                }
                .level-label {
                    font-size: 0.75rem;
                    color: var(--text);
                    font-weight: 500;
                }
                .progress-bar {
                    width: 100px;
                    height: 4px;
                    background-color: var(--secondary);
                    border-radius: 999px;
                    margin-top: 6px;
                    overflow: hidden;
                }
                .progress-fill {
                    height: 100%;
                    background: var(--text); /* White progress bar */
                    border-radius: 999px;
                    transition: width 0.5s ease-out;
                }
                .points-badge {
                    background-color: var(--secondary);
                    padding: 0.25rem 0.75rem;
                    border-radius: 4px;
                    font-family: var(--font-main);
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: var(--text); 
                    border: 1px solid var(--border);
                }
                .clerk-avatar {
                    width: 32px;
                    height: 32px;
                    border: 1px solid var(--border);
                }
                .theme-toggle {
                    background: transparent;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0.5rem;
                    border-radius: 50%;
                    transition: all 0.2s;
                }
                .theme-toggle:hover {
                    background-color: var(--secondary);
                    color: var(--text);
                }
                @media (max-width: 768px) {
                    .level-info { display: none; }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;

import React from 'react';
import { UserButton } from "@clerk/clerk-react";
import { Zap, Sun, Moon, Flame, Target } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar = ({ points, streak, dailyXP, dailyGoal }) => {
    const { theme, toggleTheme } = useTheme();

    // PROGRESSIVE LEVELING SYSTEM
    // Formula: XP = 1000 * (Level * Level)
    // Level 1: 0-999
    // Level 2: 1000-3999 (Requires 1000 total)
    // Level 3: 4000-8999 (Requires 4000 total)

    // Reverse Formula: Level = Floor(Sqrt(XP / 1000)) + 1
    // We adjust base to 1000 for easier starting

    // Let's use Base 1000. 
    // Lvl 1: 0 XP
    // Lvl 2: 1000 XP
    // Lvl 3: 4000 XP
    // Lvl 4: 9000 XP

    const currentLevel = Math.floor(Math.sqrt(points / 1000)) + 1;

    const xpForCurrentLevel = 1000 * Math.pow(currentLevel - 1, 2);
    const xpForNextLevel = 1000 * Math.pow(currentLevel, 2);

    const xpInCurrentLevel = points - xpForCurrentLevel;
    const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;

    const progress = Math.min((xpInCurrentLevel / xpNeededForNextLevel) * 100, 100);

    // Calculate daily progress percentage
    const dailyProgress = dailyGoal ? Math.min((dailyXP / dailyGoal) * 100, 100) : 0;

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour >= 4 && hour < 12) return "Good Morning";
        if (hour >= 12 && hour < 17) return "Good Afternoon";
        if (hour >= 17 && hour < 19) return "Good Evening";
        return "Good Night";
    };

    return (
        <nav className="navbar glass-panel">
            {/* ... brand ... */}
            <div className="nav-brand">
                {/* ... existing brand code ... */}
                <div className="brand-icon">
                    <Zap size={24} fill="currentColor" />
                </div>
                <div className="brand-text">
                    <h1>FlowState</h1>
                    <span className="greeting">{getGreeting()}</span>
                </div>
            </div>

            <div className="nav-actions">
                {/* Daily Goal Ring (Mini) */}
                <div className="daily-goal" title={`Daily Goal: ${dailyXP}/${dailyGoal} XP`}>
                    <div className="ring-container">
                        <svg width="32" height="32" viewBox="0 0 32 32">
                            <circle cx="16" cy="16" r="12" fill="none" stroke="var(--border)" strokeWidth="3" />
                            <circle
                                cx="16" cy="16" r="12"
                                fill="none"
                                stroke={
                                    dailyProgress >= 100 ? "#ef4444" : // Red Hot (Completed)
                                        dailyProgress >= 66 ? "#ea580c" :  // Deep Orange
                                            dailyProgress >= 33 ? "#f97316" :  // Standard Orange
                                                "#fdba74"                          // Warm Yellow-Orange
                                }
                                strokeWidth="3"
                                strokeDasharray="75.4"
                                strokeDashoffset={75.4 - (dailyProgress / 100) * 75.4}
                                transform="rotate(-90 16 16)"
                                style={{
                                    transition: 'all 0.5s ease',
                                    filter: `drop-shadow(0 0 ${Math.max(2, dailyProgress / 8)}px ${dailyProgress >= 100 ? "#ef4444" :
                                        dailyProgress >= 33 ? "#f97316" :
                                            "rgba(253, 186, 116, 0.4)"
                                        })`
                                }}
                            />
                        </svg>
                        <div className="ring-icon">
                            <Target size={10} />
                        </div>
                    </div>
                </div>

                {/* Streak Counter */}
                <div className="streak-badge" title="Current Day Streak">
                    <Flame size={16} className={streak > 0 ? "flame-active" : "flame-inactive"} fill={streak > 0 ? "currentColor" : "none"} />
                    <span>{streak}</span>
                </div>

                {/* Level Info */}
                <div className="level-container" title={`${xpInCurrentLevel}/${xpNeededForNextLevel} XP to Level ${currentLevel + 1}`}>
                    <span className="level-label">Lvl {currentLevel}</span>
                    <div className="xp-bar">
                        <div className="xp-fill" style={{ width: `${progress}%` }}></div>
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
                /* ... existing styles ... */
                .navbar {
                    position: sticky;
                    top: 0;
                    z-index: 100;
                    padding: 0.75rem 1.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    justify-content: space-between;
                    /* background: managed by .glass-panel class from App.css */
                    backdrop-filter: blur(12px);
                    transition: padding 0.3s ease;
                    border-bottom: 1px solid var(--border);
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
                    color: var(--text);
                    display: flex;
                }
                .nav-brand h1 {
                    font-size: 1rem;
                    font-weight: 600;
                    color: var(--text);
                }
                .greeting {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    font-weight: 500;
                }
                .nav-actions {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }
                
                /* New Gamification Styles */
                .streak-badge {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-weight: 600;
                    font-size: 0.9rem;
                    color: var(--text);
                    background: var(--surface);
                    padding: 4px 8px;
                    border-radius: 12px;
                    border: 1px solid var(--border);
                }
                .flame-active {
                    color: #f97316; /* Orange */
                    filter: drop-shadow(0 0 4px rgba(249, 115, 22, 0.4));
                }
                .flame-inactive {
                    color: var(--text-muted);
                }
                
                .daily-goal {
                    position: relative;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .ring-container {
                    position: relative;
                    width: 100%;
                    height: 100%;
                }
                .ring-icon {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-muted);
                }

                /* Leveling System */
                .level-container {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    justify-content: center;
                }
                .level-label {
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: var(--primary);
                    line-height: 1;
                    margin-bottom: 4px;
                }
                .xp-bar {
                    width: 80px;
                    height: 6px;
                    background: var(--surface-hover);
                    border: 1px solid var(--border);
                    border-radius: 99px;
                    overflow: hidden;
                }
                .xp-fill {
                    height: 100%;
                    background: linear-gradient(90deg, var(--secondary), var(--primary));
                    border-radius: 99px;
                    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
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
                    white-space: nowrap;
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
                    .navbar {
                        padding: 0.75rem 1rem;
                    }
                    .level-info { display: none; }
                    .nav-actions { gap: 0.75rem; }
                    .greeting { display: none; }
                }

                @media (max-width: 480px) {
                    .nav-brand h1 { font-size: 0.9rem; }
                    .points-badge { display: none; } /* Hide points on very small screens to save space */
                    .streak-badge { font-size: 0.8rem; padding: 2px 6px; }
                    .nav-actions { gap: 0.5rem; }
                    /* Maybe hide daily ring on super small if needed, but it's small enough */
                }
            `}</style>
        </nav>
    );
};

export default Navbar;

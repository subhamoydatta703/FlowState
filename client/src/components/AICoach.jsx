import React, { useState } from 'react';
import { Sparkles, Loader2, ChevronRight } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

import toast from 'react-hot-toast';

const getRatingColor = (rating) => {
    if (rating >= 8) return '#10b981'; // Green
    if (rating >= 5) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
};

const AICoach = () => {
    const { user } = useUser();
    const [insight, setInsight] = useState(null);
    const [loading, setLoading] = useState(false);

    const generateInsight = async () => {
        setLoading(true);
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/logs/insights/generate`, {
                clerkId: user.id
            });
            setInsight(res.data.insight);
            toast.success("Coach is ready!");
        } catch (err) {
            console.error("Coach Error:", err);
            // If it's a 404/500 on first load, maybe just fail silently or show friendly text
            if (err.response && err.response.status === 404) {
                setInsight(null); // No insight yet
            } else {
                setInsight("Couldn't reach the coach right now. Try again later.");
                toast.error("Coach unavailable");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card coach-card">
            <h3 className="card-title">
                <Sparkles size={20} className="icon-ai" />
                AI Coach
            </h3>

            {!insight ? (
                <div className="coach-intro">
                    <p>Ready for your weekly review? Get personalized feedback on your flow.</p>
                    <button
                        onClick={generateInsight}
                        disabled={loading}
                        className="btn btn-ai"
                    >
                        {loading ? <Loader2 className="spinner" size={18} /> : "Analyze My Week"}
                    </button>
                </div>
            ) : (
                <div className="coach-content">
                    <div className="rating-container">
                        <div className="rating-circle" style={{ borderColor: getRatingColor(insight.rating) }}>
                            <span className="rating-number" style={{ color: getRatingColor(insight.rating) }}>{insight.rating}</span>
                            <span className="rating-label">/ 10</span>
                        </div>
                        <div className="rating-text">Weekly Score</div>
                    </div>

                    <p className="insight-text">"{insight.feedback}"</p>

                    <button onClick={() => setInsight(null)} className="btn-text">
                        Close
                    </button>
                </div>
            )}

            <style>{`
                .coach-card {
                    /* Standard card background for consistency */
                    /* background: linear-gradient(135deg, var(--surface), rgba(16, 185, 129, 0.05)); */
                    border: 1px solid var(--border);
                    border-radius: var(--radius);
                    padding: 1.5rem;
                    position: relative;
                    overflow: hidden;
                }
                .card-title {
                    font-size: 1rem;
                    font-weight: 600;
                    margin-bottom: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--text);
                }
                .icon-ai {
                    color: #ec4899; /* Pink-ish for AI */
                }
                .coach-intro p {
                    font-size: 0.9rem;
                    color: var(--text-muted);
                    margin-bottom: 1rem;
                }
                .btn-ai {
                    background-color: var(--text);
                    color: var(--background);
                    padding: 1rem 2rem; /* Increased Height */
                    border-radius: 8px;
                    border: none;
                    cursor: pointer;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    width: 100%;
                    justify-content: center;
                    transition: opacity 0.2s;
                    font-size: 1rem;
                }
                .btn-ai:hover {
                    opacity: 0.9;
                }
                .btn-ai:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                    transform: none;
                }
                .coach-content {
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                    align-items: center;
                    text-align: center;
                    animation: fadeIn 0.5s ease-out;
                }
                .rating-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin: 0.5rem 0;
                }
                .rating-circle {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    border: 5px solid;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 0.5rem;
                    background: rgba(0,0,0,0.2);
                    box-shadow: 0 0 20px rgba(0,0,0,0.1);
                }
                .rating-number {
                    font-size: 2rem;
                    font-weight: 800;
                    line-height: 1;
                }
                .rating-label {
                    font-size: 0.7rem;
                    color: var(--text-muted);
                    font-weight: 600;
                }
                .rating-text {
                    font-size: 0.9rem;
                    color: var(--text-muted);
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .insight-text {
                    font-size: 1rem;
                    line-height: 1.6;
                    font-style: italic;
                    color: var(--text);
                    background: rgba(255,255,255,0.03);
                    padding: 1rem;
                    border-radius: 12px;
                    border-left: 4px solid #ec4899;
                    text-align: left;
                    width: 100%;
                }
                .btn-text {
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    font-size: 0.85rem;
                    cursor: pointer;
                    margin-top: 0.5rem;
                    transition: color 0.2s;
                }
                .btn-text:hover {
                    color: var(--text);
                    text-decoration: underline;
                }
                .spinner {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default AICoach;

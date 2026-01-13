import React from 'react';
import { Clock, CheckCircle, Award, Tag } from 'lucide-react';
import { format } from 'date-fns';

const TaskHistory = ({ logs }) => {
    // Show most recent first
    const completedLogs = logs
        .filter(l => l.status === 'completed')
        .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

    if (completedLogs.length === 0) {
        return (
            <div className="history-empty">
                <p>No completed tasks yet. Go get some work done!</p>
            </div>
        );
    }

    return (
        <div className="card history-card">
            <h3 className="card-title">
                <Clock size={20} className="icon-secondary" />
                Task History
            </h3>
            <div className="history-list custom-scrollbar">
                {completedLogs.map(log => (
                    <div key={log._id} className="history-item">
                        <div className="history-header">
                            <span className="history-date">
                                {format(new Date(log.completedAt), 'MMM dd, h:mm a')}
                            </span>
                            <span className="history-points">
                                <Award size={14} />
                                {log.points} pts
                            </span>
                        </div>
                        <p className="history-desc">{log.taskDescription}</p>

                        <div className="history-meta">
                            {log.duration > 0 && (
                                <span className="meta-tag">
                                    <Clock size={12} />
                                    {log.duration}m
                                </span>
                            )}
                            {log.tags && log.tags.length > 0 && log.tags.map((tag, i) => (
                                <span key={i} className="meta-tag">
                                    <Tag size={12} />
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {log.aiFeedback && (
                            <p className="history-feedback">"{log.aiFeedback}"</p>
                        )}
                    </div>
                ))}
            </div>

            <style>{`
                .history-card {
                    background: transparent;
                    border: 1px solid var(--border);
                    border-radius: var(--radius);
                    padding: 1.5rem;
                }
                .history-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    max-height: 400px;
                    overflow-y: auto;
                    padding-right: 4px;
                }
                .history-item {
                    border-bottom: 1px solid var(--border);
                    padding-bottom: 1rem;
                }
                .history-item:last-child {
                    border-bottom: none;
                    padding-bottom: 0;
                }
                .history-header {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.8rem;
                    color: var(--text-muted);
                    margin-bottom: 0.25rem;
                }
                .history-points {
                    color: var(--primary); /* Green-ish usually */
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-weight: 600;
                }
                .history-desc {
                    font-weight: 500;
                    color: var(--text);
                    margin-bottom: 0.5rem;
                    font-size: 0.95rem;
                }
                .history-meta {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    margin-bottom: 0.5rem;
                }
                .meta-tag {
                    font-size: 0.75rem;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    background: var(--secondary);
                    color: var(--text-muted);
                    padding: 2px 8px;
                    border-radius: 12px;
                }
                .history-feedback {
                    font-size: 0.85rem;
                    font-style: italic;
                    color: var(--text-muted);
                    border-left: 2px solid var(--border);
                    padding-left: 0.5rem;
                }
                .history-empty {
                    text-align: center;
                    padding: 2rem;
                    color: var(--text-muted);
                    border: 1px dashed var(--border);
                    border-radius: var(--radius);
                }
            `}</style>
        </div>
    );
};

export default TaskHistory;

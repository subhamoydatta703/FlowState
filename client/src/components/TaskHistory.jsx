import React, { useState } from 'react';
import { Clock, CheckCircle, Award, Tag, Trash2, X, CheckSquare, Square, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import axios from 'axios';

const TaskHistory = ({ logs, onRefresh }) => {
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [isDeleting, setIsDeleting] = useState(false);

    // Show most recent first
    const completedLogs = logs
        .filter(l => l.status === 'completed')
        .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

    const toggleSelection = (id) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const toggleAll = () => {
        if (selectedIds.size === completedLogs.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(completedLogs.map(l => l._id)));
        }
    };

    const handleDelete = async () => {
        if (selectedIds.size === 0) return;
        if (!confirm(`Are you sure you want to delete ${selectedIds.size} tasks? This will remove the associated points.`)) return;

        setIsDeleting(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/logs/batch-delete`, {
                logIds: Array.from(selectedIds)
            });
            onRefresh && onRefresh();
            setIsSelectionMode(false);
            setSelectedIds(new Set());
        } catch (err) {
            console.error("Failed to delete logs", err);
            alert("Failed to delete tasks");
        } finally {
            setIsDeleting(false);
        }
    };

    if (completedLogs.length === 0) {
        return (
            <div className="card history-card">
                <h3 className="card-title">
                    <Clock size={20} className="icon-secondary" />
                    Task History
                </h3>
                <div className="history-empty">
                    <p>No completed tasks yet. Go get some work done!</p>
                </div>
                <style>{`
                .history-card {
                    background: transparent;
                    border: 1px solid var(--border);
                    border-radius: var(--radius);
                    padding: 1.5rem;
                }
                 .card-title {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--text);
                    margin-bottom: 1rem;
                    font-size: 1.1rem;
                    font-weight: 600;
                }
                 .icon-secondary {
                    color: var(--primary);
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
    }

    return (
        <div className="card history-card">
            <div className="card-header">
                <h3 className="card-title">
                    <Clock size={20} className="icon-secondary" />
                    Task History
                </h3>

                <div className="header-actions">
                    {!isSelectionMode ? (
                        <button
                            className="btn-icon"
                            onClick={() => setIsSelectionMode(true)}
                            title="Select tasks"
                        >
                            <CheckSquare size={18} />
                        </button>
                    ) : (
                        <>
                            <span className="selection-count">{selectedIds.size} selected</span>
                            <button
                                className="btn-icon btn-danger"
                                onClick={handleDelete}
                                disabled={selectedIds.size === 0 || isDeleting}
                                title="Delete selected"
                            >
                                <Trash2 size={18} />
                            </button>
                            <button
                                className="btn-icon"
                                onClick={toggleAll}
                                title="Select All"
                            >
                                {selectedIds.size === completedLogs.length ? <CheckSquare size={18} /> : <Square size={18} />}
                            </button>
                            <button
                                className="btn-icon"
                                onClick={() => {
                                    setIsSelectionMode(false);
                                    setSelectedIds(new Set());
                                }}
                                title="Cancel"
                            >
                                <X size={18} />
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="history-list custom-scrollbar">
                {completedLogs.map(log => (
                    <div
                        key={log._id}
                        className={`history-item ${isSelectionMode ? 'selectable' : ''} ${selectedIds.has(log._id) ? 'selected' : ''}`}
                        onClick={() => isSelectionMode && toggleSelection(log._id)}
                    >
                        {isSelectionMode && (
                            <div className="selection-checkbox">
                                {selectedIds.has(log._id) ? (
                                    <CheckSquare size={20} className="checkbox-checked" />
                                ) : (
                                    <Square size={20} className="checkbox-unchecked" />
                                )}
                            </div>
                        )}

                        <div className="history-content">
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

                            {log.aiFeedback && !log.aiFeedback.includes("AI Offline") && (
                                <p className="history-feedback">"{log.aiFeedback}"</p>
                            )}
                        </div>
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
                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }
                .card-title {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--text);
                    margin: 0;
                    font-size: 1.1rem;
                    font-weight: 600;
                }
                .icon-secondary {
                    color: var(--primary);
                }
                .header-actions {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .btn-icon {
                    background: transparent;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 4px;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .btn-icon:hover {
                    background: var(--hover);
                    color: var(--text);
                }
                .btn-danger:hover {
                    color: #ef4444;
                    background: #fee2e2;
                }
                /* Dark mode danger hover fix if needed, but keeping simple for now */
                
                .selection-count {
                    font-size: 0.8rem;
                    color: var(--text-muted);
                    margin-right: 0.5rem;
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
                    display: flex;
                    gap: 1rem;
                    transition: background 0.2s;
                }
                .history-item.selectable {
                    cursor: pointer;
                    padding-left: 0.5rem;
                    padding-right: 0.5rem;
                    border-bottom: 1px solid var(--border);
                    border-radius: 8px;
                }
                .history-item.selectable:hover {
                    background: rgba(255, 255, 255, 0.03);
                }
                .history-item.selected {
                    background: rgba(var(--primary-rgb), 0.1); /* Assuming primary-rgb exists or use hardcoded low opacity */
                    border-color: var(--primary);
                }
                .selection-checkbox {
                    display: flex;
                    align-items: flex-start;
                    padding-top: 2px;
                }
                .checkbox-checked {
                    color: var(--primary);
                }
                .checkbox-unchecked {
                    color: var(--text-muted);
                }

                .history-content {
                    flex: 1;
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
                    color: var(--primary);
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
                    word-wrap: break-word; /* Ensure long words break */
                    overflow-wrap: break-word; 
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


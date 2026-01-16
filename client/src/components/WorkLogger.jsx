import React, { useState } from 'react';
import { Send, Loader2, Trash2, CheckCircle } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const WorkLogger = ({ onSuccess }) => {
    const { user } = useUser();
    const [log, setLog] = useState("");
    const [duration, setDuration] = useState("");
    const [tags, setTags] = useState("");
    const [loading, setLoading] = useState(false);
    const [pendingTasks, setPendingTasks] = useState([]);

    React.useEffect(() => {
        if (!user) return;
        fetchPending();
    }, [user]);

    const fetchPending = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/logs/${user.id}?status=pending`);
            setPendingTasks(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!log.trim()) return;
        setLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/logs`, {
                clerkId: user.id,
                taskDescription: log,
                duration: parseInt(duration) || 0,
                tags: tags.split(',').map(tag => tag.trim()).filter(t => t)
            });
            setLog("");
            setDuration("");
            setTags("");
            fetchPending();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = async (taskId) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/logs/${taskId}/complete`);
            fetchPending();
            onSuccess();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (taskId) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/logs/${taskId}`);
            fetchPending();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="logger-container">
            <form onSubmit={handleSubmit} className="logger-form">
                <textarea
                    value={log}
                    onChange={(e) => setLog(e.target.value)}
                    placeholder="What did you work on? (e.g. 'Optimized the database query by 50%')"
                    className="logger-input"
                />

                <div className="form-footer">
                    <div className="input-group">
                        <input
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            placeholder="Time (in minutes)"
                            className="logger-input-mini"
                        />
                        <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="Tags (e.g. React, API)"
                            className="logger-input-tags"
                        />
                    </div>
                    <button
                        disabled={loading}
                        type="submit"
                        className="logger-submit btn"
                    >
                        {loading ? <Loader2 className="spinner" size={20} /> : <Send size={20} />}
                    </button>
                </div>
            </form>

            <div className="pending-list">
                <h3 className="list-title">Pending Tasks</h3>
                <div className="tasks-container">
                    <AnimatePresence>
                        {pendingTasks.map((task) => (
                            <motion.div
                                key={task._id}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="task-item"
                            >
                                <div className="task-content">
                                    <p className="task-desc">{task.taskDescription}</p>
                                    <span className="task-points">Potential: {task.points} pts</span>
                                </div>
                                <div className="task-actions">
                                    <button
                                        onClick={() => handleComplete(task._id)}
                                        className="action-btn success"
                                        title="Complete"
                                    >
                                        <CheckCircle size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(task._id)}
                                        className="action-btn danger"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {pendingTasks.length === 0 && (
                        <p className="empty-msg">No pending tasks. Get to work!</p>
                    )}
                </div>
            </div>

            <style>{`
                .logger-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    margin-bottom: 2.5rem;
                }
                .logger-input {
                    min-height: 100px;
                    width: 100%;
                    resize: none;
                    background-color: transparent;
                    border: 1px solid var(--border);
                    border-radius: var(--radius);
                    padding: 1rem;
                    color: var(--text);
                    font-size: 1rem;
                    transition: border-color 0.2s, background 0.2s;
                }
                .logger-input:focus {
                    outline: none;
                    border-color: var(--text);
                    background-color: var(--surface-hover);
                }
                .form-footer {
                    display: flex;
                    gap: 0.75rem;
                    align-items: center;
                }
                .input-group {
                    flex: 1;
                    display: flex;
                    gap: 0.75rem;
                }
                .logger-input-mini {
                    width: 150px;
                    background-color: transparent;
                    border: 1px solid var(--border);
                    border-radius: var(--radius);
                    padding: 0.75rem;
                    color: var(--text);
                    transition: border-color 0.2s;
                }
                .logger-input-tags {
                    flex: 1;
                    background-color: transparent;
                    border: 1px solid var(--border);
                    border-radius: var(--radius);
                    padding: 0.75rem;
                    color: var(--text);
                    transition: border-color 0.2s;
                }
                .logger-input-mini:focus, .logger-input-tags:focus {
                     outline: none;
                     border-color: var(--text);
                }
                .logger-submit {
                    background-color: var(--primary);
                    color: var(--primary-foreground);
                    width: 48px;
                    height: 48px;
                    border-radius: var(--radius);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: opacity 0.2s;
                    border: none;
                    cursor: pointer;
                    flex-shrink: 0;
                }
                .logger-submit:hover {
                    opacity: 0.9;
                }
                .logger-submit:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .list-title {
                     font-size: 0.75rem;
                     text-transform: uppercase;
                     letter-spacing: 0.05em;
                     color: var(--text-muted);
                     margin-bottom: 1rem;
                     font-weight: 600;
                }
                .task-item {
                    background-color: transparent;
                    border: 1px solid var(--border);
                    border-radius: var(--radius);
                    padding: 1rem;
                    margin-bottom: 0.5rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    transition: background-color 0.2s;
                }
                .task-item:hover {
                    background-color: var(--surface-hover);
                }
                .task-desc {
                    font-weight: 500;
                    margin-bottom: 0.25rem;
                    font-size: 0.95rem;
                    color: var(--text);
                }
                .task-points {
                    font-size: 0.7rem;
                    color: var(--text-muted);
                    font-weight: 500;
                    border: 1px solid var(--border);
                    padding: 2px 6px;
                    border-radius: 4px;
                }
                .task-actions {
                    display: flex;
                    gap: 0.5rem;
                }
                .action-btn {
                    padding: 0.4rem;
                    border-radius: 6px;
                    background: transparent;
                    color: var(--text-muted);
                    transition: all 0.2s;
                    border: 1px solid transparent;
                    cursor: pointer;
                }
                .action-btn:hover {
                    border-color: var(--border);
                    background-color: var(--secondary);
                    color: var(--text);
                }
                .empty-msg {
                    text-align: center;
                    color: var(--text-muted);
                    font-size: 0.875rem;
                    padding: 2rem;
                    border: 1px dashed var(--border);
                    border-radius: var(--radius);
                }
                .spinner {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                @media (max-width: 640px) {
                    .form-footer {
                        flex-direction: column;
                        align-items: stretch;
                        gap: 1rem;
                    }
                    .input-group {
                        flex-direction: column;
                        gap: 1rem;
                    }
                    .logger-input-mini, .logger-input-tags {
                        width: 100%;
                    }
                    .logger-submit {
                        width: 100%;
                        height: 48px;
                    }
                    .task-item {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 1rem;
                    }
                    .task-actions {
                        width: 100%;
                        justify-content: flex-end;
                    }
                }
            `}</style>
        </div>
    );
};

export default WorkLogger;

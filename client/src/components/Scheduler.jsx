import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import { Bell, Trash, Plus } from 'lucide-react';
import { format } from 'date-fns';

const Scheduler = () => {
    const { user } = useUser();
    const [reminders, setReminders] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [newTime, setNewTime] = useState("");

    useEffect(() => {
        if (!user) return;
        fetchReminders();
    }, [user]);

    const fetchReminders = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/reminders/${user.id}`);
            setReminders(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/reminders`, {
                clerkId: user.id,
                message: newMessage,
                scheduledTime: newTime
            });
            setNewMessage("");
            setNewTime("");
            fetchReminders();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/reminders/${id}`);
            fetchReminders();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="card scheduler-card">
            <h3 className="card-title">
                <Bell size={20} className="icon-secondary" />
                Reminders
            </h3>

            <form onSubmit={handleAdd} className="scheduler-form">
                <input
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Brief reminder title..."
                    className="scheduler-input"
                    required
                />
                <div className="form-row">
                    <div className="date-wrapper">
                        <input
                            type="datetime-local"
                            value={newTime}
                            onChange={e => setNewTime(e.target.value)}
                            className="scheduler-date"
                            required
                        />
                    </div>
                    <button type="submit" className="btn add-btn">
                        <Plus size={24} />
                    </button>
                </div>
            </form>

            <div className="reminders-list custom-scrollbar">
                {reminders.map(rem => (
                    <div key={rem._id} className="reminder-item">
                        <div className="reminder-info">
                            <p className="reminder-msg">{rem.message}</p>
                            <p className="reminder-time">{format(new Date(rem.scheduledTime), 'MMM dd, h:mm a')}</p>
                            {rem.status === 'sent' && <span className="status-sent">Sent</span>}
                        </div>
                        <button onClick={() => handleDelete(rem._id)} className="delete-btn">
                            <Trash size={16} />
                        </button>
                    </div>
                ))}
                {reminders.length === 0 && <p className="empty-text">No upcoming reminders</p>}
            </div>

            <style>{`
                .scheduler-card {
                    background: transparent;
                    border: 1px solid var(--border);
                    border-radius: var(--radius);
                    padding: 1.5rem;
                }
                .card-title {
                    font-size: 1rem;
                    font-weight: 600;
                    margin-bottom: 1.25rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--text);
                }
                .icon-secondary {
                    color: var(--text); /* Simple white icon */
                }
                .scheduler-form {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    margin-bottom: 2rem;
                }
                .scheduler-input, .scheduler-date {
                    background-color: transparent;
                    border: 1px solid var(--border);
                    border-radius: var(--radius);
                    padding: 0.6rem 0.8rem;
                    color: var(--text);
                    font-family: inherit;
                    width: 100%;
                    font-size: 0.875rem;
                    transition: border-color 0.2s;
                }
                .scheduler-input:focus, .scheduler-date:focus {
                    outline: none;
                    border-color: var(--text);
                }
                /* Custom Calendar Icon Color - Dark theme (default) */
                ::-webkit-calendar-picker-indicator {
                    filter: invert(1);
                    opacity: 0.7;
                    cursor: pointer;
                }
                /* Light theme */
                :root[data-theme="light"] ::-webkit-calendar-picker-indicator {
                    filter: invert(0);
                    opacity: 0.7;
                }
                .form-row {
                    display: flex;
                    gap: 0.5rem;
                }
                .date-wrapper {
                    flex: 1;
                }
                .add-btn {
                    background-color: var(--primary);
                    color: var(--primary-foreground);
                    padding: 0 1rem;
                    border-radius: var(--radius);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                    border: 1px solid transparent;
                }
                .add-btn:hover {
                    background-color: var(--primary-hover);
                }
                .reminders-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    max-height: 350px;
                    overflow-y: auto;
                    padding-right: 4px;
                }
                .reminder-item {
                    background-color: transparent;
                    padding: 0.75rem 0;
                    border-bottom: 1px solid var(--border);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                /* Remove left accent line */
                
                .reminder-msg {
                    font-weight: 500;
                    color: var(--text);
                    margin-bottom: 0.25rem;
                    font-size: 0.9rem;
                }
                .reminder-time {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .status-sent {
                    font-size: 0.65rem;
                    color: var(--text-muted);
                    border: 1px solid var(--border);
                    padding: 1px 4px;
                    border-radius: 4px;
                    font-weight: 500;
                }
                .delete-btn {
                    color: var(--text-muted);
                    background: transparent;
                    padding: 0.4rem;
                    border-radius: 6px;
                    transition: all 0.2s;
                }
                .delete-btn:hover {
                    background-color: var(--secondary);
                    color: var(--text);
                }
                .empty-text {
                    text-align: center;
                    padding: 2rem;
                    font-size: 0.8rem;
                    color: var(--text-muted);
                    font-style: italic;
                }
            `}</style>
        </div>
    );
};

export default Scheduler;

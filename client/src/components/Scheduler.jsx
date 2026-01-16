import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import { Bell, Trash, Plus, Edit2, X } from 'lucide-react';
import { format } from 'date-fns';

import toast from 'react-hot-toast';

const Scheduler = () => {
    const { user } = useUser();
    const [reminders, setReminders] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [newTime, setNewTime] = useState("");
    const [editingId, setEditingId] = useState(null);

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
            toast.error("Failed to load reminders");
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`${import.meta.env.VITE_API_URL}/reminders/${editingId}`, {
                    message: newMessage,
                    scheduledTime: new Date(newTime).toISOString()
                });
                setEditingId(null);
                toast.success("Reminder updated");
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/reminders`, {
                    clerkId: user.id,
                    message: newMessage,
                    scheduledTime: new Date(newTime).toISOString()
                });
                toast.success("Reminder set!");
            }
            setNewMessage("");
            setNewTime("");
            fetchReminders();
        } catch (err) {
            console.error(err);
            toast.error("Failed to save reminder");
        }
    };

    const startEdit = (reminder) => {
        setEditingId(reminder._id);
        setNewMessage(reminder.message);
        // Convert UTC to local datetime string for input
        const date = new Date(reminder.scheduledTime);
        const localIso = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
        setNewTime(localIso);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setNewMessage("");
        setNewTime("");
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/reminders/${id}`);
            fetchReminders();
            toast.success("Reminder deleted");
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete reminder");
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
                    <div className="button-group">
                        {editingId && (
                            <button type="button" onClick={cancelEdit} className="btn cancel-btn">
                                <X size={24} />
                            </button>
                        )}
                        <button type="submit" className="btn add-btn">
                            {editingId ? <Edit2 size={24} /> : <Plus size={24} />}
                        </button>
                    </div>
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
                        <div className="actions">
                            <button onClick={() => startEdit(rem)} className="action-btn edit-btn">
                                <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDelete(rem._id)} className="action-btn delete-btn">
                                <Trash size={16} />
                            </button>
                        </div>
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
                    color: var(--text);
                }
                .scheduler-form {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    margin-bottom: 2rem;
                }
                .scheduler-input, .scheduler-date {
                    background-color: var(--input-bg);
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
                ::-webkit-calendar-picker-indicator {
                    filter: invert(1);
                    opacity: 0.7;
                    cursor: pointer;
                }
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
                .button-group {
                    display: flex;
                    gap: 0.5rem;
                }
                .btn {
                    padding: 0 1rem;
                    border-radius: var(--radius);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                    border: 1px solid transparent;
                    cursor: pointer;
                }
                .add-btn {
                    background-color: var(--primary);
                    color: var(--primary-foreground);
                }
                .cancel-btn {
                    background-color: transparent;
                    border: 1px solid var(--border);
                    color: var(--text-muted);
                }
                .cancel-btn:hover {
                    background-color: var(--secondary);
                    color: var(--text);
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
                .actions {
                    display: flex;
                    gap: 0.25rem;
                }
                .action-btn {
                    color: var(--text-muted);
                    background: transparent;
                    padding: 0.4rem;
                    border-radius: 6px;
                    transition: all 0.2s;
                    border: none;
                    cursor: pointer;
                }
                .edit-btn:hover {
                    background-color: var(--primary);
                    color: var(--primary-foreground);
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

                @media (max-width: 640px) {
                    .form-row {
                        flex-direction: column;
                        gap: 1rem;
                    }
                    .button-group {
                        width: 100%;
                    }
                    .btn {
                        flex: 1;
                        padding: 0.75rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default Scheduler;

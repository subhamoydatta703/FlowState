import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import WorkLogger from '../components/WorkLogger';
import ProductivityChart from '../components/ProductivityChart';
import Scheduler from '../components/Scheduler';
import TaskHistory from '../components/TaskHistory';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

const Dashboard = () => {
    const { user } = useUser();
    const [stats, setStats] = useState({ points: 0, logs: [] });
    const [refresh, setRefresh] = useState(0);

    const triggerRefresh = () => setRefresh(r => r + 1);

    useEffect(() => {
        if (!user) return;
        const fetchData = async () => {
            try {
                const logsRes = await axios.get(`${import.meta.env.VITE_API_URL}/logs/${user.id}`);
                const userRes = await axios.post(`${import.meta.env.VITE_API_URL}/auth/sync`, {
                    clerkId: user.id,
                    email: user.primaryEmailAddress.emailAddress,
                    username: user.fullName
                });

                setStats({
                    points: userRes.data.totalPoints,
                    logs: logsRes.data
                });
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [user, refresh]);

    return (
        <div className="dashboard-container">
            <Navbar points={stats.points} />

            <main className="dashboard-grid">

                {/* Left Col: Logger & Tasks */}
                <div className="main-content">
                    <section>
                        <h2 className="section-title">Log Your Work</h2>
                        <WorkLogger onSuccess={triggerRefresh} />
                    </section>

                    <section>
                        <h2 className="section-title">Productivity Trend</h2>
                        <div className="chart-container card">
                            <ProductivityChart logs={stats.logs} />
                        </div>
                    </section>
                </div>

                {/* Right Col: Scheduler & Stats & History */}
                <div className="sidebar">
                    <section>
                        <h2 className="section-title">Upcoming Reminders</h2>
                        <Scheduler />
                    </section>

                    <section>
                        <TaskHistory logs={stats.logs} />
                    </section>
                </div>
            </main>

            <style>{`
                .dashboard-container {
                    min-height: 100vh;
                    background-color: var(--background);
                }
                .dashboard-grid {
                    max-width: 1000px; /* Tighter width for focus */
                    margin: 0 auto;
                    padding: 2rem 1.5rem;
                    display: grid;
                    grid-template-columns: 2fr 1.2fr;
                    gap: 2.5rem;
                }
                .main-content {
                    display: flex;
                    flex-direction: column;
                    gap: 2.5rem;
                }
                .sidebar {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }
                .section-title {
                    font-size: 1rem;
                    font-weight: 600;
                    margin-bottom: 1rem;
                    color: var(--text);
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .chart-container {
                    height: 300px;
                    background-color: transparent;
                    border: 1px solid var(--border);
                    border-radius: var(--radius);
                    padding: 1.5rem 1rem 0 0 ;
                }
                @media (max-width: 992px) {
                    .dashboard-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default Dashboard;

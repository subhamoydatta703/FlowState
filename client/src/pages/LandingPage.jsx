import React from 'react';
import { SignInButton } from "@clerk/clerk-react";
import { motion } from 'framer-motion';
import { Target, Zap, BarChart2, ArrowRight, Brain } from 'lucide-react';

const Logo = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    className="feature-card"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
  >
    <div className="feature-icon-wrapper">
      <Icon className="feature-icon" />
    </div>
    <h3>{title}</h3>
    <p>{description}</p>
  </motion.div>
);

const LandingPage = () => {
  return (
    <div className="landing-page">
      <div className="grid-background" />

      {/* Header */}
      <motion.header
        className="landing-header"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="brand">
          <Logo className="brand-logo" />
          <span className="brand-name">FlowState</span>
        </div>
        <div className="header-actions">
          <SignInButton mode="modal">
            <button className="btn btn-login">
              Log In
            </button>
          </SignInButton>
        </div>
      </motion.header>

      <main className="landing-content">
        <section className="hero-section">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="hero-logo-container"
          >
            <Logo className="hero-logo-large" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hero-title"
          >
            Level Up Your <span className="highlight">Productivity</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="hero-subtitle"
          >
            Precision tracking for high-performance work.
            Quantify your focus, gamify your output, and optimize your schedule.
          </motion.p>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="hero-cta"
          >
            <SignInButton mode="modal">
              <button className="btn btn-primary btn-lg">
                Start Tracking <ArrowRight size={20} />
              </button>
            </SignInButton>
          </motion.div>
        </section>

        <section className="features-grid">
          <FeatureCard
            delay={0.6}
            icon={Target}
            title="Deep Focus"
            description="Eliminate distractions with our focused session timers."
          />
          <FeatureCard
            delay={0.7}
            icon={Zap}
            title="Gamified Systems"
            description="Earn XP and level up as you maintain consistency."
          />
          <FeatureCard
            delay={0.8}
            icon={BarChart2}
            title="Data Insights"
            description="Analyze detailed statistics to find your peak hours."
          />
          <FeatureCard
            delay={0.9}
            icon={Brain}
            title="AI Coach"
            description="Get intelligent suggestions to optimize your workflow."
          />
        </section>
      </main>

      <style>{`
                .landing-page {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    overflow-x: hidden;
                    color: var(--text);
                    background-color: var(--background);
                }

                .grid-background {
                    position: absolute;
                    inset: 0;
                    background-image: 
                        linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
                    background-size: 40px 40px;
                    mask-image: radial-gradient(circle at center, black 40%, transparent 100%);
                    z-index: 0;
                    pointer-events: none;
                }
                
                .landing-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem 3rem;
                    z-index: 10;
                    /* backdrop-filter: blur(5px); */
                }

                .brand {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .brand-logo {
                    width: 28px;
                    height: 28px;
                    color: var(--text);
                }

                .brand-name {
                    font-size: 1.25rem;
                    font-weight: 600;
                    letter-spacing: -0.02em;
                    color: var(--text);
                }

                .landing-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 4rem 1rem;
                    max-width: 1200px;
                    margin: 0 auto;
                    width: 100%;
                    z-index: 1;
                }

                .hero-section {
                    text-align: center;
                    max-width: 900px;
                    margin-bottom: 6rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .hero-logo-container {
                    margin-bottom: 2.5rem;
                }

                .hero-logo-large {
                    width: 80px;
                    height: 80px;
                    color: var(--text);
                    fill: transparent; 
                    stroke: var(--text);
                    stroke-width: 1.5px;
                    filter: drop-shadow(0 0 20px rgba(255,255,255,0.1));
                }

                .hero-title {
                    font-size: 4.5rem;
                    font-weight: 800;
                    margin-bottom: 1.5rem;
                    line-height: 1.1;
                    letter-spacing: -0.04em;
                    color: var(--text);
                }
                
                .highlight {
                    background: linear-gradient(to right, #fff, #999);
                    -webkit-background-clip: text;
                    color: transparent;
                }

                .hero-subtitle {
                    font-size: 1.25rem;
                    color: var(--text-muted);
                    max-width: 650px;
                    margin-bottom: 3rem;
                    line-height: 1.6;
                    font-weight: 400;
                }

                .btn-lg {
                    padding: 1rem 2.5rem;
                    font-size: 1rem;
                    border-radius: 6px; 
                    font-weight: 600;
                    background: var(--text);
                    color: var(--background);
                    border: 1px solid var(--text);
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: all 0.2s ease;
                }
                
                .btn-lg:hover {
                    background: transparent;
                    color: var(--text);
                    box-shadow: 0 0 15px rgba(255,255,255,0.1);
                }
                
                .btn-login {
                    background: transparent;
                    color: var(--text-muted);
                    font-size: 0.95rem;
                    font-weight: 500;
                    padding: 0.5rem 1rem;
                    border: 1px solid transparent;
                    border-radius: 6px;
                }
                
                .btn-login:hover {
                    color: var(--text);
                    border-color: var(--surface-hover);
                }

                .features-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1.5rem;
                    width: 100%;
                    max-width: 1400px;
                }

                .feature-card {
                    padding: 2rem;
                    border-radius: var(--radius);
                    border: 1px solid var(--border);
                    background: rgba(255,255,255,0.01);
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 1.25rem;
                    text-align: left;
                    transition: all 0.3s ease;
                }
                
                .feature-card:hover {
                    border-color: var(--text-muted);
                    background: rgba(255,255,255,0.03);
                    transform: translateY(-2px);
                }

                .feature-icon-wrapper {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 0.5rem;
                    color: var(--text);
                }

                .feature-icon {
                    width: 32px;
                    height: 32px;
                    stroke-width: 1.5px;
                }

                .feature-card h3 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: var(--text);
                    letter-spacing: -0.01em;
                }
                
                .feature-card p {
                    color: var(--text-muted);
                    font-size: 0.95rem;
                    line-height: 1.5;
                }

                @media (max-width: 1024px) {
                     .features-grid { grid-template-columns: repeat(2, 1fr); }
                }

                @media (max-width: 640px) {
                     .features-grid { grid-template-columns: 1fr; }
                     .hero-title { font-size: 3rem; }
                     .landing-header { padding: 1.5rem; }
                }
            `}</style>
    </div>
  );
};

export default LandingPage;

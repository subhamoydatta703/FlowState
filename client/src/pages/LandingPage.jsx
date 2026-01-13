import React from 'react';
import { SignInButton } from "@clerk/clerk-react";
import { motion } from 'framer-motion';

const LandingPage = () => {
    return (
        <div className="landing-page">
            <div className="blob blob-1" />
            <div className="blob blob-2" />

            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="hero-title"
            >
                Track Your Flow
            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="hero-subtitle"
            >
                AI-powered productivity tracking that turns your daily work into a game.
                Get points, visualizing your impact, and stay on schedule.
            </motion.p>

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <SignInButton mode="modal">
                    <button className="btn btn-primary btn-lg">
                        Get Started
                    </button>
                </SignInButton>
            </motion.div>

            <style>{`
        .landing-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          text-align: center;
          padding: 1rem;
        }
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.4;
          z-index: -1;
        }
        .blob-1 {
          top: 10%;
          left: 10%;
          width: 300px;
          height: 300px;
          background-color: var(--primary);
        }
        .blob-2 {
          bottom: 10%;
          right: 10%;
          width: 400px;
          height: 400px;
          background-color: var(--secondary);
        }
        .hero-title {
          font-size: 4rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          background: linear-gradient(to right, var(--primary), var(--accent), var(--secondary));
          -webkit-background-clip: text;
          color: transparent;
        }
        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--muted);
          max-width: 600px;
          margin-bottom: 3rem;
        }
        .btn-lg {
          padding: 1rem 2.5rem;
          font-size: 1.2rem;
          box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4);
        }
        @media (max-width: 768px) {
          .hero-title { font-size: 2.5rem; }
          .hero-subtitle { font-size: 1rem; }
        }
      `}</style>
        </div>
    );
};

export default LandingPage;

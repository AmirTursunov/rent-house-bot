import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    setTimeout(() => setVisible(true), 50);
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleStart = () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }
    navigate('/search');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700;900&family=DM+Sans:wght@300;400;500&display=swap');

        .home-root {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding-bottom: 80px; /* offset for bottom nav */
        }

        .welcome-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1rem 1.5rem;
          text-align: center;
          opacity: 0;
          transform: translateY(15px);
          transition: opacity 0.7s ease, transform 0.7s ease;
          width: 100%;
        }
        .welcome-wrap.show {
          opacity: 1;
          transform: translateY(0);
        }

        .welcome-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.35);
          color: #a5b4fc;
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 5px 14px;
          border-radius: 100px;
          margin-bottom: 1.25rem;
        }

        .welcome-icon {
          font-size: 3.5rem;
          margin-bottom: 1rem;
          display: block;
          animation: float-icon 3.5s ease-in-out infinite;
        }

        .welcome-title {
          font-family: 'Unbounded', sans-serif;
          font-size: 1.5rem;
          font-weight: 900;
          line-height: 1.2;
          margin-bottom: 0.8rem;
          background: linear-gradient(135deg, var(--text-color) 0%, var(--primary) 50%, #f9a8d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .welcome-desc {
          color: var(--text-muted);
          font-size: 0.85rem;
          line-height: 1.6;
          max-width: 280px;
          margin-bottom: 2rem;
        }

        .stats-strip {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 2rem;
          width: 100%;
          max-width: 320px;
        }
        .stat-box {
          flex: 1;
          background: var(--card-bg);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          padding: 0.75rem 0.4rem;
          text-align: center;
        }
        .stat-num {
          font-family: 'Unbounded', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--primary);
        }
        .stat-label {
          font-size: 0.6rem;
          color: var(--text-muted);
          margin-top: 2px;
          text-transform: uppercase;
        }

        .btn-start {
          width: 100%;
          max-width: 320px;
          padding: 1rem 2rem;
          font-family: 'Unbounded', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: #fff;
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899);
          border: none;
          border-radius: 16px;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          box-shadow: 0 0 30px rgba(99,102,241,0.3);
        }
      `}</style>

      <div className="home-root">
        <div className={`welcome-wrap ${visible ? "show" : ""}`}>
          <div className="welcome-badge">
            <span className="badge-dot" />
            {t('home_badge')}
          </div>

          <span className="welcome-icon">🏠</span>

          <h1 className="welcome-title" dangerouslySetInnerHTML={{ __html: t('home_title') }}></h1>

          <p className="welcome-desc">
            {t('home_desc')}
          </p>

          <div className="stats-strip">
            <div className="stat-box">
              <div className="stat-num">200+</div>
              <div className="stat-label">{t('home_stat1')}</div>
            </div>
            <div className="stat-box">
              <div className="stat-num">24/7</div>
              <div className="stat-label">{t('home_stat2')}</div>
            </div>
            <div className="stat-box">
              <div className="stat-num">100%</div>
              <div className="stat-label">{t('home_stat3')}</div>
            </div>
          </div>

          <button className="btn-start" onClick={handleStart}>
            {t('home_btn')}
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;

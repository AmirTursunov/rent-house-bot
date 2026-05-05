import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Calendar, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const BottomNav = () => {
  const { t } = useTranslation();
  const tabs = [
    { name: t('nav_home'), path: '/', icon: <Home size={22} /> },
    { name: t('nav_search'), path: '/search', icon: <Search size={22} /> },
    { name: t('nav_bookings'), path: '/bookings', icon: <Calendar size={22} /> },
    { name: t('nav_profile'), path: '/profile', icon: <User size={22} /> },
  ];

  const handleImpact = () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
  };

  return (
    <>
      <style>{`
        .bottom-nav {
          position: fixed;
          bottom: 1.2rem;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 2.4rem);
          max-width: 480px;
          height: 64px;
          background: var(--card-bg);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 0 0.5rem;
          z-index: 1000;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          color: var(--text-muted);
          transition: all 0.3s ease;
          width: 25%;
          height: 100%;
          gap: 4px;
          position: relative;
        }

        .nav-item.active {
          color: var(--primary);
        }

        .nav-item.active::after {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 24px;
          height: 4px;
          background: var(--primary);
          border-radius: 0 0 4px 4px;
          box-shadow: 0 0 10px var(--primary);
        }

        .nav-label {
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.02em;
        }

        .nav-icon {
          transition: transform 0.2s ease;
        }

        .nav-item:active .nav-icon {
          transform: scale(0.85);
        }
      `}</style>
      <nav className="bottom-nav">
        {tabs.map((tab) => (
          <NavLink 
            key={tab.path} 
            to={tab.path} 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={handleImpact}
          >
            <div className="nav-icon">{tab.icon}</div>
            <span className="nav-label">{tab.name}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
};

export default BottomNav;

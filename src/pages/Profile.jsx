import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Settings, Globe, Moon, Sun, ShieldCheck, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const navigate = useNavigate();

  useEffect(() => {
    if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
      setUser(window.Telegram.WebApp.initDataUnsafe.user);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
  };

  const handleAdminAccess = () => {
    const pwd = prompt(t('admin_prompt'));
    if (pwd === "admin123") {
      window.location.href = "/admin";
    }
  };

  return (
    <div className="profile-page">
      <style>{`
        .profile-page {
          padding: 1rem;
        }
        .profile-card {
          background: var(--card-bg);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 24px;
          padding: 2rem 1.5rem;
          text-align: center;
          margin-bottom: 2rem;
          position: relative;
          overflow: hidden;
        }
        .profile-card::before {
          content: '';
          position: absolute;
          top: -50px; left: -50px;
          width: 150px; height: 150px;
          background: var(--primary);
          filter: blur(100px);
          opacity: 0.2;
        }

        .user-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), #ec4899);
          margin: 0 auto 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          color: white;
          border: 4px solid var(--glass-border);
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }
        .user-avatar img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }

        .user-name {
          font-family: 'Unbounded', sans-serif;
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-color);
          margin-bottom: 0.2rem;
        }
        .user-handle {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .settings-section {
          background: var(--card-bg);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          overflow: hidden;
        }
        .setting-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.2rem;
          border-bottom: 1px solid var(--glass-border);
          transition: background 0.2s;
        }
        .setting-item:last-child { border-bottom: none; }
        
        .setting-info {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--text-color);
        }
        .setting-icon {
          width: 36px;
          height: 36px;
          background: rgba(128,128,128,0.1);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
        }
        .setting-title {
          font-size: 0.95rem;
          font-weight: 500;
        }

        .lang-selector {
          display: flex;
          gap: 5px;
          background: rgba(0,0,0,0.1);
          padding: 4px;
          border-radius: 8px;
        }
        .lang-btn {
          padding: 4px 10px;
          font-size: 0.72rem;
          border-radius: 6px;
          cursor: pointer;
          border: none;
          background: transparent;
          color: var(--text-muted);
        }
        .lang-btn.active {
          background: white;
          color: black;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        [data-theme='dark'] .lang-btn.active {
          background: var(--primary);
          color: white;
        }

        .theme-switch {
          width: 44px;
          height: 24px;
          background: rgba(0,0,0,0.1);
          border-radius: 100px;
          padding: 2px;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: background 0.3s;
        }
        .theme-switch.dark { background: var(--primary); }
        .switch-circle {
          width: 20px;
          height: 200%;
          height: 20px;
          background: white;
          border-radius: 50%;
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .theme-switch.dark .switch-circle { transform: translateX(20px); }
      `}</style>

      <div className="profile-card">
        <div className="user-avatar">
          {user?.photo_url ? (
            <img src={user.photo_url} alt="User" />
          ) : (
            <User size={32} />
          )}
        </div>
        <div className="user-name">{user ? `${user.first_name || ''} ${user.last_name || ''}` : t('guest')}</div>
        <div className="user-handle">{user?.username ? `@${user.username}` : `ID: ${user?.id || '6547833'}`}</div>
      </div>

      <div className="section-label" style={{ margin: '1.5rem 0 0.75rem 0.5rem', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
        {t('account')}
      </div>
      <div className="settings-section" style={{ marginBottom: '1.5rem' }}>
        <div className="setting-item" onClick={() => navigate('/bookings')}>
          <div className="setting-info">
            <div className="setting-icon"><Calendar size={20} /></div>
            <div className="setting-title">{t('bookings_title')}</div>
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            {t('view')}
            <Settings size={14} style={{ opacity: 0.3 }} />
          </div>
        </div>
      </div>

      <div className="section-label" style={{ margin: '0 0 0.75rem 0.5rem', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
        {t('settings')}
      </div>
      <div className="settings-section">
        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-icon"><Sun size={20} /></div>
            <div className="setting-title">{t('dark_mode')}</div>
          </div>
          <div className={`theme-switch ${theme === 'dark' ? 'dark' : ''}`} onClick={toggleTheme}>
            <div className="switch-circle" />
          </div>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-icon"><Globe size={20} /></div>
            <div className="setting-title">{t('language')}</div>
          </div>
          <div className="lang-selector">
            {['uz', 'ru', 'en'].map(l => (
              <button 
                key={l}
                className={`lang-btn ${i18n.language === l ? 'active' : ''}`}
                onClick={() => changeLanguage(l)}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="setting-item" onClick={handleAdminAccess}>
          <div className="setting-info">
            <div className="setting-icon"><ShieldCheck size={20} /></div>
            <div className="setting-title">{t('admin_panel')}</div>
          </div>
          <Settings size={18} style={{ opacity: 0.3 }} />
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
         {t('version')}
      </div>
    </div>
  );
};

export default Profile;

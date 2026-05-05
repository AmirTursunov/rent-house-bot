import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';

const Header = () => {
  const { t, i18n } = useTranslation();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  const handleAdminSecret = () => {
    const pwd = prompt("Admin paroli: (admin123)");
    if (pwd === "admin123") {
      window.location.href = "/admin";
    } else if (pwd !== null) {
      alert("Xato parol!");
    }
  };

  return (
    <header className="header glass">
      <Link to="/" style={{textDecoration: 'none'}}>
        <h1 onDoubleClick={handleAdminSecret} style={{ userSelect: 'none' }}>{t('app_title')}</h1>
      </Link>
      <div className="header-actions">
        <select value={i18n.language} onChange={changeLanguage} style={{padding: '0.25rem 0.5rem'}}>
          <option value="uz">UZ</option>
          <option value="ru">RU</option>
          <option value="en">EN</option>
        </select>
        <button onClick={toggleTheme} className="icon-btn">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </header>
  );
};

export default Header;

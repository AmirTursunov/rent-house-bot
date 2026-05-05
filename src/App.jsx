import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Admin from './pages/Admin';
import PropertyDetail from './pages/PropertyDetail';
import Search from './pages/Search';
import Bookings from './pages/Bookings';
import Profile from './pages/Profile';
import BottomNav from './components/BottomNav';
import TelegramRedirectModal from './components/TelegramRedirectModal';
import { useTranslation } from 'react-i18next';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent = () => {
  const location = useLocation();
  const isDetail = location.pathname.startsWith('/property/');
  const isHome = location.pathname === '/';

  return (
    <div className="app-container">
      <ScrollToTop />
      <style>{`
        .global-bg-layer {
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
          background: var(--bg-color) url('/bg.jpg') no-repeat center center;
          background-size: cover;
          z-index: -2;
        }
        .global-bg-overlay {
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
          background: var(--bg-overlay);
          backdrop-filter: blur(2px);
          -webkit-backdrop-filter: blur(2px);
          z-index: -1;
        }
        .orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
          z-index: 0;
        }
        .orb-1 {
          width: 340px; height: 340px;
          background: radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 70%);
          top: -80px; left: -80px;
        }
        .orb-2 {
          width: 280px; height: 280px;
          background: radial-gradient(circle, rgba(236,72,153,0.16) 0%, transparent 70%);
          bottom: 120px; right: -60px;
        }
        .orb-3 {
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 70%);
          top: 50%; left: 50%; transform: translate(-50%, -50%);
        }
      `}</style>
      
      <div className="global-bg-layer" />
      <div className="global-bg-overlay" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {!isDetail && <Header />}
      <main 
        className={isDetail ? "" : "main-content"} 
        style={{ 
          paddingBottom: isDetail ? 0 : '120px', 
          position: 'relative', 
          zIndex: 1
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
        </Routes>
      </main>
      {!isDetail && <BottomNav />}
      <TelegramRedirectModal />
    </div>
  );
};

function App() {
  const { t } = useTranslation();

  useEffect(() => {
    // Initialize Telegram Web App
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
  }, []);

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;

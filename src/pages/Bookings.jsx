import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchUserBookings } from '../services/db';
import PropertyCard from '../components/PropertyCard';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';

const Bookings = () => {
  const { t } = useTranslation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    const tgUserId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
    const devUserId = localStorage.getItem('devUserId') || "test_user_123";
    const userId = tgUserId || devUserId;
    if (userId) {
      const data = await fetchUserBookings(userId);
      setBookings(data);
    }
    setLoading(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock size={16} className="status-icon pending" />;
      case 'approved': return <CheckCircle size={16} className="status-icon approved" />;
      case 'cancelled': return <XCircle size={16} className="status-icon cancelled" />;
      default: return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return t('status_pending');
      case 'approved': return t('status_approved');
      case 'cancelled': return t('status_cancelled');
      default: return status;
    }
  };

  return (
    <div className="bookings-page">
      <style>{`
        .bookings-page {
          padding: 1.25rem;
          min-height: calc(100vh - 160px);
        }
        .page-header {
          margin-bottom: 2rem;
          text-align: center;
        }
        .page-title {
          font-family: 'Unbounded', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, var(--text-color), var(--primary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.5rem;
        }
        .page-desc {
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        
        .bookings-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .booking-item {
          display: flex;
          flex-direction: column;
          border-radius: 20px;
          overflow: hidden;
          background: var(--card-bg);
          border: 1px solid var(--glass-border);
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }

        .booking-status-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1.25rem;
          background: rgba(255, 255, 255, 0.05);
          border-bottom: 1px solid var(--glass-border);
        }

        .status-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          padding: 4px 10px;
          border-radius: 100px;
        }
        
        .status-pill.pending { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
        .status-pill.approved { background: rgba(16, 185, 129, 0.15); color: #10b981; }
        .status-pill.cancelled { background: rgba(239, 68, 68, 0.15); color: #ef4444; }

        .booking-date-text {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .booking-content {
          padding: 1rem;
        }

        .booking-footer {
          padding: 0 1rem 1rem;
        }

        .btn-contact {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 0.75rem;
          background: #3b82f6;
          color: white;
          text-decoration: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.9rem;
          transition: transform 0.2s;
        }
        .btn-contact:active { transform: scale(0.98); }
        
        .empty-bookings {
          text-align: center;
          padding: 4rem 2rem;
          background: var(--card-bg);
          border: 1px solid var(--glass-border);
          border-radius: 24px;
          color: var(--text-muted);
        }

        .deleted-prop-notice {
          padding: 2rem 1rem;
          text-align: center;
          font-size: 0.9rem;
          color: var(--text-muted);
        }
      `}</style>

      <div className="page-header">
        <h2 className="page-title">{t('bookings_title')}</h2>
        <p className="page-desc">{t('bookings_desc')}</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)' }}>
          <div className="loader" style={{ margin: '0 auto 1rem' }}></div>
          {t('loading')}
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <div key={booking.id} className="booking-item">
                <div className="booking-status-bar">
                  <div className={`status-pill ${booking.status}`}>
                    {getStatusIcon(booking.status)}
                    {getStatusText(booking.status)}
                  </div>
                  <div className="booking-date-text">
                    <Clock size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="booking-content">
                  {booking.property ? (
                    <PropertyCard property={booking.property} />
                  ) : (
                    <div className="deleted-prop-notice glass">
                      <XCircle size={32} style={{ marginBottom: '10px', opacity: 0.5 }} />
                      <p>{t('prop_deleted', { id: booking.propertyId })}</p>
                    </div>
                  )}
                </div>

                {booking.status === 'approved' && (
                  <div className="booking-footer">
                    <a 
                      href="https://t.me/amir_079" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn-contact"
                      onClick={() => window.Telegram?.WebApp?.HapticFeedback.impactOccurred('light')}
                    >
                      Adminga bog'lanish (Telegram)
                    </a>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="empty-bookings">
              <Calendar size={48} style={{ margin: '0 auto 1.5rem', opacity: 0.3 }} />
              <p style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{t('no_bookings')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Bookings;

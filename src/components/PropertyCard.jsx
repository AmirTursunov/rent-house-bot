import React from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const PropertyCard = ({ property }) => {
  const { t } = useTranslation();

  return (
    <Link to={`/property/${property.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="property-card glass">
        <div style={{ position: 'relative' }}>
          <img src={property.images && property.images.length > 0 ? property.images[0] : ''} alt="Property" className="property-img" loading="lazy" />
          {property.isNegotiable && (
            <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#22c55e', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 'bold', boxShadow: '0 2px 10px rgba(0,0,0,0.2)', zIndex: 5 }}>
              {t('prop_negotiable')}
            </div>
          )}
        </div>
        <div className="property-info">
          <div className="property-price">
            ${property.price}
            <span style={{ fontSize: '0.8rem', fontWeight: 'normal', opacity: 0.8 }}> / {t('day')}</span>
          </div>
          <div className="property-location">
            <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }}/>
            {property.city}, {property.street}
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Home size={14} /> {t('room_count', { count: property.rooms })}
            </span>
            {property.area && (
              <span style={{ borderLeft: '1px solid var(--glass-border)', paddingLeft: '12px' }}>
                {property.area} m²
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;

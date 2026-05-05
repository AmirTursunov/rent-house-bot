import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';

const FilterForm = ({ onFilter }) => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    city: '',
    street: '',
    rooms: '',
    price_range: ''
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
    onFilter(filters);
  };

  return (
    <form className="glass" onSubmit={handleSubmit} style={{ padding: '1rem', marginBottom: '1rem' }}>
      <div className="filter-row">
        <select 
          name="city"
          value={filters.city} 
          onChange={handleChange} 
          style={{ flex: 1 }}
        >
          <option value="">{t('city')} ({t('all')})</option>
          <option value="Tashkent">Toshkent</option>
          <option value="Samarqand">Samarqand</option>
          <option value="Buxoro">Buxoro</option>
        </select>
        <input 
          name="street"
          placeholder={t('street')}
          value={filters.street} 
          onChange={handleChange} 
          style={{ flex: 1 }}
        />
      </div>
      <div className="filter-row" style={{ marginBottom: '1rem' }}>
        <input 
          type="number"
          name="rooms"
          placeholder={t('rooms')}
          value={filters.rooms} 
          onChange={handleChange} 
          style={{ width: '100%' }}
        />
      </div>
      <button type="submit" className="btn-primary" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
        <Search size={18} /> {t('search')}
      </button>
    </form>
  );
};

export default FilterForm;

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import FilterForm from '../components/FilterForm';
import PropertyCard from '../components/PropertyCard';
import { fetchProperties } from '../services/db';
import { Search as SearchIcon } from 'lucide-react';

const Search = () => {
  const { t } = useTranslation();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    handleFilter({});
  }, []);

  const handleFilter = async (filters) => {
    setLoading(true);
    setHasSearched(true);
    const data = await fetchProperties(filters);
    setProperties(data);
    setLoading(false);
  };

  return (
    <div className="search-page">
      <style>{`
        .search-page {
          padding: 1rem;
        }
        .search-header {
          margin-bottom: 1.5rem;
          text-align: center;
        }
        .search-header h2 {
          font-family: 'Unbounded', sans-serif;
          font-size: 1.5rem;
          background: linear-gradient(135deg, var(--text-color), var(--primary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .results-count {
          margin: 1rem 0;
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .empty-results {
          text-align: center;
          padding: 3rem 1rem;
          background: var(--card-bg);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          color: var(--text-muted);
        }
        .property-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
      `}</style>
      
      <div className="search-header">
        <h2>{t('search')}</h2>
      </div>

      <FilterForm onFilter={handleFilter} />

      {hasSearched && (
        <div className="results-area">
          <div className="results-count">
            {loading ? t('searching') : t('results_found', { count: properties.length })}
          </div>

          {loading ? (
            <div className="loading-grid">
               {[1,2,3].map(i => (
                 <div key={i} className="glass" style={{ height: '150px', marginBottom: '1rem', opacity: 0.5 }}></div>
               ))}
            </div>
          ) : (
            <div className="property-list">
              {properties.length > 0 ? (
                properties.map(prop => <PropertyCard key={prop.id} property={prop} />)
              ) : (
                <div className="empty-results">
                   <SearchIcon size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                   <p>{t('nothing_found')}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {!hasSearched && (
        <div className="search-intro" style={{ textAlign: 'center', marginTop: '3rem', opacity: 0.5 }}>
           <SearchIcon size={64} style={{ margin: '0 auto 1rem' }} />
           <p>{t('search_intro')}</p>
        </div>
      )}
    </div>
  );
};

export default Search;

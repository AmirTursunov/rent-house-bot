import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { addProperty, fetchProperties, setPropertyBookedStatus } from '../services/db';
import { Upload, X, Check } from 'lucide-react';

const Admin = () => {
  const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('isAdmin') === 'true'
  );
  const [pwd, setPwd] = useState('');
  const [properties, setProperties] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    city: '',
    street: '',
    price: '',
    rooms: '',
    description: '',
    images: [],
    // New technical details
    area: '',
    floor: '',
    total_floors: '',
    bedrooms: '',
    beds: '',
    bathrooms: '',
    isNegotiable: false
  });

  const loadProperties = async () => {
    const data = await fetchProperties(null, true);
    setProperties(data);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadProperties();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (pwd === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('isAdmin', 'true');
    } else {
      alert('Xato parol!');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsUploading(true);
    const newImages = [...formData.images];

    for (const file of files) {
      try {
        const reader = new FileReader();
        const base64Promise = new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
        const base64 = await base64Promise;

        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 })
        });

        const data = await response.json();
        if (data.url) {
          newImages.push(data.url);
        }
      } catch (err) {
        console.error("Upload error:", err);
      }
    }

    setFormData({ ...formData, images: newImages });
    setIsUploading(false);
  };

  const removeImage = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }

    if (formData.images.length === 0) {
      alert("Kamida bitta rasm yuklang!");
      return;
    }
    
    await addProperty({
      ...formData,
      price: parseInt(formData.price) || 0,
      rooms: parseInt(formData.rooms) || 0,
      area: parseInt(formData.area) || 0,
      floor: parseInt(formData.floor) || 0,
      total_floors: parseInt(formData.total_floors) || 0,
      bedrooms: parseInt(formData.bedrooms) || 0,
      beds: parseInt(formData.beds) || 0,
      bathrooms: parseInt(formData.bathrooms) || 0
    });
    
    alert('Muvaffaqiyatli qo\'shildi!');
    setFormData({ 
      city: '', street: '', price: '', rooms: '', description: '', images: [],
      area: '', floor: '', total_floors: '', bedrooms: '', beds: '', bathrooms: '', isNegotiable: false
    });
    loadProperties();
  };

  const toggleBooked = async (id, currentStatus) => {
    await setPropertyBookedStatus(id, !currentStatus);
    loadProperties();
  };

  if (!isAuthenticated) {
    return (
      <div className="glass" style={{ padding: '2rem', margin: '2rem auto', maxWidth: '400px', textAlign: 'center' }}>
        <h2>Admin Panel</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
          <input 
            type="password" 
            placeholder="Parolni kiriting..." 
            value={pwd} 
            onChange={(e) => setPwd(e.target.value)} 
            style={{ width: '100%' }} 
          />
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>Kirish</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: '3rem' }}>
      <div className="glass" style={{ padding: '1.5rem', marginTop: '1rem', marginBottom: '2rem' }}>
        <h2 style={{marginTop: 0, marginBottom: '1.5rem'}}>{t('add_property')}</h2>
        <form onSubmit={handleSubmit}>
          {/* Main Info */}
          <div className="filter-row">
            <div className="input-group" style={{ flex: 1 }}>
              <label>{t('city')}</label>
              <select name="city" value={formData.city} onChange={handleChange} required>
                <option value="">Tanlang...</option>
                <option value="Tashkent">Toshkent</option>
                <option value="Samarqand">Samarqand</option>
                <option value="Buxoro">Buxoro</option>
              </select>
            </div>
            <div className="input-group" style={{ flex: 1 }}>
              <label>{t('street')}</label>
              <input name="street" value={formData.street} onChange={handleChange} required />
            </div>
          </div>

          <div className="filter-row" style={{ marginTop: '0.5rem' }}>
            <div className="input-group" style={{ flex: 1 }}>
              <label>Narxi ($)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} required />
            </div>
            <div className="input-group" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1.5rem' }}>
              <input type="checkbox" name="isNegotiable" id="isNegotiable" checked={formData.isNegotiable} onChange={handleChange} style={{ width: '20px', height: '20px' }} />
              <label htmlFor="isNegotiable" style={{ marginBottom: 0 }}>Kelishiladi</label>
            </div>
          </div>

          {/* Technical Details */}
          <div className="technical-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginTop: '1rem' }}>
            <div className="input-group">
              <label>Umumiy maydon (m²)</label>
              <input type="number" name="area" value={formData.area} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Xonalar soni</label>
              <input type="number" name="rooms" value={formData.rooms} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Qavat</label>
              <input type="number" name="floor" value={formData.floor} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Bino qavatliligi</label>
              <input type="number" name="total_floors" value={formData.total_floors} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Yotoqxonalar</label>
              <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Karavotlar</label>
              <input type="number" name="beds" value={formData.beds} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Sanuzellar</label>
              <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} required />
            </div>
          </div>

          {/* Image Upload */}
          <div className="input-group" style={{ marginTop: '1rem' }}>
            <label>Rasmlar (Upload)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
              {formData.images.map((img, idx) => (
                <div key={idx} style={{ position: 'relative', width: '80px', height: '80px' }}>
                  <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                  <button type="button" onClick={() => removeImage(idx)} style={{ position: 'absolute', top: -5, right: -5, background: 'red', border: 'none', borderRadius: '50%', color: 'white', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <X size={12} />
                  </button>
                </div>
              ))}
              <label style={{ width: '80px', height: '80px', border: '2px dashed var(--glass-border)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <input type="file" multiple accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                {isUploading ? <div className="loader" style={{ width: '20px', height: '20px' }}></div> : <Upload size={24} color="var(--text-muted)" />}
              </label>
            </div>
          </div>

          <div className="input-group" style={{ marginTop: '1rem' }}>
            <label>{t('description')}</label>
            <textarea name="description" value={formData.description} onChange={handleChange} style={{ width: '100%', backgroundColor: 'var(--input-bg)', border: '1px solid var(--input-border)', color: 'white', padding: '0.5rem', borderRadius: '8px' }} rows={3} />
          </div>

          <button type="submit" className="btn-primary" disabled={isUploading} style={{ marginTop: '0.5rem' }}>
            {isUploading ? 'Yuklanmoqda...' : t('save')}
          </button>
        </form>
      </div>

      <div className="glass" style={{ padding: '1.5rem' }}>
        <h2 style={{marginTop: 0, marginBottom: '1.5rem'}}>Uylarni boshqarish</h2>
        
        {properties.length === 0 && <p>Hozircha uylar kiritilmagan.</p>}
        
        {properties.map(p => (
           <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', padding: '0.75rem 0' }}>
             <div style={{ flex: 1 }}>
               <strong style={{ display: 'block' }}>{p.city}, {p.street}</strong>
               <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                 ${p.price} {p.isNegotiable && '(Kelishiladi)'} | {p.area} m² | {p.isBooked ? '🔴 Band' : '🟢 Ochiq'}
               </div>
             </div>
             <button 
                onClick={() => toggleBooked(p.id, p.isBooked)} 
                style={{ 
                  padding: '0.5rem 1rem', 
                  borderRadius: '8px', 
                  cursor: 'pointer', 
                  background: p.isBooked ? '#ef4444' : '#22c55e', 
                  color: '#fff', 
                  border: 'none',
                  fontWeight: 'bold',
                  fontSize: '0.8rem'
                }}>
                {p.isBooked ? 'Ochish' : 'Band qilish'}
             </button>
           </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPropertyById, fetchPropertyBookings } from "../services/db";
import {
  MapPin,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  BedDouble,
  Bath,
  Layers,
  Home,
  Bed,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const PropertyDetail = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);
  const [previewImg, setPreviewImg] = useState(null);
  const [checkInDate, setCheckInDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [checkOutDate, setCheckOutDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [bookedDates, setBookedDates] = useState([]);

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    const data = await getPropertyById(id);
    setProperty(data);
    const bookingsData = await fetchPropertyBookings(id);
    setBookedDates(bookingsData);
  };

  if (!property)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "var(--bg-color)",
          color: "var(--text-color)",
        }}
      >
        <div style={{ textAlign: "center", color: "var(--text-muted)" }}>
          <div className="loader" style={{ margin: "0 auto 1rem" }}></div>
          {t("loading")}
        </div>
      </div>
    );

  const nextImage = () =>
    setCurrentImageIndex((p) => (p + 1) % property.images.length);
  const prevImage = () =>
    setCurrentImageIndex((p) => (p === 0 ? property.images.length - 1 : p - 1));

  const getTotalDays = () => {
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const constructTelegramUrl = () => {
    const totalDays = getTotalDays();
    const totalSum = totalDays * property.price;
    const text = t("book_telegram_msg", {
      city: property.city,
      street: property.street,
      price: property.price,
      rooms: property.rooms,
      id: property.id,
      checkInDate,
      checkOutDate,
      totalDays,
      totalSum,
      negotiable: property.isNegotiable ? ` (${t("prop_negotiable")})` : "",
    });
    return `https://t.me/amir_079?text=${encodeURIComponent(text)}`;
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (booking) return;
    setBooking(true);

    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    if (start > end) {
      alert(t("error_date_order"));
      setBooking(false);
      return;
    }

    for (const b of bookedDates) {
      const bStart = new Date(b.checkInDate);
      const bEnd = new Date(b.checkOutDate);
      if (start <= bEnd && end >= bStart) {
        alert(t("error_date_overlap"));
        setBooking(false);
        return;
      }
    }

    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred("heavy");
    }

    const tgUserId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id || null;
    const devUserId = localStorage.getItem("devUserId") || "test_user_123";
    const userId = tgUserId || devUserId;

    try {
      const response = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          property,
          userId,
          checkInDate,
          checkOutDate,
          language: i18n.language,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(
          t("network_error", {
            message: errorData.error || errorData.details || "Noma'lum xato",
          }),
        );
        setBooking(false);
        return;
      }

      setBooked(true);
      setTimeout(() => {
        window.location.href = constructTelegramUrl();
      }, 800);
    } catch (e) {
      console.error("Booking notification error:", e);
      alert(t("network_error", { message: e.message }));
      setBooking(false);
    }
  };

  const specs = [
    {
      icon: <Maximize2 size={16} />,
      label: t("prop_area"),
      value: `${property.area} m²`,
    },
    {
      icon: <Layers size={16} />,
      label: t("prop_floor"),
      value: `${property.floor}/${property.total_floors}`,
    },
    { icon: <Home size={16} />, label: t("prop_rooms"), value: property.rooms },
    {
      icon: <BedDouble size={16} />,
      label: t("prop_bedrooms"),
      value: property.bedrooms,
    },
    { icon: <Bed size={16} />, label: t("prop_beds"), value: property.beds },
    {
      icon: <Bath size={16} />,
      label: t("prop_bathrooms"),
      value: property.bathrooms,
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700;900&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--bg-color); color: var(--text-color); font-family: 'DM Sans', sans-serif; }

        .detail-root {
          min-height: 100vh;
          background: var(--bg-color);
          padding-bottom: 7rem;
          animation: fadeIn 0.4s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        /* — Image slider — */
        .slider-wrap {
          position: relative;
          height: 310px;
          background: var(--bg-color);
          overflow: hidden;
        }
        .slider-img {
          position: absolute;
          top: 0; left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: opacity 0.3s ease;
        }
        .slider-img.hidden { opacity: 0; }
        .slider-img.visible { opacity: 1; }

        /* gradient overlay bottom */
        .slider-gradient {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 140px;
          background: linear-gradient(to top, var(--bg-color), transparent);
          pointer-events: none;
        }

        .back-btn {
          position: absolute;
          top: 14px; left: 14px;
          z-index: 10;
          width: 52px; height: 52px;
          background: var(--card-bg);
          backdrop-filter: blur(12px);
          border: 1px solid var(--glass-border);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background 0.15s;
        }
        .back-btn:active { background: var(--glass-border); }

        .nav-btn {
          position: absolute;
          top: 50%; transform: translateY(-50%);
          width: 48px; height: 48px;
          background: var(--card-bg);
          backdrop-filter: blur(8px);
          border: 1px solid var(--glass-border);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          color: var(--text-color);
          transition: background 0.15s;
          z-index: 5;
        }
        .nav-btn:active { background: var(--glass-border); }
        .nav-prev { left: 12px; }
        .nav-next { right: 12px; }

        .img-counter {
          position: absolute;
          bottom: 58px; left: 50%; transform: translateX(-50%);
          background: var(--card-bg);
          backdrop-filter: blur(8px);
          border: 1px solid var(--glass-border);
          color: var(--text-color);
          font-size: 0.72rem;
          padding: 4px 12px;
          border-radius: 100px;
          letter-spacing: 0.06em;
          z-index: 5;
        }

        /* dot indicators */
        .img-dots {
          position: absolute;
          bottom: 20px; left: 0; right: 0;
          display: flex; justify-content: center; gap: 5px;
          z-index: 5;
        }
        .img-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--glass-border);
          transition: background 0.2s, transform 0.2s;
        }
        .img-dot.active { background: var(--primary); transform: scale(1.4); }

        /* — Content — */
        .content-wrap { padding: 0 1rem; }

        .price-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          padding: 1.4rem 0 0.8rem;
        }
        .price-main {
          font-family: 'Unbounded', sans-serif;
          font-size: 2rem;
          font-weight: 900;
          background: linear-gradient(135deg, var(--text-color), var(--primary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
        }
        .price-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 400;
          margin-left: 4px;
          -webkit-text-fill-color: var(--text-muted);
        }
        .negotiable-tag {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(34,197,94,0.15);
          border: 1px solid rgba(34,197,94,0.3);
          color: #4ade80;
          font-size: 0.72rem;
          font-weight: 600;
          padding: 5px 12px;
          border-radius: 100px;
          letter-spacing: 0.04em;
        }
        .neg-dot {
          width: 5px; height: 5px;
          background: #4ade80;
          border-radius: 50%;
        }

        .location-row {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-muted);
          font-size: 0.9rem;
          padding-bottom: 1.4rem;
          border-bottom: 1px solid var(--glass-border);
        }

        /* — Image Preview Modal — */
        .preview-modal {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          animation: modalFadeIn 0.3s forwards;
        }
        @keyframes modalFadeIn {
          to { opacity: 1; }
        }
        .preview-img-container {
          position: relative;
          width: 100%;
          max-width: 500px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }
        .preview-img {
          max-width: 100%;
          max-height: 80vh;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
          transform: scale(0.9);
          animation: imgZoomIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes imgZoomIn {
          to { transform: scale(1); }
        }
        .close-preview {
          position: absolute;
          top: 30px;
          right: 20px;
          width: 44px;
          height: 44px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
        }

        /* — Specs grid — */
        .section-title {
          font-family: 'Unbounded', sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin: 1.4rem 0 0.8rem;
        }

        .specs-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.6rem;
        }
        .spec-box {
          background: var(--card-bg);
          border: 1px solid var(--glass-border);
          border-radius: 14px;
          padding: 0.85rem 0.6rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          transition: border-color 0.2s;
        }
        .spec-box:active { border-color: var(--primary); }
        .spec-icon { color: var(--primary); }
        .spec-label {
          font-size: 0.65rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          text-align: center;
        }
        .spec-value {
          font-family: 'Unbounded', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-color);
        }

        /* — Description — */
        .desc-box {
          background: var(--card-bg);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          padding: 1.1rem;
          margin-top: 0.8rem;
        }
        .desc-text {
          color: var(--text-color);
          font-size: 0.9rem;
          line-height: 1.7;
        }

        /* — Fixed booking bar — */
        .booking-bar {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          padding: 0.9rem 1rem calc(0.9rem + env(safe-area-inset-bottom));
          background: var(--bg-color);
          backdrop-filter: blur(20px);
          border-top: 1px solid var(--glass-border);
          z-index: 50;
        }

        .btn-book {
          width: 100%;
          max-width: 540px;
          margin: 0 auto;
          display: block;
          padding: 1rem;
          font-family: 'Unbounded', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: #fff;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .btn-book.idle {
          background: linear-gradient(135deg, var(--primary), #8b5cf6, #ec4899);
          box-shadow: 0 0 30px rgba(99,102,241,0.4);
        }
        .btn-book.loading {
          background: var(--card-bg);
          color: var(--text-muted);
          cursor: not-allowed;
        }
        .btn-book.success {
          background: linear-gradient(135deg, #059669, #10b981);
          box-shadow: 0 0 30px rgba(16,185,129,0.4);
        }
        .btn-book.idle:active {
          transform: scale(0.98);
          box-shadow: 0 0 15px rgba(99,102,241,0.3);
        }
        .btn-book::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent);
          pointer-events: none;
        }
      `}</style>

      <div className="detail-root">
        {/* Slider */}
        <div
          className="slider-wrap"
          onClick={() => setPreviewImg(property.images[currentImageIndex])}
        >
          {property.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={property.title}
              className={`slider-img ${
                idx === currentImageIndex ? "visible" : "hidden"
              }`}
              onLoad={() => idx === currentImageIndex && setImgLoaded(true)}
            />
          ))}
          <div className="slider-gradient" />

          <div
            className="back-btn"
            onClick={(e) => {
              e.stopPropagation();
              navigate(-1);
            }}
          >
            <ArrowLeft size={24} color="var(--text-color)" />
          </div>

          {property.images.length > 1 && (
            <>
              <div
                className="nav-btn nav-prev"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
              >
                <ChevronLeft size={24} />
              </div>
              <div
                className="nav-btn nav-next"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
              >
                <ChevronRight size={24} />
              </div>
            </>
          )}

          <div className="img-counter">
            {currentImageIndex + 1} / {property.images.length}
          </div>

          <div className="img-dots">
            {property.images.map((_, i) => (
              <div
                key={i}
                className={`img-dot ${i === currentImageIndex ? "active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(i);
                }}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="content-wrap">
          {/* Price row */}
          <div className="price-row">
            <div>
              <span className="price-main">${property.price}</span>
              <span className="price-main price-sub">{t("per_day")}</span>
            </div>
            {property.isNegotiable && (
              <div className="negotiable-tag">
                <span className="neg-dot" />
                {t("prop_negotiable")}
              </div>
            )}
          </div>

          {/* Location */}
          <div className="location-row">
            <MapPin size={15} color="#a5b4fc" />
            <span>
              {property.city}, {property.street}
            </span>
          </div>

          {/* Specs */}
          <div className="section-title">{t("features")}</div>
          <div className="specs-grid">
            {specs.map((s, i) => (
              <div className="spec-box" key={i}>
                {s.icon && <span className="spec-icon">{s.icon}</span>}
                <span className="spec-label">{s.label}</span>
                <span className="spec-value">{s.value}</span>
              </div>
            ))}
          </div>

          {/* Description */}
          {property.description && property.description.trim() !== "" && (
            <>
              <div className="section-title">{t("description")}</div>
              <div className="desc-box">
                <p className="desc-text">{property.description}</p>
              </div>
            </>
          )}
          {/* Booking Info */}
          <div className="section-title">{t("prop_booking_info")}</div>
          <div
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--glass-border)",
              padding: "15px",
              borderRadius: "16px",
              marginBottom: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            {bookedDates.length > 0 && (
              <div
                style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  padding: "10px 15px",
                  borderRadius: "12px",
                }}
              >
                <div
                  style={{
                    color: "#ef4444",
                    fontSize: "0.85rem",
                    fontWeight: "bold",
                    marginBottom: "8px",
                  }}
                >
                  {t("prop_booked_dates")}
                </div>
                {bookedDates.map((b, i) => (
                  <div
                    key={i}
                    style={{
                      color: "var(--text-color)",
                      fontSize: "0.85rem",
                      marginBottom: "4px",
                      opacity: 0.9,
                    }}
                  >
                    • {b.checkInDate} — {b.checkOutDate}
                  </div>
                ))}
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "0.9rem", color: "var(--text-color)" }}>
                {t("prop_checkin")}
              </span>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                style={{
                  background: "var(--bg-color)",
                  border: "1px solid var(--glass-border)",
                  color: "var(--text-color)",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  fontFamily: "inherit",
                  outline: "none",
                }}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "0.9rem", color: "var(--text-color)" }}>
                {t("prop_checkout")}
              </span>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                style={{
                  background: "var(--bg-color)",
                  border: "1px solid var(--glass-border)",
                  color: "var(--text-color)",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  fontFamily: "inherit",
                  outline: "none",
                }}
                min={checkInDate || new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Booking bar */}
      <div
        className="booking-bar"
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        {getTotalDays() > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0 5px",
            }}
          >
            <span style={{ color: "var(--text-color)", fontSize: "0.9rem" }}>
              {t("prop_total_sum", { days: getTotalDays() })}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  color: "var(--accent-color)",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                }}
              >
                ${getTotalDays() * property.price}
              </span>
              {property.isNegotiable && (
                <span className="badge negotiable">{t("prop_negotiable")}</span>
              )}
            </div>
          </div>
        )}
        <button
          className={`btn-book ${booked ? "success" : booking ? "loading" : "idle"}`}
          onClick={handleBooking}
        >
          {booked
            ? t("prop_sent")
            : booking
              ? t("prop_sending")
              : t("prop_book_btn")}
        </button>
      </div>

      {/* Fullscreen Preview Modal */}
      {previewImg && (
        <div className="preview-modal" onClick={() => setPreviewImg(null)}>
          <div
            className="preview-img-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="close-preview" onClick={() => setPreviewImg(null)}>
              <XIcon />
            </div>
            <img src={previewImg} alt="Preview" className="preview-img" />
          </div>
        </div>
      )}
    </>
  );
};

const XIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default PropertyDetail;

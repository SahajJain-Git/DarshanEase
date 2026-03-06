import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import styles from './TempleDetailPage.module.css';

export default function TempleDetailPage() {
  const { id }  = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [temple,       setTemple]       = useState(null);
  const [slots,        setSlots]        = useState([]);
  const [loadTemple,   setLoadTemple]   = useState(true);
  const [loadSlots,    setLoadSlots]    = useState(false);
  const [date,         setDate]         = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });

  // Fetch temple info on mount
  useEffect(() => {
    api.get(`/temples/${id}`)
      .then((res) => setTemple(res.data.temple))
      .finally(() => setLoadTemple(false));
  }, [id]);

  // Re-fetch slots whenever the date changes
  useEffect(() => {
    if (!id) return;
    setLoadSlots(true);
    api.get(`/slots?templeId=${id}&date=${date}`)
      .then((res) => setSlots(res.data.slots))
      .finally(() => setLoadSlots(false));
  }, [id, date]);

  const handleBook = (slot) => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/temples/${id}` } } });
      return;
    }
    navigate(`/book/${slot._id}`, { state: { slot, temple } });
  };

  const today = new Date().toISOString().split('T')[0];

  if (loadTemple) return <div className="spinner-wrap" style={{ paddingTop: 120 }}><div className="spinner" /></div>;
  if (!temple)   return (
    <div className="empty-state" style={{ paddingTop: 120 }}>
      <div className="eso">🛕</div>
      <h3>Temple not found</h3>
    </div>
  );

  return (
    <div className="page-wrap">
      {/* ── Temple Hero ── */}
      <div className={styles.hero}>
        <div className={styles.heroEmoji}>{temple.emoji || '🛕'}</div>
        <div className={styles.heroContent}>
          <span className="eyebrow" style={{ color: 'rgba(253,246,236,0.5)' }}>
            ✦ Temple Darshan
          </span>
          <h1 className={styles.heroTitle}>{temple.name}</h1>
          <p className={styles.heroLoc}>📍 {temple.location}</p>
          {temple.description && (
            <p className={styles.heroDesc}>{temple.description}</p>
          )}
          <div className={styles.heroBadges}>
            <span className="badge badge-orange">🙏 {temple.deity}</span>
            <span className="badge badge-blue">
              ⏰ {temple.darshanStartTime} – {temple.darshanEndTime}
            </span>
            <span className={`badge ${temple.pricePerDevotee === 0 ? 'badge-green' : 'badge-orange'}`}>
              {temple.pricePerDevotee === 0
                ? '✅ Free Entry'
                : `₹${temple.pricePerDevotee} / devotee`}
            </span>
          </div>
        </div>
      </div>

      {/* ── Slots Section ── */}
      <div className="section">
        <div className="container">
          <div className={styles.slotHeader}>
            <h2 style={{ fontSize: 22 }}>Available Darshan Slots</h2>
            <input
              type="date"
              className="form-control"
              style={{ width: 200 }}
              value={date}
              min={today}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {loadSlots ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : slots.length === 0 ? (
            <div className="empty-state">
              <div className="eso">📅</div>
              <h3>No slots available</h3>
              <p>Try selecting a different date</p>
            </div>
          ) : (
            <div className={styles.slotsGrid}>
              {slots.map((slot) => {
                const isFull = slot.availableSeats <= 0;
                return (
                  <div
                    key={slot._id}
                    className={`${styles.slotCard} ${isFull ? styles.slotFull : ''}`}
                  >
                    <div className={styles.slotTime}>
                      {slot.startTime} – {slot.endTime}
                    </div>
                    <div className={styles.slotDate}>{slot.date}</div>
                    <div className={styles.slotSeats}>
                      <span className={`badge ${isFull ? 'badge-red' : slot.availableSeats < 10 ? 'badge-orange' : 'badge-green'}`}>
                        {isFull ? 'Fully Booked' : `${slot.availableSeats} seats left`}
                      </span>
                    </div>
                    <div className={styles.slotPrice}>
                      {slot.pricePerDevotee === 0 ? 'Free' : `₹${slot.pricePerDevotee}`}
                    </div>
                    <button
                      className={`btn ${isFull ? 'btn-ghost' : 'btn-primary'} btn-sm btn-block`}
                      disabled={isFull}
                      onClick={() => !isFull && handleBook(slot)}
                    >
                      {isFull ? 'Fully Booked' : 'Book This Slot →'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Login nudge */}
          {!user && (
            <div className="alert alert-info" style={{ maxWidth: 480, margin: '28px auto', textAlign: 'center' }}>
              Please{' '}
              <Link to="/login" style={{ color: 'var(--saffron)', fontWeight: 700 }}>sign in</Link>
              {' '}to book a darshan slot.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
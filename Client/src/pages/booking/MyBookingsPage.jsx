import { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import styles from './MyBookings.module.css';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [tab,      setTab]      = useState('upcoming');
  const [loading,  setLoading]  = useState(true);

  const fetchBookings = () =>
    api.get('/bookings/my')
      .then((res) => setBookings(res.data.bookings))
      .finally(() => setLoading(false));

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await api.put(`/bookings/${id}/cancel`);
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancel failed');
    }
  };

  const today    = new Date().toISOString().split('T')[0];
  const upcoming = bookings.filter((b) => b.slot?.date >= today && b.status !== 'cancelled');
  const past     = bookings.filter((b) => b.slot?.date <  today || b.status === 'cancelled');
  const shown    = tab === 'upcoming' ? upcoming : past;

  return (
    <div className="page-wrap">
      <div className="page-header">
        <span className="eyebrow">✦ Your Journey</span>
        <h1>My Bookings</h1>
        <p>Manage your darshan bookings and view your e-tickets</p>
      </div>

      <div className="section">
        <div className="container" style={{ maxWidth: 720 }}>
          {/* Tabs */}
          <div className="tabs">
            <button
              className={`tab-btn ${tab === 'upcoming' ? 'active' : ''}`}
              onClick={() => setTab('upcoming')}
            >
              Upcoming ({upcoming.length})
            </button>
            <button
              className={`tab-btn ${tab === 'past' ? 'active' : ''}`}
              onClick={() => setTab('past')}
            >
              Past & Cancelled ({past.length})
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : shown.length === 0 ? (
            <div className="empty-state">
              <div className="eso">🎟️</div>
              <h3>No {tab} bookings</h3>
              <p>
                {tab === 'upcoming'
                  ? 'Book a darshan slot to get started!'
                  : 'Your past bookings will appear here.'}
              </p>
            </div>
          ) : (
            shown.map((b) => (
              <div key={b._id} className={`card ${styles.bCard}`}>
                {/* Card header */}
                <div className={styles.bHeader}>
                  <div>
                    <div className={styles.bTemple}>
                      {b.temple?.emoji} {b.temple?.name}
                    </div>
                    <div className={styles.bId}>#{b.bookingId}</div>
                  </div>
                  <span className={`badge ${b.status === 'confirmed' ? 'badge-green' : b.status === 'cancelled' ? 'badge-red' : 'badge-gray'}`}>
                    {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                  </span>
                </div>

                {/* Details grid */}
                <div className={styles.bBody}>
                  <div className={styles.detailGrid}>
                    {[
                      ['📍', 'Location',  b.temple?.location],
                      ['📅', 'Date',      b.slot?.date],
                      ['⏰', 'Time',      `${b.slot?.startTime} – ${b.slot?.endTime}`],
                      ['👥', 'Devotees',  b.devotees],
                      ['💰', 'Amount',    `₹${b.totalAmount}`],
                      ['🙏', 'Donation',  b.donationAmount > 0 ? `₹${b.donationAmount}` : 'None'],
                    ].map(([ic, l, v]) => (
                      <div key={l} className={styles.detailItem}>
                        <div className={styles.detailLabel}>{ic} {l}</div>
                        <div className={styles.detailVal}>{v || '—'}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cancel button (only for confirmed upcoming bookings) */}
                {b.status === 'confirmed' && b.slot?.date >= today && (
                  <div className={styles.bFooter}>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleCancel(b._id)}
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
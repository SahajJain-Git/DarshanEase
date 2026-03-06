import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import api from '../../api/axios';
import styles from './BookingSuccess.module.css';

export default function BookingSuccessPage() {
  const { bookingId } = useParams();
  const { state }     = useLocation();
  const [booking, setBooking] = useState(state?.booking || null);
  const [loading, setLoading] = useState(!state?.booking);

  // If navigated directly (no state), fetch from API
  useEffect(() => {
    if (!booking) {
      api.get(`/bookings/${bookingId}`)
        .then((res) => setBooking(res.data.booking))
        .finally(() => setLoading(false));
    }
  }, [bookingId]);

  if (loading) return <div className="spinner-wrap" style={{ paddingTop: 120 }}><div className="spinner" /></div>;
  if (!booking) return <div className="empty-state" style={{ paddingTop: 120 }}><h3>Booking not found</h3></div>;

  return (
    <div className="page-wrap">
      <div className="section">
        <div className="container" style={{ maxWidth: 560 }}>
          <div className={styles.box}>
            <div className={styles.checkIcon}>🎉</div>
            <h2 className={styles.title}>Booking Confirmed!</h2>
            <div className={styles.bookingId}>{booking.bookingId}</div>
            <p className={styles.sub}>
              Your darshan slot has been reserved. Present your Booking ID at the
              temple entrance.
            </p>

            {/* E-Ticket */}
            <div className={styles.ticket}>
              <div className={styles.ticketHeader}>
                <div>
                  <div className={styles.ticketTemple}>
                    {booking.temple?.emoji} {booking.temple?.name}
                  </div>
                  <div className={styles.ticketId}>#{booking.bookingId}</div>
                </div>
                <span className="badge badge-green">Confirmed</span>
              </div>

              <div className={styles.ticketBody}>
                {[
                  ['Date',      booking.slot?.date],
                  ['Time',      `${booking.slot?.startTime} – ${booking.slot?.endTime}`],
                  ['Location',  booking.temple?.location],
                  ['Devotees',  booking.devotees],
                  ['Amount',    `₹${booking.totalAmount}`],
                  ['Donation',  booking.donationAmount > 0 ? `₹${booking.donationAmount}` : 'None'],
                ].map(([l, v]) => (
                  <div key={l} className={styles.ticketRow}>
                    <span className={styles.ticketLbl}>{l}</span>
                    <span className={styles.ticketVal}>{v || '—'}</span>
                  </div>
                ))}
              </div>

              <div className={styles.ticketFooter}>
                <div className={styles.qr}>🙏</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                    Digital Entry Pass
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                    Show at temple entrance
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.actions}>
              <Link to="/my-bookings" className="btn btn-primary btn-lg">
                View All Bookings
              </Link>
              <Link to="/temples" className="btn btn-outline btn-lg">
                Book Another
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
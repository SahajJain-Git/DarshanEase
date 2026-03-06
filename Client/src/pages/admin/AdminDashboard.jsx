import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
  totalBookings: 0,
  confirmedBookings: 0,
  totalUsers: 0,
  totalTemples: 0,
  totalRevenue: 0,
  totalDonations: 0
});
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading,        setLoading]        = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/bookings/admin/stats'),
      api.get('/bookings'),
    ]).then(([sRes, bRes]) => {
      setStats(sRes.data.stats);
      setRecentBookings((bRes.data.bookings || []).slice(0, 8));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <div>
      {/* Page title */}
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle}>Dashboard Overview</h2>
          <p className={styles.pageSub}>Welcome to DarshanEase Admin Panel</p>
        </div>
        <div className={styles.liveIndicator}>
          <span className={styles.liveDot} /> Live
        </div>
      </div>

      {/* Top stat cards */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          ['🎟️', stats.totalBookings,    'Total Bookings'],
          ['✅', stats.confirmedBookings, 'Confirmed'],
          ['👥', stats.totalUsers,        'Registered Users'],
          ['🛕', stats.totalTemples,      'Active Temples'],
        ].map(([ico, num, lbl]) => (
          <div key={lbl} className="stat-card">
            <div className="ico">{ico}</div>
            <div className="num">{num}</div>
            <div className="lbl">{lbl}</div>
          </div>
        ))}
      </div>

      {/* Revenue cards */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="ico">💰</div>
          <div className="num">₹{stats.totalRevenue.toLocaleString('en-IN')}</div>
          <div className="lbl">Total Revenue</div>
        </div>
        <div className="stat-card">
          <div className="ico">🙏</div>
          <div className="num">₹{stats.totalDonations.toLocaleString('en-IN')}</div>
          <div className="lbl">Total Donations</div>
        </div>
      </div>

      {/* Recent bookings table */}
      <div className="card card-body">
        <div className={styles.tableHeader}>
          <h3 style={{ fontSize: 16 }}>Recent Bookings</h3>
          <Link to="/admin/bookings" className="btn btn-ghost btn-sm">View All →</Link>
        </div>
        {recentBookings.length === 0 ? (
          <div className="empty-state" style={{ padding: '32px 0' }}>
            <div className="eso">🎟️</div>
            <h3>No bookings yet</h3>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Temple</th>
                  <th>Devotee</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr key={b._id}>
                    <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{b.bookingId}</td>
                    <td>{b.temple?.emoji} {b.temple?.name}</td>
                    <td>{b.user?.name}</td>
                    <td style={{ fontSize: 13 }}>{b.slot?.date}</td>
                    <td style={{ fontFamily: "'Cinzel',serif", color: 'var(--saffron)' }}>
                      ₹{b.totalAmount}
                    </td>
                    <td>
                      <span className={`badge ${b.status === 'confirmed' ? 'badge-green' : b.status === 'cancelled' ? 'badge-red' : 'badge-gray'}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
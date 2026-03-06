import { useEffect, useState } from 'react';
import api from '../../api/axios';
import styles from './AdminBookings.module.css';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    api.get('/bookings')
      .then((r) => setBookings(r.data.bookings))
      .finally(() => setLoading(false));
  }, []);

  const filtered = bookings.filter((b) => {
    const q = search.toLowerCase();
    const matchSearch =
      b.bookingId?.toLowerCase().includes(q) ||
      b.user?.name?.toLowerCase().includes(q) ||
      b.user?.email?.toLowerCase().includes(q) ||
      b.temple?.name?.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <div className={styles.topBar}>
        <div>
          <h2 style={{ fontSize: 22 }}>All Bookings</h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            Track and manage all darshan bookings
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="card card-body" style={{ marginBottom: 18 }}>
        <div className="form-row" style={{ marginBottom: 0 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Search</label>
            <input
              className="form-control"
              placeholder="Search by ID, name, email, temple…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Status</label>
            <select className="form-control" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card card-body">
        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state" style={{ padding: '32px 0' }}>
            <div className="eso">🎟️</div>
            <h3>No bookings found</h3>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Temple</th>
                  <th>Devotee</th>
                  <th>Date / Time</th>
                  <th>Devotees</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b._id}>
                    <td style={{ fontFamily: 'monospace', fontSize: 11 }}>{b.bookingId}</td>
                    <td>{b.temple?.emoji} {b.temple?.name}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{b.user?.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{b.user?.email}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: 13 }}>{b.slot?.date}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        {b.slot?.startTime} – {b.slot?.endTime}
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>{b.devotees}</td>
                    <td style={{ fontFamily: "'Cinzel',serif", color: 'var(--saffron)' }}>
                      ₹{b.totalAmount}
                    </td>
                    <td style={{ fontSize: 12, textTransform: 'capitalize' }}>{b.paymentMethod}</td>
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
        {!loading && (
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 14 }}>
            Showing {filtered.length} of {bookings.length} bookings
          </p>
        )}
      </div>
    </div>
  );
}
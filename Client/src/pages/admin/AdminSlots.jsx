import { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import styles from './AdminSlots.module.css';

const EMPTY_SLOT = {
  temple: '', date: '', startTime: '05:30', endTime: '07:00',
  totalSeats: 50, pricePerDevotee: 0,
};

export default function AdminSlots() {
  const [slots,     setSlots]     = useState([]);
  const [temples,   setTemples]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId,    setEditId]    = useState(null);
  const [form,      setForm]      = useState(EMPTY_SLOT);
  const [saving,    setSaving]    = useState(false);
  const [filter,    setFilter]    = useState({ templeId: '', date: '' });

  const fetchAll = () => {
    const p = new URLSearchParams();
    if (filter.templeId) p.set('templeId', filter.templeId);
    if (filter.date)     p.set('date',     filter.date);
    Promise.all([
      api.get(`/slots?${p}`),
      api.get('/temples'),
    ]).then(([sRes, tRes]) => {
      setSlots(sRes.data.slots);
      setTemples(tRes.data.temples);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, [filter]);

  const openCreate = () => { setEditId(null); setForm(EMPTY_SLOT); setShowModal(true); };
  const openEdit   = (s) => {
    setEditId(s._id);
    setForm({
      temple:          s.temple?._id || s.temple,
      date:            s.date,
      startTime:       s.startTime,
      endTime:         s.endTime,
      totalSeats:      s.totalSeats,
      pricePerDevotee: s.pricePerDevotee,
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) { await api.put(`/slots/${editId}`, form); toast.success('Slot updated'); }
      else        { await api.post('/slots', form);           toast.success('Slot created'); }
      setShowModal(false);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deactivate this slot?')) return;
    try {
      await api.delete(`/slots/${id}`);
      toast.success('Slot deactivated');
      fetchAll();
    } catch { toast.error('Failed'); }
  };

  const today = new Date().toISOString().split('T')[0];
  const setF  = (k) => (e) => setFilter((p) => ({ ...p, [k]: e.target.value }));
  const setFm = (k) => (e) => setForm((p)   => ({ ...p, [k]: e.target.value }));

  return (
    <div>
      <div className={styles.topBar}>
        <div>
          <h2 style={{ fontSize: 22 }}>Darshan Slots</h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Create and manage time slots</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Slot</button>
      </div>

      {/* Filters */}
      <div className="card card-body" style={{ marginBottom: 18 }}>
        <div className="form-row" style={{ marginBottom: 0 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Filter by Temple</label>
            <select className="form-control" value={filter.templeId} onChange={setF('templeId')}>
              <option value="">All Temples</option>
              {temples.map((t) => (
                <option key={t._id} value={t._id}>{t.emoji} {t.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Filter by Date</label>
            <input type="date" className="form-control" value={filter.date} onChange={setF('date')} />
          </div>
        </div>
      </div>

      <div className="card card-body">
        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : slots.length === 0 ? (
          <div className="empty-state" style={{ padding: '32px 0' }}>
            <div className="eso">⏰</div>
            <h3>No slots found</h3>
            <p>Add a slot or change the filters</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Temple</th><th>Date</th><th>Time</th>
                  <th>Seats</th><th>Booked</th><th>Price</th>
                  <th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {slots.map((s) => (
                  <tr key={s._id}>
                    <td>{s.temple?.emoji} {s.temple?.name}</td>
                    <td>{s.date}</td>
                    <td style={{ fontSize: 13, fontWeight: 600 }}>{s.startTime} – {s.endTime}</td>
                    <td>{s.totalSeats}</td>
                    <td>
                      <span className={`badge ${s.availableSeats === 0 ? 'badge-red' : s.availableSeats < 10 ? 'badge-orange' : 'badge-green'}`}>
                        {s.bookedSeats}/{s.totalSeats}
                      </span>
                    </td>
                    <td>{s.pricePerDevotee === 0 ? 'Free' : `₹${s.pricePerDevotee}`}</td>
                    <td>
                      <span className={`badge ${s.isActive ? 'badge-green' : 'badge-red'}`}>
                        {s.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-outline btn-sm" onClick={() => openEdit(s)}>Edit</button>
                        {s.isActive && (
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s._id)}>Remove</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <div>
                <div className="modal-title">{editId ? 'Edit Slot' : 'Create Slot'}</div>
              </div>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSave}>
                <div className="form-group">
                  <label className="form-label">Temple *</label>
                  <select className="form-control" value={form.temple} onChange={setFm('temple')} required>
                    <option value="">Select temple…</option>
                    {temples.filter((t) => t.isActive).map((t) => (
                      <option key={t._id} value={t._id}>{t.emoji} {t.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Date *</label>
                  <input type="date" className="form-control" value={form.date} min={today} onChange={setFm('date')} required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Start Time *</label>
                    <input type="time" className="form-control" value={form.startTime} onChange={setFm('startTime')} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Time *</label>
                    <input type="time" className="form-control" value={form.endTime} onChange={setFm('endTime')} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Total Seats *</label>
                    <input
                      type="number" className="form-control" value={form.totalSeats} min={1}
                      onChange={(e) => setForm((p) => ({ ...p, totalSeats: Number(e.target.value) }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Price per Devotee (₹)</label>
                    <input
                      type="number" className="form-control" value={form.pricePerDevotee} min={0}
                      onChange={(e) => setForm((p) => ({ ...p, pricePerDevotee: Number(e.target.value) }))}
                    />
                  </div>
                </div>
                <button className="btn btn-primary btn-block" type="submit" disabled={saving}>
                  {saving ? 'Saving…' : editId ? 'Update Slot' : 'Create Slot'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
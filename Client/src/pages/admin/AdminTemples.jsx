import { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import styles from './AdminTemples.module.css';

const EMPTY = {
  name: '', location: '', deity: '', description: '',
  emoji: '🛕', darshanStartTime: '05:00', darshanEndTime: '21:00',
  pricePerDevotee: 0,
};

export default function AdminTemples() {
  const [temples,   setTemples]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId,    setEditId]    = useState(null);
  const [form,      setForm]      = useState(EMPTY);
  const [saving,    setSaving]    = useState(false);

  const fetchTemples = () =>
    api.get('/temples').then((r) => setTemples(r.data.temples)).finally(() => setLoading(false));

  useEffect(() => { fetchTemples(); }, []);

  const openCreate = () => {
    setEditId(null);
    setForm(EMPTY);
    setShowModal(true);
  };

  const openEdit = (t) => {
    setEditId(t._id);
    setForm({
      name:             t.name,
      location:         t.location,
      deity:            t.deity,
      description:      t.description || '',
      emoji:            t.emoji || '🛕',
      darshanStartTime: t.darshanStartTime,
      darshanEndTime:   t.darshanEndTime,
      pricePerDevotee:  t.pricePerDevotee,
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await api.put(`/temples/${editId}`, form);
        toast.success('Temple updated');
      } else {
        await api.post('/temples', form);
        toast.success('Temple created');
      }
      setShowModal(false);
      fetchTemples();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (id) => {
    if (!confirm('Deactivate this temple?')) return;
    try {
      await api.delete(`/temples/${id}`);
      toast.success('Temple deactivated');
      fetchTemples();
    } catch {
      toast.error('Action failed');
    }
  };

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div>
      <div className={styles.topBar}>
        <div>
          <h2 style={{ fontSize: 22 }}>Temples</h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            Manage all temple listings
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Temple</button>
      </div>

      <div className="card card-body">
        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Temple</th><th>Location</th><th>Deity</th>
                  <th>Price</th><th>Timings</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {temples.map((t) => (
                  <tr key={t._id}>
                    <td><strong>{t.emoji} {t.name}</strong></td>
                    <td style={{ fontSize: 13 }}>{t.location}</td>
                    <td>{t.deity}</td>
                    <td>{t.pricePerDevotee === 0 ? 'Free' : `₹${t.pricePerDevotee}`}</td>
                    <td style={{ fontSize: 12 }}>{t.darshanStartTime} – {t.darshanEndTime}</td>
                    <td>
                      <span className={`badge ${t.isActive ? 'badge-green' : 'badge-red'}`}>
                        {t.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-outline btn-sm" onClick={() => openEdit(t)}>Edit</button>
                        {t.isActive && (
                          <button className="btn btn-danger btn-sm" onClick={() => handleDeactivate(t._id)}>
                            Deactivate
                          </button>
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

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal modal-lg">
            <div className="modal-header">
              <div>
                <div className="modal-title">{editId ? 'Edit Temple' : 'Add New Temple'}</div>
              </div>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSave}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Temple Name *</label>
                    <input className="form-control" value={form.name} onChange={set('name')} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Emoji Icon</label>
                    <input className="form-control" value={form.emoji} onChange={set('emoji')} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Location *</label>
                    <input className="form-control" value={form.location} onChange={set('location')} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Deity *</label>
                    <input className="form-control" value={form.deity} onChange={set('deity')} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <input className="form-control" value={form.description} onChange={set('description')} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Darshan Start Time *</label>
                    <input type="time" className="form-control" value={form.darshanStartTime} onChange={set('darshanStartTime')} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Darshan End Time *</label>
                    <input type="time" className="form-control" value={form.darshanEndTime} onChange={set('darshanEndTime')} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Price per Devotee (₹) — 0 for free</label>
                  <input
                    type="number" className="form-control" value={form.pricePerDevotee} min={0}
                    onChange={(e) => setForm((p) => ({ ...p, pricePerDevotee: Number(e.target.value) }))}
                  />
                </div>
                <button className="btn btn-primary btn-block" type="submit" disabled={saving}>
                  {saving ? 'Saving…' : editId ? 'Update Temple' : 'Create Temple'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
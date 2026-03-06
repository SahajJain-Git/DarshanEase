import { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import styles from './AdminUsers.module.css';

export default function AdminUsers() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');

  const fetchUsers = () =>
    api.get('/admin/users')
      .then((r) => setUsers(r.data.users))
      .finally(() => setLoading(false));

  useEffect(() => { fetchUsers(); }, []);

  const handleToggle = async (id) => {
    try {
      await api.put(`/admin/users/${id}/toggle`);
      toast.success('User status updated');
      fetchUsers();
    } catch { toast.error('Action failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Permanently delete this user? This cannot be undone.')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User deleted');
      fetchUsers();
    } catch { toast.error('Delete failed'); }
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.phone && u.phone.includes(q))
    );
  });

  return (
    <div>
      <div className={styles.topBar}>
        <div>
          <h2 style={{ fontSize: 22 }}>Users</h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            Manage registered devotee accounts
          </p>
        </div>
        <span className="badge badge-blue" style={{ fontSize: 13, padding: '6px 14px' }}>
          {users.length} total
        </span>
      </div>

      <div className="card card-body" style={{ marginBottom: 18 }}>
        <input
          className="form-control"
          style={{ maxWidth: 400 }}
          placeholder="Search by name, email or phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="card card-body">
        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state" style={{ padding: '32px 0' }}>
            <div className="eso">👥</div>
            <h3>No users found</h3>
            <p>{search ? 'Try a different search' : 'No devotees have registered yet'}</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th><th>Email</th><th>Phone</th>
                  <th>Joined</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u._id}>
                    <td><strong>{u.name}</strong></td>
                    <td style={{ fontSize: 13 }}>{u.email}</td>
                    <td style={{ fontSize: 13 }}>{u.phone || '—'}</td>
                    <td style={{ fontSize: 12 }}>
                      {new Date(u.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })}
                    </td>
                    <td>
                      <span className={`badge ${u.isActive ? 'badge-green' : 'badge-red'}`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          className={`btn btn-sm ${u.isActive ? 'btn-outline' : 'btn-success'}`}
                          onClick={() => handleToggle(u._id)}
                        >
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(u._id)}
                        >
                          Delete
                        </button>
                      </div>
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
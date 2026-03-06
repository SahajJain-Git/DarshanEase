import { useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [tab,     setTab]     = useState('info');
  const [saving,  setSaving]  = useState(false);

  const [infoForm, setInfoForm] = useState({
    name:    user?.name    || '',
    phone:   user?.phone   || '',
    address: user?.address || '',
  });

  const [pwForm, setPwForm] = useState({
    currentPassword:  '',
    newPassword:      '',
    confirmPassword:  '',
  });

  const handleInfoSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/auth/profile', infoForm);
      updateUser(res.data.user);
      toast.success('Profile updated! ✅');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setSaving(true);
    try {
      await api.put('/auth/change-password', pwForm);
      toast.success('Password changed! ✅');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Change failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-wrap">
      <div className="page-header">
        <span className="eyebrow">✦ Your Account</span>
        <h1>My Profile</h1>
      </div>

      <div className="section">
        <div className="container" style={{ maxWidth: 660 }}>

          {/* Profile hero */}
          <div className={styles.hero}>
            <div className={styles.avatar}>{user?.name?.[0]?.toUpperCase()}</div>
            <div>
              <div className={styles.heroName}>{user?.name}</div>
              <div className={styles.heroEmail}>{user?.email}</div>
              <div style={{ marginTop: 10 }}>
                <span className={`badge ${user?.role === 'admin' ? 'badge-orange' : 'badge-green'}`}>
                  {user?.role?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs">
            <button className={`tab-btn ${tab === 'info'     ? 'active' : ''}`} onClick={() => setTab('info')}>
              Personal Info
            </button>
            <button className={`tab-btn ${tab === 'password' ? 'active' : ''}`} onClick={() => setTab('password')}>
              Change Password
            </button>
          </div>

          {/* Info form */}
          {tab === 'info' && (
            <form className="card card-body" onSubmit={handleInfoSave}>
              <h3 className="card-title" style={{ marginBottom: 22 }}>Personal Information</h3>

              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  className="form-control"
                  value={infoForm.name}
                  onChange={(e) => setInfoForm((p) => ({ ...p, name: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address (read-only)</label>
                <input className="form-control" value={user?.email} disabled />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    className="form-control"
                    placeholder="+91 98765 43210"
                    value={infoForm.phone}
                    onChange={(e) => setInfoForm((p) => ({ ...p, phone: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">City / Address</label>
                  <input
                    className="form-control"
                    placeholder="Your city"
                    value={infoForm.address}
                    onChange={(e) => setInfoForm((p) => ({ ...p, address: e.target.value }))}
                  />
                </div>
              </div>

              <button className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </form>
          )}

          {/* Password form */}
          {tab === 'password' && (
            <form className="card card-body" onSubmit={handlePasswordSave}>
              <h3 className="card-title" style={{ marginBottom: 22 }}>Change Password</h3>

              {[
                ['currentPassword',  'Current Password',  'Enter your current password'],
                ['newPassword',      'New Password',      'At least 6 characters'],
                ['confirmPassword',  'Confirm Password',  'Repeat new password'],
              ].map(([key, label, placeholder]) => (
                <div className="form-group" key={key}>
                  <label className="form-label">{label}</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder={placeholder}
                    value={pwForm[key]}
                    onChange={(e) => setPwForm((p) => ({ ...p, [key]: e.target.value }))}
                    required
                    minLength={key !== 'currentPassword' ? 6 : undefined}
                  />
                </div>
              ))}

              <button className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? 'Updating…' : 'Update Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}   
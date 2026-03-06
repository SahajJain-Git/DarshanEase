import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [open, setOpen] = useState(false);

  const active = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully 🙏');
    navigate('/');
    setOpen(false);
  };

  const close = () => setOpen(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.inner}>
        {/* Brand */}
        <Link to="/" className={styles.brand} onClick={close}>
          <span className={styles.brandIcon}>🛕</span>
          <div>
            <div className={styles.brandName}>DarshanEase</div>
            <div className={styles.brandTagline}>Sacred Journey Awaits</div>
          </div>
        </Link>

        {/* Desktop links */}
        <div className={styles.links}>
          <Link to="/"           className={`${styles.link} ${active('/')            ? styles.active : ''}`}>Home</Link>
          <Link to="/temples"    className={`${styles.link} ${active('/temples')     ? styles.active : ''}`}>Temples</Link>
          {user && (
            <Link to="/my-bookings" className={`${styles.link} ${active('/my-bookings') ? styles.active : ''}`}>My Bookings</Link>
          )}
          {isAdmin && (
            <Link to="/admin" className={`${styles.link} ${styles.adminLink}`}>Admin Panel</Link>
          )}
        </div>

        {/* Auth area */}
        <div className={styles.auth}>
          {user ? (
            <>
              <Link to="/profile" className={styles.avatar} title={user.name}>
                {user.name?.[0]?.toUpperCase()}
              </Link>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login"    className="btn btn-ghost   btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className={styles.hamburger} onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className={styles.mobileMenu}>
          <Link to="/"           onClick={close}>Home</Link>
          <Link to="/temples"    onClick={close}>Temples</Link>
          {user && <Link to="/my-bookings" onClick={close}>My Bookings</Link>}
          {user && <Link to="/profile"     onClick={close}>Profile</Link>}
          {isAdmin && <Link to="/admin"    onClick={close}>Admin Panel</Link>}
          <div className={styles.mobileDivider} />
          {user
            ? <button onClick={handleLogout}>Sign Out</button>
            : <>
                <Link to="/login"    onClick={close}>Sign In</Link>
                <Link to="/register" onClick={close}>Register</Link>
              </>
          }
        </div>
      )}
    </nav>
  );
}
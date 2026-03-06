import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import styles from './AdminLayout.module.css';

const NAV = [
  { to: '/admin',          icon: '📊', label: 'Dashboard', end: true },
  { to: '/admin/temples',  icon: '🛕', label: 'Temples'  },
  { to: '/admin/slots',    icon: '⏰', label: 'Slots'    },
  { to: '/admin/bookings', icon: '🎟️', label: 'Bookings' },
  { to: '/admin/users',    icon: '👥', label: 'Users'    },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Signed out 🙏');
    navigate('/');
  };

  return (
    <div className={styles.layout}>
      {/* ── Sidebar ── */}
      <aside className={styles.sidebar}>
        {/* Brand */}
        <div className={styles.sideBrand}>
          <span className={styles.sideBrandIcon}>🛕</span>
          <div>
            <div className={styles.sideBrandName}>DarshanEase</div>
            <div className={styles.sideBrandRole}>Admin Panel</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          <p className={styles.navSection}>Navigation</p>
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navActive : ''}`
              }
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className={styles.sideFooter}>
          <div className={styles.adminInfo}>
            <div className={styles.adminAvatar}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className={styles.adminMeta}>
              <div className={styles.adminName}>{user?.name}</div>
              <div className={styles.adminEmail}>{user?.email}</div>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            🚪 Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
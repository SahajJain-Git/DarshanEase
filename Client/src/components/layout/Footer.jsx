import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.grid}>
          {/* Brand */}
          <div>
            <div className={styles.brand}>🛕 DarshanEase</div>
            <p className={styles.tagline}>
              Your trusted companion for seamless temple darshan booking.
              Connect with the divine, effortlessly.
            </p>
          </div>

          {/* Platform */}
          <div>
            <div className={styles.colTitle}>Platform</div>
            <Link to="/temples">Explore Temples</Link>
            <Link to="/my-bookings">My Bookings</Link>
            <Link to="/profile">My Profile</Link>
            <Link to="/register">Create Account</Link>
          </div>

          {/* Support */}
          <div>
            <div className={styles.colTitle}>Support</div>
            <span>Help Center</span>
            <span>Contact Us</span>
            <span>Cancellation Policy</span>
            <span>Privacy Policy</span>
          </div>

          {/* Contact */}
          <div>
            <div className={styles.colTitle}>Contact</div>
            <span>📧 support@darshanese.com</span>
            <span>📞 1800-DARSHAN (toll-free)</span>
            <span>🕐 24 × 7 Support</span>
            <span>📍 Varanasi, India</span>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>
            © {new Date().getFullYear()}{' '}
            <b className={styles.gold}>DarshanEase</b>. All rights reserved.
          </span>
          <span>Made with ❤️ for devotees everywhere 🙏</span>
        </div>
      </div>
    </footer>
  );
}
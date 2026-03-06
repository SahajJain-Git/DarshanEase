import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import TempleCard from '../../components/common/TempleCard';
import styles from './HomePage.module.css';

export default function HomePage() {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const featuredRef = useRef(null);

  useEffect(() => {
    api.get('/temples')
      .then((res) => setTemples(res.data.temples.slice(0, 6)))
      .finally(() => setLoading(false));
  }, []);

  const scrollToTemples = () =>
    featuredRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className={`page-wrap ${styles.home}`}>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={`container ${styles.heroInner}`}>
          {/* Text side */}
          <div className={`${styles.heroText} fade-up`}>
            <span className="eyebrow">✦ Sacred Digital Experience</span>
            <h1 className={styles.heroTitle}>
              Your Gateway to{' '}
              <span className={styles.heroAccent}>Divine</span>{' '}
              Darshan
            </h1>
            <p className={styles.heroDesc}>
              Reserve your sacred time at India's most revered temples. Seamless
              booking, instant confirmation, and digital tickets — all in one place.
            </p>
            <div className={styles.heroCta}>
              <button className="btn btn-primary btn-lg" onClick={scrollToTemples}>
                Explore Temples 🛕
              </button>
              <Link to="/register" className="btn btn-outline btn-lg">
                Create Account
              </Link>
            </div>

            {/* Stats bar */}
            <div className={styles.statsBar}>
              {[
                ['200+',  'Sacred Temples'],
                ['1.2M+', 'Devotees Served'],
                ['₹5Cr+', 'Donations Processed'],
              ].map(([num, lbl]) => (
                <div key={lbl} className={styles.stat}>
                  <div className={styles.statNum}>{num}</div>
                  <div className={styles.statLbl}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual card */}
          <div className={`${styles.heroVisual} fade-in`}>
            <div className={styles.heroCard}>
              <div className={styles.heroCardImg}>🛕</div>
              <div className={styles.heroCardName}>Tirupati Balaji</div>
              <div className={styles.heroCardLoc}>📍 Tirumalai, Andhra Pradesh</div>
              <div className={styles.heroCardRow}>
                <span className={styles.heroCardPrice}>₹300</span>
                <button className="btn btn-primary btn-sm" onClick={scrollToTemples}>
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Temples ── */}
      <section className="section" ref={featuredRef}>
        <div className="container">
          <div className={styles.sectionHead}>
            <span className="eyebrow">✦ Sacred Destinations</span>
            <h2>Featured Temples</h2>
            <p className={styles.sectionSub}>
              Book darshan slots at India's most beloved temples
            </p>
          </div>

          {loading ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : (
            <div className="grid-auto">
              {temples.map((t, i) => (
                <TempleCard key={t._id} temple={t} index={i} />
              ))}
            </div>
          )}

          <div className={styles.sectionCta}>
            <Link to="/temples" className="btn btn-outline btn-lg">
              View All Temples →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features section ── */}
      <section className={`section ${styles.featSection}`}>
        <div className="container">
          <div className={styles.sectionHead}>
            <span className="eyebrow" style={{ color: 'var(--gold-lt)' }}>
              ✦ Platform Features
            </span>
            <h2 style={{ color: '#FDF6EC' }}>Everything You Need</h2>
          </div>
          <div className="grid-3">
            {[
              ['🔐', 'Secure Auth',        'JWT-based login with protected routes for users and admins.'],
              ['⏰', 'Real-Time Slots',    'Live seat counts — book instantly before slots fill up.'],
              ['💳', 'Easy Payments',      'Cards, UPI, Net Banking and wallets all supported.'],
              ['🙏', 'Online Donations',   'Make temple offerings directly while booking.'],
              ['🎟️', 'Digital E-Tickets', 'QR-coded electronic tickets for smooth temple entry.'],
              ['📊', 'Admin Dashboard',    'Full control over temples, slots, bookings, and analytics.'],
            ].map(([icon, title, desc], i) => (
              <div key={i} className={styles.featCard}>
                <div className={styles.featIcon}>{icon}</div>
                <h4 className={styles.featTitle}>{title}</h4>
                <p className={styles.featDesc}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className={`section ${styles.ctaSection}`}>
        <div className="container">
          <div className={styles.ctaBox}>
            <span className="eyebrow" style={{ color: 'var(--gold-lt)' }}>
              ✦ Start Your Journey
            </span>
            <h2 style={{ color: '#FDF6EC', marginBottom: 12 }}>
              Begin Your Sacred Journey Today
            </h2>
            <p className={styles.ctaSub}>
              Join over 1.2 million devotees who trust DarshanEase for their temple visits.
            </p>
            <div className={styles.ctaBtns}>
              <Link to="/register" className="btn btn-primary btn-lg">
                Register Free →
              </Link>
              <Link to="/temples" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(240,192,64,0.5)', color: 'var(--gold-lt)' }}>
                Browse Temples
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
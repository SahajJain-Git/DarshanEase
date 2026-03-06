import { Link } from 'react-router-dom';
import styles from './TempleCard.module.css';

const GRADIENTS = [
  'linear-gradient(135deg, #F59E0B, #D97706)',
  'linear-gradient(135deg, #E8631A, #9B4518)',
  'linear-gradient(135deg, #F0C040, #D4A017)',
  'linear-gradient(135deg, #C084FC, #9333EA)',
  'linear-gradient(135deg, #34D399, #059669)',
  'linear-gradient(135deg, #60A5FA, #2563EB)',
];

/**
 * TempleCard
 * Reusable card displayed in grids on Home and Temples pages.
 * Clicking "Book Darshan" navigates to /temples/:id.
 */
export default function TempleCard({ temple, index = 0 }) {
  const gradient = GRADIENTS[index % GRADIENTS.length];

  return (
    <article
      className={`card ${styles.card} fade-up`}
      style={{ animationDelay: `${index * 0.07}s` }}
    >
      {/* Hero area */}
      <div className={styles.imgArea} style={{ background: gradient }}>
        <span className={styles.emoji}>{temple.emoji || '🛕'}</span>
        <div className={styles.imgOverlay} />
        <div className={styles.priceBadge}>
          {temple.pricePerDevotee === 0
            ? 'Free Entry'
            : `₹${temple.pricePerDevotee}/devotee`}
        </div>
      </div>

      {/* Info */}
      <div className={styles.body}>
        <h3 className={styles.name}>{temple.name}</h3>
        <p className={styles.location}>📍 {temple.location}</p>
        <p className={styles.deity}>
          🙏 Deity: <strong>{temple.deity}</strong>
        </p>
        {temple.description && (
          <p className={styles.desc}>
            {temple.description.length > 95
              ? temple.description.slice(0, 95) + '…'
              : temple.description}
          </p>
        )}

        <div className={styles.footer}>
          <div className={styles.timing}>
            ⏰&nbsp;{temple.darshanStartTime} – {temple.darshanEndTime}
          </div>
          <Link to={`/temples/${temple._id}`} className="btn btn-primary btn-sm">
            Book Darshan →
          </Link>
        </div>
      </div>
    </article>
  );
}
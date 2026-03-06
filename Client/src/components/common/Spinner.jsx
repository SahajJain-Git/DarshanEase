import styles from './Spinner.module.css';

/**
 * Spinner
 * fullPage=true  → covers the entire viewport (used while loading routes)
 * fullPage=false → inline spinner inside .spinner-wrap
 */
export default function Spinner({ fullPage = false }) {
  if (fullPage) {
    return (
      <div className={styles.fullPage}>
        <div className={styles.logo}>🛕</div>
        <div className={styles.ring} />
        <p className={styles.text}>Loading…</p>
      </div>
    );
  }
  return (
    <div className="spinner-wrap">
      <div className="spinner" />
    </div>
  );
}
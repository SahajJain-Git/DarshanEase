import { useEffect, useState } from 'react';
import api from '../../api/axios';
import TempleCard from '../../components/common/TempleCard';
import styles from './TemplesPage.module.css';

export default function TemplesPage() {
  const [temples,  setTemples]  = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search,   setSearch]   = useState('');
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    api.get('/temples')
      .then((res) => {
        setTemples(res.data.temples);
        setFiltered(res.data.temples);
      })
      .finally(() => setLoading(false));
  }, []);

  // Client-side search filter
  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      temples.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.location.toLowerCase().includes(q) ||
          t.deity.toLowerCase().includes(q)
      )
    );
  }, [search, temples]);

  return (
    <div className="page-wrap">
      {/* Page header */}
      <div className="page-header">
        <span className="eyebrow">✦ Sacred Destinations</span>
        <h1>Explore Temples</h1>
        <p>Book darshan slots at India's most revered temples</p>
      </div>

      <div className="section">
        <div className="container">
          {/* Search bar */}
          <div className={styles.searchWrap}>
            <div className={styles.searchBar}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                className={styles.searchInput}
                placeholder="Search by temple, location or deity…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button className={styles.clearBtn} onClick={() => setSearch('')}>✕</button>
              )}
            </div>
          </div>

          {/* Results count */}
          {!loading && (
            <p className={styles.resultCount}>
              {filtered.length} temple{filtered.length !== 1 ? 's' : ''} found
            </p>
          )}

          {loading ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="eso">🔍</div>
              <h3>No temples found</h3>
              <p>Try a different search term</p>
            </div>
          ) : (
            <div className="grid-auto">
              {filtered.map((t, i) => (
                <TempleCard key={t._id} temple={t} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
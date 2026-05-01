import '../styles/Skeleton.css';

export function HeaderSkeleton() {
  return (
    <>
      <div className="skeleton skeleton-silhouette" />
      <div className="player-info">
        <div className="skeleton skeleton-label" />
        <div className="skeleton skeleton-name" />
        <div className="skeleton-stats">
          {[64, 64, 72, 72, 72].map((w, i) => (
            <div className="skeleton-stat" key={i}>
              <div className="skeleton skeleton-stat-value" style={{ width: w }} />
              <div className="skeleton skeleton-stat-label" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export function FiltersSkeleton() {
  return (
    <div className="filters">
      <div className="filter-group">
        <div className="skeleton skeleton-filter-label" />
        <div className="filter-options">
          {[40, 80, 56, 48, 52].map((w, i) => (
            <div className="skeleton skeleton-filter-btn" style={{ width: w }} key={i} />
          ))}
        </div>
      </div>
      <div className="filter-group">
        <div className="skeleton skeleton-filter-label" />
        <div className="filter-options">
          {[40, 32, 32, 32, 32, 32].map((w, i) => (
            <div className="skeleton skeleton-filter-btn" style={{ width: w }} key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function CourtSkeleton() {
  return <div className="skeleton skeleton-court" />;
}

export function ZoneSkeleton() {
  return (
    <div style={{ width: '100%', maxWidth: '1200px', marginTop: '32px', border: '1px solid #1e1e2e', borderRadius: '4px', overflow: 'hidden' }}>
      <div className="skeleton skeleton-zone-header" />
      {Array.from({ length: 7 }).map((_, i) => (
        <div className="skeleton-zone-row" key={i}>
          <div className="skeleton skeleton-zone-cell" style={{ width: '60%' }} />
          <div className="skeleton skeleton-zone-cell" />
          <div className="skeleton skeleton-zone-cell" />
          <div className="skeleton skeleton-zone-cell" />
          <div className="skeleton skeleton-zone-cell" />
        </div>
      ))}
    </div>
  );
}

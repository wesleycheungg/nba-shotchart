import '../styles/StatsBar.css';

export default function StatsBar({ shots }) {
  const made = shots.filter(s => s.shot_made === 1).length;
  const missed = shots.length - made;
  const pct = shots.length > 0
    ? ((made / shots.length) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="stats-bar">
      <Stat value={made} label="Made" color="#00e5a0" />
      <Stat value={missed} label="Missed" color="#ff3c5f" />
      <Stat value={`${pct}%`} label="FG%" color="#f5c518" />
    </div>
  );
}

function Stat({ value, label, color }) {
  return (
    <div className="stat">
      <span className="stat-value" style={{ color }}>{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

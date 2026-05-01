import '../styles/Filters.css';

const SHOT_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'jump', label: 'Jump Shots' },
  { id: 'layup', label: 'Layups' },
  { id: 'dunk', label: 'Dunks' },
  { id: 'hook', label: 'Hooks' },
];

const QUARTERS = [
  { id: 0, label: 'All' },
  { id: 1, label: 'Q1' },
  { id: 2, label: 'Q2' },
  { id: 3, label: 'Q3' },
  { id: 4, label: 'Q4' },
  { id: 5, label: 'OT' },
];

function matchCategory(actionType, category) {
  if (category === 'all') return true;
  const lower = actionType.toLowerCase();
  if (category === 'jump') return lower.includes('jump') || lower.includes('fadeaway') || lower.includes('step back') || lower.includes('pullup') || lower.includes('pull-up') || lower.includes('turnaround');
  if (category === 'layup') return lower.includes('layup') || lower.includes('finger roll');
  if (category === 'dunk') return lower.includes('dunk');
  if (category === 'hook') return lower.includes('hook');
  return true;
}

export function filterShots(shots, shotType, quarter) {
  return shots.filter(s => {
    if (!matchCategory(s.action_type, shotType)) return false;
    if (quarter > 0 && s.period !== quarter) return false;
    return true;
  });
}

export default function Filters({ shotType, onShotTypeChange, quarter, onQuarterChange }) {
  return (
    <div className="filters">
      <div className="filter-group">
        <span className="filter-label">Shot Type</span>
        <div className="filter-options">
          {SHOT_CATEGORIES.map(c => (
            <button
              key={c.id}
              className={`filter-btn ${shotType === c.id ? 'active' : ''}`}
              onClick={() => onShotTypeChange(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <span className="filter-label">Quarter</span>
        <div className="filter-options">
          {QUARTERS.map(q => (
            <button
              key={q.id}
              className={`filter-btn ${quarter === q.id ? 'active' : ''}`}
              onClick={() => onQuarterChange(q.id)}
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

import '../styles/ChartToggle.css';

const VIEWS = [
  { id: 'dots', label: 'Individual Shots' },
  { id: 'hex',  label: 'Shooting Zones' },
  { id: 'heat', label: 'Shot Frequency' },
];

export default function ChartToggle({ value, onChange }) {
  return (
    <div className="filter-group">
      <span className="filter-label">Shot Charts</span>
      <div className="filter-options">
        {VIEWS.map(v => (
          <button
            key={v.id}
            className={`filter-btn ${value === v.id ? 'active' : ''}`}
            onClick={() => onChange(v.id)}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}

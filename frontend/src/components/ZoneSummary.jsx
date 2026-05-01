import '../styles/ZoneSummary.css';

export default function ZoneSummary({ zones }) {
  return (
    <div className="zone-summary">
      <div className="zone-summary-header">
        <div>Zone</div><div>Attempts</div><div>Made</div><div>Missed</div><div>FG%</div>
      </div>
      {zones.map((zone, i) => (
        <div key={i} className="zone-summary-row">
          <div>{zone.shot_zone}</div>
          <div>{zone.attempts}</div>
          <div className="zone-made">{zone.made}</div>
          <div className="zone-missed">{zone.attempts - zone.made}</div>
          <div className="zone-pct">{zone.percentage}%</div>
        </div>
      ))}
    </div>
  );
}

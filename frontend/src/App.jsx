import { useState, useEffect, useMemo, useRef } from 'react';
import Court from './components/Court';
import ShotChart from './components/ShotChart';
import HexChart from './components/HexChart';
import HeatMap from './components/HeatMap';
import Header from './components/Header';
import ZoneSummary from './components/ZoneSummary';
import ChartToggle from './components/ChartToggle';
import Filters, { filterShots } from './components/Filters';
import KeyInsight from './components/KeyInsight';
import { PLAYERS } from './components/Header';
import { CourtSkeleton, ZoneSkeleton, FiltersSkeleton } from './components/Skeleton';
import './styles/App.css';

export default function App() {
  const [shots, setShots] = useState([]);
  const [zones, setZones] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);
  const [chartType, setChartType] = useState('dots');
  const [showMade, setShowMade] = useState(true);
  const [showMissed, setShowMissed] = useState(true);
  const [shotType, setShotType] = useState('all');
  const [quarter, setQuarter] = useState(0);
  const [playerId, setPlayerId] = useState(201939);
  const [playerStats, setPlayerStats] = useState({ ppg: 0, ft_pct: 0 });
  const [playerBio, setPlayerBio] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setError(null);
      try {
        const api = import.meta.env.VITE_API_URL;
        const [shotsRes, zonesRes, statsRes, bioRes] = await Promise.all([
          fetch(`${api}/api/shots?player_id=${playerId}`),
          fetch(`${api}/api/shots/summary?player_id=${playerId}`),
          fetch(`${api}/api/player/stats?player_id=${playerId}`),
          fetch(`${api}/api/player/bio?player_id=${playerId}`)
        ]);
        setShots(await shotsRes.json());
        setZones(await zonesRes.json());
        setPlayerStats(await statsRes.json());
        setPlayerBio(await bioRes.json());
      } catch (err) {
        setError('Failed to load data');
      } finally {
        if (!hasFetched.current) {
          hasFetched.current = true;
          setInitialLoading(false);
        }
      }
    }
    fetchData();
  }, [playerId]);

  const filtered = useMemo(
    () => filterShots(shots, shotType, quarter),
    [shots, shotType, quarter]
  );

  function renderChart() {
    if (chartType === 'heat') return <HeatMap shots={filtered} />;
    if (chartType === 'hex') return <HexChart shots={filtered} />;
    return <ShotChart shots={filtered} showMade={showMade} showMissed={showMissed} />;
  }

  return (
    <>
      <Header shots={shots} loading={initialLoading} error={error} playerId={playerId} onPlayerChange={setPlayerId} playerStats={playerStats} playerBio={playerBio} />

      {!initialLoading && (
        <KeyInsight zones={zones} playerName={PLAYERS.find(p => p.id === playerId)?.name} shots={shots} />
      )}

      {initialLoading ? <FiltersSkeleton /> : (
        <div className="filters-row">
          <Filters
            shotType={shotType}
            onShotTypeChange={setShotType}
            quarter={quarter}
            onQuarterChange={setQuarter}
          />
          <ChartToggle value={chartType} onChange={setChartType} />
          <FilterStats shots={filtered} />
        </div>
      )}

      <div className="court-wrapper">
        {initialLoading
          ? <CourtSkeleton />
          : <Court>{renderChart()}</Court>
        }
      </div>

      <div className="legend">
        {chartType === 'dots' && (
          <>
            <ToggleItem
              color="#22c55e"
              label="Made"
              checked={showMade}
              onChange={setShowMade}
            />
            <ToggleItem
              color="#e53935"
              label="Missed"
              opacity={0.5}
              checked={showMissed}
              onChange={setShowMissed}
            />
          </>
        )}
        {chartType === 'hex' && (
          <>
            <LegendItem color="#00e5a0" label="≥ 58%" />
            <LegendItem color="#7dcd8e" label="51–57%" />
            <LegendItem color="#f5c518" label="45–50%" />
            <LegendItem color="#ff8c42" label="38–44%" />
            <LegendItem color="#ff3c5f" label="< 38%" />
            <span className="legend-item" style={{ color: '#999', fontSize: '0.65rem', letterSpacing: '0.1em' }}>FG%</span>
          </>
        )}
        {chartType === 'heat' && (
          <div className="heat-legend">
            <span className="heat-legend-label">Shot frequency</span>
            <div className="heat-legend-bar" />
            <div className="heat-legend-labels">
              <span>lower</span>
              <span>higher</span>
            </div>
          </div>
        )}
      </div>

      {initialLoading ? <ZoneSkeleton /> : <ZoneSummary zones={zones} />}
    </>
  );
}

function FilterStats({ shots }) {
  const fga = shots.length;
  const fgm = shots.filter(s => s.shot_made === 1).length;
  const pct = fga > 0 ? ((fgm / fga) * 100).toFixed(1) : '0.0';

  return (
    <div className="filter-stats">
      <span className="filter-stat">
        <span className="filter-stat-value" style={{ color: '#1a1a1a' }}>{fgm}</span>
        <span className="filter-stat-label">FGM</span>
      </span>
      <span className="filter-stat-sep">/</span>
      <span className="filter-stat">
        <span className="filter-stat-value">{fga}</span>
        <span className="filter-stat-label">FGA</span>
      </span>
      <span className="filter-stat">
        <span className="filter-stat-pct" style={{ color: '#1a1a1a' }}>{pct}%</span>
        <span className="filter-stat-label">FG%</span>
      </span>
    </div>
  );
}

function LegendItem({ color, label, opacity = 1 }) {
  return (
    <div className="legend-item">
      <div className="legend-dot" style={{ background: color, opacity }} />
      {label}
    </div>
  );
}

function ToggleItem({ color, label, opacity = 1, checked, onChange }) {
  return (
    <label className="legend-item toggle-label">
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="toggle-checkbox"
      />
      <div className="legend-dot" style={{ background: color, opacity: checked ? opacity : 0.2 }} />
      <span style={{ opacity: checked ? 1 : 0.4 }}>{label}</span>
    </label>
  );
}
